// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import exportToSvg from './exportToSvg';

export default function register(cytoscape) {
    cytoscape('core', 'svg', exportToSvg);
}

// auto register
if (window.cytoscape != null) {
    register(window.cytoscape);
}
