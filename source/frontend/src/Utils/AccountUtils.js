// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {AWS_ORGANIZATIONS} from "../config/constants.js";

export const isUsingOrganizations = () => window.perspectiveMetadata.crossAccountDiscovery === AWS_ORGANIZATIONS;
