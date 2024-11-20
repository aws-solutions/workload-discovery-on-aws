// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Blob} from 'node:buffer';
import {URL} from 'node:url';

globalThis.URL = URL;
globalThis.Blob = Blob;
