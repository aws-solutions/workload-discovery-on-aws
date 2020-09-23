export const graphStyle = [
  {
    selector: '.image',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#fff',
      'background-image': 'data(image)',
      'background-fit': 'cover cover',
      'background-opacity': '1',
      // 'width': '30px',
      // 'height': '30px',
      shape: 'square',
      color: '#000',
      // 'bounds-expansion': '100px 100px',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px',
      'border-style': 'data(borderStyle)',
      'border-width': 'data(borderSize)',
      'border-color': 'data(borderColour)'
      // 'overlay-color': 'data(borderColour)',
      // 'overlay-opacity': 'data(borderOpacity)',
    }
  },
  {
    selector: '.vpc',
    style: {
      label: 'data(label)',
      'font-size': '7rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': '#683dc2',
      'background-opacity': '0.05',
      'text-margin-y': '-4.5%',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#683dc2',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': '#683dc2',
      'text-background-color': '#683dc2',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.vpc:active',
    style: {
      label: 'data(label)',
      'overlay-color': '#683dc2',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.subnet',
    style: {
      label: 'data(label)',
      'font-size': '7rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(subnetColour)',
      'background-opacity': '0.05',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': 'data(subnetColour)',
      'text-background-opacity': '1',
      'text-border-color': 'data(subnetColour)',
      'text-background-color': 'data(subnetColour)',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      'text-margin-y': '-4.5%',
      'text-border-width': '2px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.subnet:active',
    style: {
      label: 'data(label)',
      'overlay-color': 'data(subnetColour)',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.type',
    style: {
      label: 'data(label)',
      'font-size': '6rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': '#545B64',
      'background-opacity': '0.05',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#545B64',
      'text-margin-y': '-3%',
      'text-border-width': '1px',
      'text-background-opacity': '1',
      'text-border-color': '#545B64',
      'text-background-color': '#545B64',
      'text-background-shape': 'rectangle',
      'text-background-padding': '3px',
      shape: 'roundrectangle',
      color: '#FAFAFA'
    }
  },
  {
    selector: '.region:active',
    style: {
      label: 'data(label)',
      'overlay-color': 'data(regionColour)',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.region',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-size': '7rem',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'background-opacity': 'data(opacity)',
      'border-style': 'dashed',
      'border-width': 1,
      'border-color': 'data(regionColour)',
      'text-margin-y': '-5%',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': 'data(regionColour)',
      'text-background-color': 'data(regionColour)',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'rectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.availabilityZone:active',
    style: {
      label: 'data(label)',
      'overlay-color': '#f7991f',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.availabilityZone',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-size': '7rem',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'background-opacity': 'data(opacity)',
      'border-style': 'dashed',
      'border-width': 1,
      'border-color': '#f7991f',
      'text-margin-y': '-4.5%',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': '#f7991f',
      'text-background-color': '#f7991f',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'rectangle',
      color: '#000'
    }
  },
  {
    selector: '.account:active',
    style: {
      label: 'data(label)',
      'overlay-color': 'data(accountColour)',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.account',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-size': '8rem',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'background-opacity': 'data(opacity)',
      'text-margin-y': '-5%',
      // 'text-margin-x': '93.5%',
      'border-style': 'dashed',
      'border-width': 1,
      'border-color': 'data(accountColour)',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': 'data(accountColour)',
      'text-background-color': 'data(accountColour)',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'rectangle',
      color: '#fafafa'
    }
  },
  {
    selector: 'node.highlight',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-weight': '900',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#fff',
      'overlay-color': '#545B64',
      'overlay-opacity': '0.45',
      // 'overlay-padding': '-10',
      // 'background-image-opacity': 0.5,
      // 'background-fit': 'contain contain',
      'background-opacity': '1',
      shape: 'square',
      color: '#545B64',
      // 'bounds-expansion': '100px 100px',
      'border-style': 'data(borderStyle)',
      'border-width': 1,
      'border-color': 'data(borderColour)',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px'
    }
  },
  {
    selector: 'node.clicked',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-weight': '900',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#fff',
      // 'overlay-color': '#232f3e',
      // 'overlay-opacity': '0.25',
      // 'overlay-padding': '25',
      // 'background-image-opacity': 0.5,
      // 'background-fit': 'contain contain',
      'background-opacity': '1',
      shape: 'square',
      color: '#232f3e',
      // 'bounds-expansion': '100px 100px',
      'border-style': 'solid',
      'border-width': 3,
      'border-color': '#232f3e',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px'
    }
  },
  {
    selector: 'node.selected',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-weight': '900',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#232f3e',
      // 'overlay-color': '#232f3e',
      // 'overlay-opacity': '0.25',
      // 'overlay-padding': '25',
      // 'background-image-opacity': 0.5,
      // 'background-fit': 'contain contain',
      'background-opacity': '0.5',
      shape: 'square',
      color: '#232f3e',
      // 'bounds-expansion': '100px 100px',
      'border-style': 'solid',
      'border-width': 3,
      'border-color': '#232f3e',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px'
    }
  },
  {
    selector: 'node.softDelete',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#fff',
      'background-image': 'data(image)',
      'background-fit': 'cover cover',
      'background-opacity': '0.5',
      shape: 'square',
      color: '#000',
      // 'bounds-expansion': '100px 100px',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#232f3e',
      opacity: '0.25'
    }
  },

  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
      width: '1px',
      'line-style': 'solid',
      'line-color': '#545B64'
    }
  },
  {
    selector: 'edge.highlight',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
      width: '2px',
      'line-style': 'dashed',
      'line-color': '#545B64'
    }
  },
  {
    selector: 'edge.cy-expand-collapse-meta-edge',
    style: {
      // label: 'data(label)',
      'curve-style': 'unbundled-bezier',
      'control-point-distances': '0 0 0',
      'line-style': 'dashed',
      'line-color': '#ec7211',
      // 'line-dash-pattern': [6,3],
      'width': '2px'
    },
  },
  {
    selector: 'node.cy-expand-collapse-collapsed-node',
    style: {
      label: 'data(label)',
      'font-size': '6rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': '#fff',
      'background-opacity': '1',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#545B64',
      // 'text-margin-y': '5%',
      'text-border-width': '1px',
      'text-background-opacity': '1',
      'text-border-color': '#545B64',
      'text-background-color': '#545B64',
      'text-background-shape': 'rectangle',
      'background-image': 'data(image)',
      'background-fit': 'none',
      'width': '43px',
      'height': '43px',
      shape: 'ellipse',
      color: '#fff',
      // 'bounds-expansion': '100px 100px',
      'background-width': '50%',
      'background-height': '50%',
      // padding: '100px'
    }
  },
];


export const previewStyle = [
  {
    selector: '.image',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#fff',
      'background-image': 'data(image)',
      'background-fit': 'cover cover',
      'background-opacity': '1',
      // 'width': '30px',
      // 'height': '30px',
      shape: 'square',
      color: '#000',
      // 'bounds-expansion': '100px 100px',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px',
      'border-style': 'data(borderStyle)',
      'border-width': 'data(borderSize)',
      'border-color': 'data(borderColour)'
      // 'overlay-color': 'data(borderColour)',
      // 'overlay-opacity': 'data(borderOpacity)',
    }
  },
  {
    selector: '.vpc',
    style: {
      label: 'data(label)',
      'font-size': '7rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': '#683dc2',
      'background-opacity': '0.05',
      'text-margin-y': '-4.5%',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#683dc2',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': '#683dc2',
      'text-background-color': '#683dc2',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.vpc:active',
    style: {
      label: 'data(label)',
      'overlay-color': '#683dc2',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.subnet',
    style: {
      label: 'data(label)',
      'font-size': '7rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(subnetColour)',
      'background-opacity': '0.05',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': 'data(subnetColour)',
      'text-background-opacity': '1',
      'text-border-color': 'data(subnetColour)',
      'text-background-color': 'data(subnetColour)',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      'text-margin-y': '-4.5%',
      'text-border-width': '2px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.subnet:active',
    style: {
      label: 'data(label)',
      'overlay-color': 'data(subnetColour)',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.type',
    style: {
      label: 'data(label)',
      'font-size': '6rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': '#545B64',
      'background-opacity': '0.05',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#545B64',
      'text-margin-y': '-3%',
      'text-border-width': '1px',
      'text-background-opacity': '1',
      'text-border-color': '#545B64',
      'text-background-color': '#545B64',
      'text-background-shape': 'rectangle',
      'text-background-padding': '3px',
      shape: 'roundrectangle',
      color: '#FAFAFA'
    }
  },
  {
    selector: '.region:active',
    style: {
      label: 'data(label)',
      'overlay-color': 'data(regionColour)',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.region',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-size': '7rem',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'background-opacity': 'data(opacity)',
      'border-style': 'dashed',
      'border-width': 1,
      'border-color': 'data(regionColour)',
      'text-margin-y': '-5%',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': 'data(regionColour)',
      'text-background-color': 'data(regionColour)',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'rectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.availabilityZone:active',
    style: {
      label: 'data(label)',
      'overlay-color': '#f7991f',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.availabilityZone',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-size': '7rem',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'background-opacity': 'data(opacity)',
      'border-style': 'dashed',
      'border-width': 1,
      'border-color': '#f7991f',
      'text-margin-y': '-4.5%',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': '#f7991f',
      'text-background-color': '#f7991f',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'rectangle',
      color: '#000'
    }
  },
  {
    selector: '.account:active',
    style: {
      label: 'data(label)',
      'overlay-color': 'data(accountColour)',
      'overlay-opacity': '0.45',
      // 'padding': '200px',
      shape: 'roundrectangle',
      color: '#fafafa'
    }
  },
  {
    selector: '.account',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'font-size': '8rem',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'background-opacity': 'data(opacity)',
      'text-margin-y': '-5%',
      // 'text-margin-x': '93.5%',
      'border-style': 'dashed',
      'border-width': 1,
      'border-color': 'data(accountColour)',
      'text-border-width': '2px',
      'text-background-opacity': '1',
      'text-border-color': 'data(accountColour)',
      'text-background-color': 'data(accountColour)',
      'text-background-shape': 'rectangle',
      'text-background-padding': '5px',
      // 'padding': '200px',
      shape: 'rectangle',
      color: '#fafafa'
    }
  },
  
  {
    selector: 'node.softDelete',
    style: {
      label: 'data(label)',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '5rem',
      'text-margin-y': '3px',
      'background-color': '#fff',
      'background-image': 'data(image)',
      'background-fit': 'cover cover',
      'background-opacity': '0.5',
      shape: 'square',
      color: '#000',
      // 'bounds-expansion': '100px 100px',
      'background-width-relative-to': 'inner',
      'background-height-relative-to': 'inner',
      'background-width': '50%',
      'background-height': '50%',
      padding: '5px',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#232f3e',
      opacity: '0.25'
    }
  },

  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
      width: '1px',
      'line-style': 'solid',
      'line-color': '#545B64'
    }
  },
  {
    selector: 'edge.cy-expand-collapse-meta-edge',
    style: {
      // label: 'data(label)',
      'curve-style': 'unbundled-bezier',
      'control-point-distances': '0 0 0',
      'line-style': 'dashed',
      'line-color': '#ec7211',
      // 'line-dash-pattern': [6,3],
      'width': '2px'
    },
  },
  {
    selector: 'node.cy-expand-collapse-collapsed-node',
    style: {
      label: 'test',
      'font-size': '6rem',
      'font-family': 'Amazon Ember, Helvetica, Arial, sans-serif',
      'text-valign': 'top',
      'text-halign': 'center',
      'background-color': '#fff',
      'background-opacity': '1',
      'border-style': 'solid',
      'border-width': 1,
      'border-color': '#000',
      'text-margin-y': '-3%',
      'text-border-width': '1px',
      'text-background-opacity': '1',
      'text-border-color': '#000',
      'text-background-color': '#000',
      'text-background-shape': 'rectangle',
      'background-image': 'data(image)',
      // 'background-fit': 'none',
      'max-width': '43px',
      'max-height': '43px',
      shape: 'roundrectangle',
      color: '#fff',
      // 'bounds-expansion': '100px 100px',
      // 'background-width': '50%',
      // 'background-height': '50%',
      // padding: '100px'
    }
  },
];
