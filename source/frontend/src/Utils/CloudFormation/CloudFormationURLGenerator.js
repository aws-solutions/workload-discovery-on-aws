// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function generateCloudFormationConsoleLink(accountId, region) {
  return `https://${accountId}.signin.aws.amazon.com/console/cloudformation?region=${region}`
}