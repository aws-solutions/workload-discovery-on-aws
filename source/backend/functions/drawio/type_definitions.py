from collections import defaultdict
import zipfile
import urllib.request
import os.path
from base64 import b64encode


def get_type_definitions():
    
    # URL where perspective icon set is hosted
    perspective_icon_url = 'https://perspective-icon-svg-set.s3-eu-west-1.amazonaws.com/perspective-icons.zip'
    perspective_zip = 'perspective-icons.zip'
    
    # Build a dictionary that provides a default AWS Resource Icon if type does not exist in definitions
    default_icon = 'gradientDirection=north;outlineConnect=0;fontColor=#232F3E;gradientColor=#505863;fillColor=#1E262E;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=11;fontStyle=0;fontFamily=Tahoma;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.general;'
    default_icon_size = 43
    
    # Styles pulled from draw.io (that are not )
    type_definitions = {
        'account': {
            'style': 'points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=11;fontStyle=0;fontFamily=Tahoma;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=#232F3E;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3E;dashed=0;'
        },
        'availabilityZone': {
            'style' : 'fillColor=none;strokeColor=#147EBA;dashed=1;verticalAlign=top;fontSize=11;fontStyle=0;fontColor=#147EBA;fontFamily=Tahoma;'
        },
        'edge': {
            'style': 'html=1;endArrow=block;elbow=vertical;startArrow=none;endFill=1;strokeColor=#545B64;rounded=0;jumpStyle=gap;opacity=80;'
        },
        'region': {
            'style' : 'points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=11;fontStyle=0;fontFamily=Tahoma;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_region;strokeColor=#147EBA;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#147EBA;dashed=0;'
        },
        'subnet': {
            'style' : 'points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=11;fontStyle=0;fontFamily=Tahoma;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;strokeColor=#248814;fillColor=#E9F3E6;verticalAlign=top;align=left;spacingLeft=30;fontColor=#248814;dashed=0;'
        },
        'type': {
            'style' : 'fillColor=none;strokeColor=#5A6C86;dashed=1;verticalAlign=top;fontSize=11;fontStyle=0;fontColor=#5A6C86;fontFamily=Tahoma;'
        },
        'vpc': {
            'style' : 'points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=11;fontStyle=0;fontFamily=Tahoma;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc;strokeColor=#248814;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#AAB7B8;dashed=0;'
        }
    }
    
    # If icons don't exist in /tmp, then download them to tmp
    if not os.path.isfile('/tmp/' + perspective_zip):
        with urllib.request.urlopen(perspective_icon_url) as dl_file:
            with open('/tmp/' + perspective_zip, 'wb') as out_file:
                out_file.write(dl_file.read())
    
    zipped_icons = zipfile.ZipFile('/tmp/' + perspective_zip)
    for i in range(len(zipped_icons.namelist())):
        icon_filename = zipped_icons.namelist()[i]
        if (".svg" in icon_filename):
            icon_name = icon_filename[6:-4]
            if icon_name not in type_definitions:
                svg = zipped_icons.read(icon_filename)
                encoded_svg = b64encode(svg).decode()
                style = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;fontSize=11;fontFamily=Tahoma;aspect=fixed;imageAspect=0;image=data:image/svg+xml,' + encoded_svg
                type_definitions[icon_name] = {'style' : style, 'width': default_icon_size, 'height': default_icon_size}

            
    types = defaultdict(lambda: {'style': default_icon, 'height': default_icon_size, 'width': default_icon_size}, type_definitions)
    
    return types
