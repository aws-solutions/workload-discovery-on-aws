// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {promises as fs} from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';

/**
 * @typedef {Object} CompareOptions
 * @property {string} testName - Name of the test for organizing snapshots
 * @property {string} [baselineDir] - Directory for baseline images
 * @property {string} [diffDir] - Directory for diff images
 * @property {number} [threshold] - Matching threshold (0-1)
 * @property {number} [maxDiffPercentage] - Maximum allowed difference percentage
 * @property {boolean} [updateBaseline] - Whether to update baseline images
 */

/**
 * Compare a screenshot with its baseline
 * @param {Object} context - Context
 * @param {string} screenshotPath - Path to the screenshot
 * @param {CompareOptions} options - Comparison options
 * @returns {Promise<{matches: boolean, diffPercentage?: number, message: string}>}
 */
export const compareScreenshot = async (context, screenshotPath, options) => {
    const {testPath} = context;
    const testDir = testPath.replace(/\/[^/]*$/, '');
    const {
        testName,
        baselineDir = `${testDir}/__image_snapshots__`,
        diffDir = `${testDir}/__image_diffs__`,
        threshold = 0.1, // recommended default in pixelmatch docs
        maxDiffPercentage = 1.0,
        updateBaseline = process.env.UPDATE_SNAPSHOTS === 'true',
    } = options;

    const testBaselineDir = path.join(baselineDir, testName);
    const testDiffDir = path.join(diffDir, testName);

    const filename = path.basename(screenshotPath);
    const baselinePath = path.join(testBaselineDir, filename);
    const diffPath = path.join(testDiffDir, `diff-${filename}`);

    // Create directories if they don't exist
    await fs.mkdir(testBaselineDir, {recursive: true});
    await fs.mkdir(testDiffDir, {recursive: true});

    if (updateBaseline) {
        await fs.copyFile(screenshotPath, baselinePath);
        return {
            matches: true,
            message: `Updated baseline image: ${baselinePath}`,
        };
    }

    try {
        // Check if baseline exists
        await fs.access(baselinePath);

        const [img1Data, img2Data] = await Promise.all([
            fs.readFile(baselinePath),
            fs.readFile(screenshotPath),
        ]);

        const img1 = PNG.sync.read(img1Data);
        const img2 = PNG.sync.read(img2Data);

        if (img1.width !== img2.width || img1.height !== img2.height) {
            return {
                matches: false,
                message: `Image dimensions don't match: ${img1.width}x${img1.height} vs ${img2.width}x${img2.height}`,
            };
        }

        // Create empty diff image buffer (pixelmatch will mutate this buffer to store the diff)
        const {width, height} = img1;
        const diff = new PNG({width, height});

        // Compare images
        const numDiffPixels = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {threshold}
        );

        // Save diff image
        await fs.writeFile(diffPath, PNG.sync.write(diff));

        const diffPercentage = (numDiffPixels / (width * height)) * 100;
        const matches = diffPercentage <= maxDiffPercentage;

        return {
            matches,
            diffPercentage,
            message: matches
                ? `Image matches baseline (diff: ${diffPercentage.toFixed(2)}%)`
                : `Image differs from baseline by ${diffPercentage.toFixed(2)}% (threshold: ${maxDiffPercentage}%). See diff: ${diffPath}`,
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Create baseline if it doesn't exist
            await fs.copyFile(screenshotPath, baselinePath);
            return {
                matches: true,
                message: `Created new baseline image: ${baselinePath}`,
            };
        }
        throw error;
    }
};
