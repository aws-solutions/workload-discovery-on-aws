import { fetchImage } from "../../../../../Utils/ImageSelector";

export const getExpandCollapseGraphLayout = () => {
  return {
    layoutBy: {
      name: 'fcose',
      // 'draft', 'default' or 'proof'
      // - "draft" only applies spectral layout
      // - "default" improves the quality with incremental layout (fast cooling rate)
      // - "proof" improves the quality with incremental layout (slow cooling rate)
      quality: 'proof',
      // Use random node positions at beginning of layout
      // if this is set to false, then quality option must be "proof"
      randomize: false,
      // Whether or not to animate the layout
      animate: false,
      // Duration of animation in ms, if enabled
      animationDuration: 1500,
      // Easing of animation, if enabled
      animationEasing: undefined,
      // Fit the viewport to the repositioned nodes
      fit: true,
      // Padding around layout
      padding: 30,
      // Whether to include labels in node dimensions. Valid in "proof" quality
      nodeDimensionsIncludeLabels: true,
      // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
      uniformNodeDimensions: false,
      // Whether to pack disconnected components - valid only if randomize: true
      packComponents: true,
      // Layout step - all, transformed, enforced, cose - for debug purpose only
      step: 'all',

      /* spectral layout options */

      // False for random, true for greedy sampling
      samplingType: true,
      // Sample size to construct distance matrix
      sampleSize: 25,
      // Separation amount between nodes
      nodeSeparation: 200,
      // Power iteration tolerance
      piTol: 0.0000001,

      /* incremental layout options */

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: () => 4500,
      // Ideal edge (non nested) length
      idealEdgeLength: () => 50,
      // Divisor to compute edge forces
      edgeElasticity: () => 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 0.1,
      // Maximum number of iterations to perform
      numIter: 2500,
      // For enabling tiling
      tile: true,
      // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingVertical: 10,
      // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingHorizontal: 10,
      // Gravity force (constant)
      gravity: 0.25,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 1.5,
      // Gravity force (constant) for compounds
      gravityCompound: 1.0,
      // Gravity range (constant)
      gravityRange: 3.8,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental: 0.3,

      /* constraint options */

      // Fix desired nodes to predefined positions
      // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
      fixedNodeConstraint: undefined,
      // Align desired nodes in vertical/horizontal direction
      // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
      alignmentConstraint: undefined,
      // Place two nodes relatively in vertical/horizontal direction
      // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
      relativePlacementConstraint: undefined,
    },
    cueEnabled: false,
    fisheye: true,
    animate: false,
    undoable: false,
    expandCollapseCuePosition: 'top-left', // default cue position is top left you can specify a function per node too
    expandCollapseCueSize: 12, // size of expand-collapse cue
    expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
    expandCueImage: fetchImage('expand'),
    collapseCueImage: fetchImage('collapse'),
  };
};
