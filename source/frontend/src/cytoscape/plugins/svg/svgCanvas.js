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

    drawImage() {
        //convert arguments to a real array
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
            parent,
            svg,
            defs,
            group,
            svgImage,
            canvas,
            context,
            id;

        if (args.length === 3) {
            dx = args[1];
            dy = args[2];
            sw = image.width;
            sh = image.height;
            dw = sw;
            dh = sh;
        } else if (args.length === 5) {
            dx = args[1];
            dy = args[2];
            dw = args[3];
            dh = args[4];
            sw = image.width;
            sh = image.height;
        } else if (args.length === 9) {
            sx = args[1];
            sy = args[2];
            sw = args[3];
            sh = args[4];
            dx = args[5];
            dy = args[6];
            dw = args[7];
            dh = args[8];
        } else {
            throw new Error(
                'Invalid number of arguments passed to drawImage: ' +
                    arguments.length
            );
        }

        parent = this.__closestGroupOrSvg();
        const matrix = this.getTransform().translate(dx, dy);
        if (image instanceof Context) {
            svg = image.getSvg().cloneNode(true);
            if (svg.childNodes && svg.childNodes.length > 1) {
                defs = svg.childNodes[0];
                while (defs.childNodes.length) {
                    id = defs.childNodes[0].getAttribute('id');
                    this.__ids[id] = id;
                    this.__defs.appendChild(defs.childNodes[0]);
                }
                group = svg.childNodes[1];
                if (group) {
                    this.__applyTransformation(group, matrix);
                    parent.appendChild(group);
                }
            }
        } else if (image.nodeName === 'CANVAS' || image.nodeName === 'IMG') {
            //canvas or image
            svgImage = this.__createElement('image');
            svgImage.setAttribute('width', dw);
            svgImage.setAttribute('height', dh);
            svgImage.setAttribute('preserveAspectRatio', 'none');

            if (
                this.embedImages ||
                sx ||
                sy ||
                sw !== image.width ||
                sh !== image.height
            ) {
                //crop the image using a temporary canvas
                canvas = this.__document.createElement('canvas');
                canvas.width = dw;
                canvas.height = dh;
                context = canvas.getContext('2d');
                context.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);
                image = canvas;
            }
            this.__applyTransformation(svgImage, matrix);
            svgImage.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'xlink:href',
                image.nodeName === 'CANVAS'
                    ? image.toDataURL()
                    : image.getAttribute('src')
            );
            parent.appendChild(svgImage);
        }
    }
}
