// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * This code is based on:
 * https://github.com/iVis-at-Bilkent/cytoscape.js/blob/master/src/extensions/renderer/canvas/export-image.js
 */

import {Context} from './svgCanvas';

const isNumber = obj =>
    obj != null && typeof obj === 'number' && !Number.isNaN(obj);

export default function (options) {
    const renderer = this.renderer();

    //disable pathsEnabled temporarily
    const pathsEnabledOld = renderer.pathsEnabled;
    renderer.pathsEnabled = false;

    // flush path cache
    this.elements().forEach(ele => {
        ele._private.rscratch.pathCacheKey = null;
        ele._private.rscratch.pathCache = null;
    });

    const eles = this.mutableElements();
    const bb = eles.boundingBox();
    const ctrRect = renderer.findContainerClientCoords();
    let width = options.full ? Math.ceil(bb.w) : ctrRect[2];
    let height = options.full ? Math.ceil(bb.h) : ctrRect[3];
    const specdMaxDims =
        isNumber(options.maxWidth) || isNumber(options.maxHeight);
    const pxRatio = renderer.getPixelRatio();
    let scale = 1;

    if (options.scale != null) {
        width *= options.scale;
        height *= options.scale;

        scale = options.scale;
    } else if (specdMaxDims) {
        let maxScaleW = Infinity;
        let maxScaleH = Infinity;

        if (isNumber(options.maxWidth)) {
            maxScaleW = (scale * options.maxWidth) / width;
        }

        if (isNumber(options.maxHeight)) {
            maxScaleH = (scale * options.maxHeight) / height;
        }

        scale = Math.min(maxScaleW, maxScaleH);

        width *= scale;
        height *= scale;
    }

    if (!specdMaxDims) {
        width *= pxRatio;
        height *= pxRatio;
        scale *= pxRatio;
    }

    const buffCanvas = new Context({width, height, embedImages: true});

    // Rasterize the layers, but only if container has nonzero size
    if (width > 0 && height > 0) {
        buffCanvas.clearRect(0, 0, width, height);

        buffCanvas.globalCompositeOperation = 'source-over';

        const zsortedEles = renderer.getCachedZSortedEles();

        if (options.full) {
            // draw the full bounds of the graph
            buffCanvas.translate(-bb.x1 * scale, -bb.y1 * scale);
            buffCanvas.scale(scale, scale);

            renderer.drawElements(buffCanvas, zsortedEles);

            buffCanvas.scale(1 / scale, 1 / scale);
            buffCanvas.translate(bb.x1 * scale, bb.y1 * scale);
        } else {
            // draw the current view
            const pan = this.pan();

            const translation = {
                x: pan.x * scale,
                y: pan.y * scale,
            };

            scale *= this.zoom();

            buffCanvas.translate(translation.x, translation.y);
            buffCanvas.scale(scale, scale);

            renderer.drawElements(buffCanvas, zsortedEles);

            buffCanvas.scale(1 / scale, 1 / scale);
            buffCanvas.translate(-translation.x, -translation.y);
        }
    }

    // restore pathsEnabled to old value
    renderer.pathsEnabled = pathsEnabledOld;

    return buffCanvas.getSerializedSvg();
}
