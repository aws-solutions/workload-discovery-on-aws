// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Context as ParentContextClass} from 'svgcanvas';

export class Context extends ParentContextClass {
    constructor(options) {
        super(options);
        // this parameter allows us to always embed SVG images present on the canvas, without it
        // resource icons do not appear in the final exported canvas
        this.embedImages = options?.embedImages ?? false;
    }

    // Helper method to process drawImage arguments
    _processDrawImageArgs(args) {
        const image = args[0];
        let dx,
            dy,
            dw,
            dh,
            sx = 0,
            sy = 0,
            sw,
            sh;

        if (args.length === 3) {
            [, dx, dy] = args;
            sw = image.width;
            sh = image.height;
            dw = sw;
            dh = sh;
        } else if (args.length === 5) {
            [, dx, dy, dw, dh] = args;
            sw = image.width;
            sh = image.height;
        } else if (args.length === 9) {
            [, sx, sy, sw, sh, dx, dy, dw, dh] = args;
        }
        return {image, dx, dy, dw, dh, sx, sy, sw, sh};
    }

    // Handle Context type images
    _handleContextImage(image, matrix, parent) {
        const svg = image.getSvg().cloneNode(true);
        if (svg.childNodes && svg.childNodes.length > 1) {
            const defs = svg.childNodes[0];
            while (defs.childNodes.length) {
                const id = defs.childNodes[0].getAttribute('id');
                this.__ids[id] = id;
                this.__defs.appendChild(defs.childNodes[0]);
            }
            const group = svg.childNodes[1];
            if (group) {
                this.__applyTransformation(group, matrix);
                parent.appendChild(group);
            }
        }
    }

    // Handle DOM images (Canvas or IMG)
    _handleDOMImage(params) {
        const {image, dw, dh, sx, sy, sw, sh, matrix, parent} = params;
        const svgImage = this.__createElement('image');
        svgImage.setAttribute('width', dw);
        svgImage.setAttribute('height', dh);
        svgImage.setAttribute('preserveAspectRatio', 'none');

        let processedImage = image;
        if (
            this.embedImages ||
            sx ||
            sy ||
            sw !== image.width ||
            sh !== image.height
        ) {
            // Crop the image using a temporary canvas
            const canvas = this.__document.createElement('canvas');
            canvas.width = dw;
            canvas.height = dh;
            const context = canvas.getContext('2d');
            context.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);
            processedImage = canvas;
        }
        this.__applyTransformation(svgImage, matrix);
        svgImage.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            processedImage.nodeName === 'CANVAS'
                ? processedImage.toDataURL()
                : processedImage.getAttribute('src')
        );
        parent.appendChild(svgImage);
    }

    // Main handler for image content
    _handleDrawImageContent(params) {
        const {image, dx, dy, dw, dh, sx, sy, sw, sh, parent} = params;
        const matrix = this.getTransform().translate(dx, dy);

        if (image instanceof Context) {
            this._handleContextImage(image, matrix, parent);
        } else if (image.nodeName === 'CANVAS' || image.nodeName === 'IMG') {
            this._handleDOMImage({
                image,
                dw,
                dh,
                sx,
                sy,
                sw,
                sh,
                matrix,
                parent,
            });
        }
    }

    drawImage() {
        // Convert arguments to a real array
        let args = Array.prototype.slice.call(arguments),
            image = args[0],
            dx,
            dy,
            dw,
            dh,
            sx = 0,
            sy = 0,
            sw,
            sh,
            parent;

        if ([3, 5, 9].includes(args.length)) {
            const processedArgs = this._processDrawImageArgs(args);
            dx = processedArgs.dx;
            dy = processedArgs.dy;
            dw = processedArgs.dw;
            dh = processedArgs.dh;
            sx = processedArgs.sx;
            sy = processedArgs.sy;
            sw = processedArgs.sw;
            sh = processedArgs.sh;
        } else {
            throw new Error(
                'Invalid number of arguments passed to drawImage: ' +
                    arguments.length
            );
        }

        parent = this.__closestGroupOrSvg();
        this._handleDrawImageContent({
            image,
            dx,
            dy,
            dw,
            dh,
            sx,
            sy,
            sw,
            sh,
            parent,
        });
    }
}
