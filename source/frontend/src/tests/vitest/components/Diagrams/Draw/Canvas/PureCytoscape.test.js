// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {handleDoubleTap, handleTapHold, handleTapDragOver, handleTapDragOut} from '../../../../../../components/Diagrams/Draw/Canvas/PureCytoscape';

describe('PureCytoscape', () => {
    describe('handleDoubleTap', () => {
    let mockDependencies;
    let mockEvent;
    let mockNode;
    let mockCy;
    let mockNodesResult;

    beforeEach(() => {
        // Create realistic mock descendants with data method
        const mockDescendant1 = {
            data: vi.fn((key) => key === 'id' ? 'desc-1' : 'resource')
        };
        const mockDescendant2 = {
            data: vi.fn((key) => key === 'id' ? 'desc-2' : 'resource')
        };

        mockNode = {
            data: vi.fn((key) => {
                if (key === 'type') return 'resource';
                if (key === 'id') return 'node-1';
                return null;
            }),
            isParent: vi.fn(() => false),
            descendants: vi.fn(() => [mockDescendant1, mockDescendant2]),
        };

        mockNodesResult = {
            lock: vi.fn(),
        };

        mockCy = {
            nodes: vi.fn(() => mockNodesResult),
        };

        mockDependencies = {
            cy: mockCy,
            updateCanvas: vi.fn(),
            updateResources: vi.fn(),
            fetchResources: vi.fn(),
            graphResources: [],
        };

        mockEvent = {
            target: mockNode,
        };
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should lock all nodes when cy exists', () => {
        mockNode.data.mockReturnValue('other');

        const handler = handleDoubleTap(mockDependencies);
        handler(mockEvent);

        expect(mockCy.nodes).toHaveBeenCalled();
        expect(mockCy.nodes().lock).toHaveBeenCalled();
    });

    it('should not process when cy is null', () => {
        mockDependencies.cy = null;

        const handler = handleDoubleTap(mockDependencies);
        handler(mockEvent);

        expect(mockNode.data).not.toHaveBeenCalled();
    });

    it('should fetch resources when node type is resource and pass correct element IDs', () => {
        const handler = handleDoubleTap(mockDependencies);
        handler(mockEvent);

        expect(mockNode.data).toHaveBeenCalledWith('type');
        expect(mockCy.nodes().lock).toHaveBeenCalled();
        expect(mockDependencies.fetchResources).toHaveBeenCalledWith(
            mockCy,
            mockDependencies.updateCanvas,
            mockDependencies.updateResources,
            ['node-1'], // Should contain the node's ID since isParent is false
            [],
            {}
        );
    });

    it('should handle parent nodes by getting descendants and pass descendant IDs', () => {
        mockNode.isParent.mockReturnValue(true);

        const handler = handleDoubleTap(mockDependencies);
        handler(mockEvent);

        expect(mockNode.isParent).toHaveBeenCalled();
        expect(mockNode.descendants).toHaveBeenCalled();
        expect(mockDependencies.fetchResources).toHaveBeenCalledWith(
            mockCy,
            mockDependencies.updateCanvas,
            mockDependencies.updateResources,
            ['desc-1', 'desc-2'], // Should contain descendant IDs
            [],
            {}
        );
    });

    it('should not fetch resources when node type is not resource', () => {
        mockNode.data.mockImplementation((key) => {
            if (key === 'type') return 'other-type';
            if (key === 'id') return 'node-1';
            return null;
        });

        const handler = handleDoubleTap(mockDependencies);
        handler(mockEvent);

        expect(mockNode.data).toHaveBeenCalledWith('type');
        expect(mockCy.nodes().lock).toHaveBeenCalled();
        expect(mockDependencies.fetchResources).not.toHaveBeenCalled();
    });
    });

    describe('handleTapHold', () => {
        let mockEvent;
        let mockNode;
        let mockDescendants;
        let mockLayout;

        beforeEach(() => {
            mockLayout = {
                run: vi.fn(),
            };

            mockDescendants = {
                layout: vi.fn(() => mockLayout),
            };

            mockNode = {
                descendants: vi.fn(() => mockDescendants),
                boundingBox: vi.fn(() => ({ x: 0, y: 0, w: 100, h: 100 })),
            };

            mockEvent = {
                target: mockNode,
            };
        });

        afterEach(() => {
            vi.resetAllMocks();
        });

        it('should apply grid layout to node descendants', () => {
            handleTapHold(mockEvent);

            expect(mockNode.descendants).toHaveBeenCalled();
            expect(mockNode.boundingBox).toHaveBeenCalled();
            expect(mockDescendants.layout).toHaveBeenCalledWith({
                name: 'grid',
                fit: false,
                padding: 1,
                boundingBox: { x: 0, y: 0, w: 100, h: 100 },
                avoidOverlap: true,
                avoidOverlapPadding: 0,
                nodeDimensionsIncludeLabels: true,
                spacingFactor: undefined,
                condense: false,
                rows: undefined,
                cols: undefined,
                position: expect.any(Function),
                sort: undefined,
                animate: true,
                animationDuration: 250,
                animationEasing: undefined,
                animateFilter: expect.any(Function),
                ready: undefined,
                stop: undefined,
                transform: expect.any(Function),
            });
            expect(mockLayout.run).toHaveBeenCalled();
        });
    });

    describe('handleTapDragOver', () => {
        let mockEvent;
        let mockNode;
        let mockDescendants;

        beforeEach(() => {
            mockDescendants = {
                unlock: vi.fn(),
                grabify: vi.fn(),
            };

            mockNode = {
                unlock: vi.fn(),
                grabify: vi.fn(),
                descendants: vi.fn(() => mockDescendants),
            };

            mockEvent = {
                target: mockNode,
            };
        });

        afterEach(() => {
            vi.resetAllMocks();
        });

        it('should unlock and grabify node and its descendants', () => {
            handleTapDragOver(mockEvent);

            expect(mockNode.unlock).toHaveBeenCalled();
            expect(mockNode.grabify).toHaveBeenCalled();
            expect(mockNode.descendants).toHaveBeenCalled();
            expect(mockDescendants.unlock).toHaveBeenCalled();
            expect(mockDescendants.grabify).toHaveBeenCalled();
        });
    });

    describe('handleTapDragOut', () => {
        let mockEvent;
        let mockNode;
        let mockDescendants;

        beforeEach(() => {
            mockDescendants = {
                lock: vi.fn(),
                ungrabify: vi.fn(),
            };

            mockNode = {
                lock: vi.fn(),
                ungrabify: vi.fn(),
                descendants: vi.fn(() => mockDescendants),
            };

            mockEvent = {
                target: mockNode,
            };
        });

        afterEach(() => {
            vi.resetAllMocks();
        });

        it('should lock and ungrabify node and its descendants', () => {
            handleTapDragOut(mockEvent);

            expect(mockNode.lock).toHaveBeenCalled();
            expect(mockNode.ungrabify).toHaveBeenCalled();
            expect(mockNode.descendants).toHaveBeenCalled();
            expect(mockDescendants.lock).toHaveBeenCalled();
            expect(mockDescendants.ungrabify).toHaveBeenCalled();
        });
    });
});
