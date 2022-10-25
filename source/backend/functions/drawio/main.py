import urllib.parse
from xml.etree.ElementTree import Element, SubElement, tostring
from type_definitions import get_type_definitions
from zlib import compress
from base64 import b64encode
from operator import itemgetter

# standardized drawing margin based on cytoscape graphing library defaults
drawing_margin = 30
# Get a dictionary of icon styles based on cytoscape 'types'
types = get_type_definitions()


class Node:
    """
    Classes:
    - Node = stores hierarchical and label information for drawing nodes and edge
    in draw.io. Height and width values are dynamically created based on children
    - Edge = Connection info for nodes, produce arrows
    """

    def __init__(self, node_id, node_type, label, title, level, center_x, center_y, is_end_node):
        self.node_id = node_id
        self.node_type = node_type
        self.label = label
        self.title = title
        self.level = level
        self.center_x = center_x
        self.center_y = center_y
        self.style = types[self.node_type]['style']
        self.is_end_node = is_end_node
        self.children = []

    @property
    def height(self):
        if self.is_end_node and 'height' in types[self.node_type]:
            return types[self.node_type]['height']
        elif len(self.children) == 0:
            return None
        else:
            children_points = list(
                filter(None, map(lambda c: (c.height*0.5 + c.center_y), self.children)))
            furthest_point = max(children_points)
            result = furthest_point + drawing_margin - self.y
            return result

    @property
    def width(self):
        if 'width' in types[self.node_type]:
            return types[self.node_type]['width']
        elif len(self.children) == 0:
            return None
        else:
            children_points = list(
                filter(None, map(lambda c: (c.width*0.5 + c.center_x), self.children)))
            furthest_point = max(children_points)
            result = 2*(furthest_point + drawing_margin - self.center_x)
            return result

    @property
    def x(self):
        if self.is_end_node:
            return self.center_x - 0.5*self.width
        elif len(self.children) == 0:
            return None
        else:
            children_points = list(
                filter(None, map(lambda c: (c.center_x - 0.5*c.width), self.children)))
            min_point = min(children_points)
            result = (min_point - drawing_margin)
            return result

    @property
    def y(self):
        if self.is_end_node:
            return self.center_y - 0.5*self.height
        elif len(self.children) == 0:
            return None
        else:
            children_points = list(
                filter(None, map(lambda c: (c.center_y - 0.5*c.height), self.children)))
            min_point = min(children_points)
            result = (min_point - drawing_margin)
            return result

    def add_child(self, child):
        self.children.append(child)

    def get_xml_object(self):
        # Draw IO Context
        icon = {'style': self.style, 'vertex': '1', 'parent': '1'}
        content = {
            'id': self.node_id,
            'label': self.label,
            self.node_type: self.title
        }
        coords = {
            'x': str(self.x),
            'y': str(self.y),
            'height': str(self.height),
            'width': str(self.width),
            'as': 'geometry'
        }
        # Build object
        obj = Element('object', content)
        styled_obj = SubElement(obj, 'mxCell', icon)
        # SubElement mutates styled_obj
        SubElement(styled_obj, 'mxGeometry', coords)

        return obj


class Edge:
    def __init__(self, edge_id, source, target):
        self.edge_id = edge_id
        self.source = source
        self.target = target
        self.style = types['edge']['style']

    def get_xml_object(self):
        content = {
            'id': self.edge_id,
            'style': self.style,
            'parent': '1',
            'source': self.source,
            'target': self.target,
            'edge': '1'
        }
        coords = {
            'relative': '1',
            'as': 'geometry'
        }
        obj = Element('mxCell', content)
        # SubElement mutates obj
        SubElement(obj, 'mxGeometry', coords)

        return obj


def handler(event, _):
    """
    Main Lambda Handler
    """
    node_dict = dict()

    args = event['arguments']
    nodes = args.get('nodes', [])
    edges = args.get('edges', [])

    for node in nodes:
        node_id, node_type, label, level, title, position = \
            itemgetter('id', 'type', 'label', 'level', 'title', 'position')(node)

        if node_type == 'resource' and 'image' in node:
            node_type = node['image'].split('/')[-1].split('.')[0]

        x = position['x']
        y = position['y']
        is_end_node = not node.get('hasChildren', False)
        parent = node.get('parent')
        node = Node(node_id, node_type, label, title, level, x, y, is_end_node)
        node_dict[node_id] = node

        if parent and parent in node_dict:
            node_dict[parent].add_child(node)

    elements = list(node_dict.values())
    elements.sort(key=lambda x: x.level)

    for edge in edges:
        edge_id, source, target = itemgetter('id', 'source', 'target')(edge)
        edge = Edge(edge_id, source, target)

        elements.append(edge)

    xml_output = produce_xml_output(elements)

    # Compress and encode XML tree
    xml_output_compressed_encoded = deflate_and_base64_encode(xml_output)
    # Convert XML encoded string to URL encoded string
    xml_output_url = urllib.parse.quote(xml_output_compressed_encoded, safe='')
    # Attach XML string to Draw IO URL (Note: Draw IO is not app.diagram.net due to .io vulnerabilities)
    drawio_url = 'https://app.diagrams.net?title=AWS%20Architecture%20Diagram.xml#R' + xml_output_url

    return drawio_url


def produce_xml_output(elements):
    """
    Helper Functions:
    - produce_xml_output = creates XML tree of all diagram nodes and edges
    - deflate_and_base64_encode = returns a compressed, encoded version of XML tree string to pass to Draw IO URL
    """
    # Initialize Parent Nodes in Draw.IO XML Tree
    xml_model = Element('mxGraphModel')
    root = SubElement(xml_model, 'root')

    # Draw IO needs two default cells to start drawing
    default_cell_contents = {'id': '0'}

    # SubElement mutates root
    SubElement(root, 'mxCell', default_cell_contents)
    default_cell_contents = {'id': '1', 'parent': '0'}
    SubElement(root, 'mxCell', default_cell_contents)

    for elem in elements:
        xml_object = elem.get_xml_object()
        root.append(xml_object)

    xml_output = tostring(xml_model)
    return xml_output


def deflate_and_base64_encode(string_val):
    zlibbed_str = compress(string_val)
    compressed_string = zlibbed_str[2:-4]
    return b64encode(compressed_string)
