// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {processElements} from '../../../../../API/APIProcessors';
import {getResourceGraphPaginated} from '../../../../../API/Handlers/ResourceGraphQLHandler';
import {wrapRequest} from '../../../../../Utils/API/HandlerUtils';
import {processResourcesError} from '../../../../../Utils/ErrorHandlingUtils';
import {handleSelectedResources} from '../../../../../API/Processors/NodeProcessors';
import {getGroupedLayout} from '../Layout/GroupedGraphLayout';
import {getStandardLayout} from '../Layout/StandardGraphLayout';
import * as R from 'ramda';

export const clearGraph = (canvas, updateCanvas, updateResources) => {
    !R.isNil(canvas) && canvas.nodes().remove();
    updateCanvas(canvas);
    updateResources();
};

export const fitToViewport = (canvas, updateCanvas) => {
    canvas.fit();
    updateCanvas(canvas);
};

export const removeResource = (
    canvas,
    updateCanvas,
    updateResources,
    resourceIds,
    layout = getStandardLayout
) => {
    canvas.nodes().lock();
    // Cache all ancestors of nodes to be removed sorted by depth
    const ancestors = R.chain(
        e =>
            canvas
                .nodes()
                .getElementById(e)
                .ancestors()
                .sort((a, b) => b.data('level') - a.data('level')),
        resourceIds
    );

    // Remove selected nodes
    R.forEach(e => canvas.nodes().getElementById(e).remove(), resourceIds);

    // Remove ancestors which have no descendents starting from deepest
    R.forEach(a => {
        if (R.equals(0, a.descendants().length)) {
            canvas.nodes().getElementById(a.data('id')).remove();
        }
    }, ancestors);

    updateCanvas(canvas);
    updateResources();
    if (layout) canvas.nodes().layout(layout()).run();
    canvas.nodes().unlock();
};

export const addResources = (
    canvas,
    updateCanvas,
    updateResources,
    resources,
    layout
) => {
    canvas.nodes().lock();
    canvas.add(resources);
    canvas.nodes().layout(layout()).run();
    canvas.ready(() => {
        R.forEach(e => {
            if (R.gt(e.parallelEdges().length, 1)) {
                e.remove();
            }
        }, canvas.edges());
        canvas.nodes().unlock();
        updateCanvas(canvas);
        const removeHighlight = setTimeout(
            () => canvas.elements().removeClass('highlight'),
            2000
        );
        return () => clearTimeout(removeHighlight);
    });
    updateResources();
};

export const groupResources = (canvas, updateCanvas) => {
    canvas.nodes().layout(getGroupedLayout()).run();
    canvas.remove(canvas.edges());
    updateCanvas(canvas);
};

export const focusOnResources = (
    canvas,
    updateCanvas,
    updateResources,
    ids
) => {
    clearGraph(canvas, updateCanvas, updateResources);

    return wrapRequest(processResourcesError, getResourceGraphPaginated, {ids})
        .then(x => x.body)
        .then(processElements)
        .then(handleSelectedResources(ids, []))
        .then(elements => {
            addResources(
                canvas,
                updateCanvas,
                updateResources,
                elements,
                getStandardLayout
            );
        });
};

export const fetchResources = (
    canvas,
    updateCanvas,
    updateResources,
    ids,
    currentResources
) => {
    canvas.nodes().map(ele => ele.removeClass('clicked'));
    canvas.nodes().removeClass('selected');
    canvas.nodes().unselect();

    return wrapRequest(processResourcesError, getResourceGraphPaginated, {ids})
        .then(x => x.body)
        .then(processElements)
        .then(handleSelectedResources(ids, currentResources))
        .then(elements => {
            addResources(
                canvas,
                updateCanvas,
                updateResources,
                elements,
                getStandardLayout
            );
        });
};

export const showCosts = (
    canvas,
    updateCanvas,
    resources,
    parentsOnly = true
) => {
    resources.forEach(res => {
        const node = canvas
            .nodes()
            .find(i => R.equals(i.data('id'), res.data.id));
        node.data('cost', res.data?.cost ?? 0);
        if (parentsOnly && node.children().length > 0)
            node?.data('label', res.data.label);
    });
    updateCanvas(canvas);
};

export const hideCosts = (canvas, updateCanvas) => {
    const resources = canvas.nodes().jsons();
    resources.forEach(res => {
        const node = canvas
            .nodes()
            .find(i => R.equals(i.data('id'), res.data.id));
        node.data('cost', 0);
        if (node.children().length > 0) node?.data('label', res.data.title);
    });
    updateCanvas(canvas);
};

export const refreshLayout = (canvas, layout = getStandardLayout) => {
    canvas.nodes().layout(layout()).run();
};
