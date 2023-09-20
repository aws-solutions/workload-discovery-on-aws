// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Blob } from 'node:buffer'
import { URL } from 'node:url'
import fetch, {Headers, Response, Request} from 'node-fetch';

globalThis.URL = URL
globalThis.Blob = Blob
globalThis.fetch = fetch
globalThis.Headers = Headers
globalThis.Response = Response
globalThis.Request = Request
