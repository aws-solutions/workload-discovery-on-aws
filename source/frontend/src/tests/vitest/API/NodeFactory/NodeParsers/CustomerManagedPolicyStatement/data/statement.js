// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const atRiskActionsResources =
    '{"softDeleteType":"delete","resources":"*","actions":"*"}';
export const atRiskActionsNeedsAttentionResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource*","actions":"*"}';
export const needsAttentionActionsNeedsAttentionResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource*","actions":"someAction:*"}';
export const okActionsAtRiskResources =
    '{"softDeleteType":"delete","resources":"*","actions":"someAction"}';
export const atRiskActionsOKResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource","actions":"*"}';
export const okActionsNeedsAttentionResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource:*","actions":"someAction"}';
export const needsAttentionActionsOKResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource","actions":"someAction:*"}';
export const okActionsOKResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource","actions":"someAction"}';
export const okActionsNotArrayOKResources =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource","actions":"someAction"}';
export const okActionsOKResourcesArray =
    '{"softDeleteType":"delete","resources":"arn::to:some:resource","actions":"[\\"autoscaling:DescribeAdjustmentTypes\\",\\"autoscaling:DescribeAutoScalingGroups\\",\\"autoscaling:DescribeAutoScalingInstances\\",\\"autoscaling:DescribeAutoScalingNotificationTypes\\",\\"autoscaling:DescribeLaunchConfigurations\\",\\"autoscaling:DescribeMetricCollectionTypes\\",\\"autoscaling:DescribeNotificationConfigurations\\",\\"autoscaling:DescribePolicies\\",\\"autoscaling:DescribeScalingActivities\\",\\"autoscaling:DescribeScalingProcessTypes\\",\\"autoscaling:DescribeScheduledActions\\",\\"autoscaling:DescribeTags\\",\\"autoscaling:DescribeTriggers\\"]","effect":"Allow","statement":"{\\"Action\\":[\\"autoscaling:DescribeAdjustmentTypes\\",\\"autoscaling:DescribeAutoScalingGroups\\",\\"autoscaling:DescribeAutoScalingInstances\\",\\"autoscaling:DescribeAutoScalingNotificationTypes\\",\\"autoscaling:DescribeLaunchConfigurations\\",\\"autoscaling:DescribeMetricCollectionTypes\\",\\"autoscaling:DescribeNotificationConfigurations\\",\\"autoscaling:DescribePolicies\\",\\"autoscaling:DescribeScalingActivities\\",\\"autoscaling:DescribeScalingProcessTypes\\",\\"autoscaling:DescribeScheduledActions\\",\\"autoscaling:DescribeTags\\",\\"autoscaling:DescribeTriggers\\"],\\"Effect\\":\\"Allow\\",\\"Resource\\":\\"arn::to:some:resource\\"}"}';
