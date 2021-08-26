export function generateCloudFormationLink(accountId, region) {
  return `https://${accountId}.signin.aws.amazon.com/console/cloudformation#stacks/new?stackName=aws-perspective?region=${region}`
}

export function generateCloudFormationStackSetLink(accountId, region) {
  return `https://${accountId}.signin.aws.amazon.com/console/cloudformation#stacksets/create?region=${region}`
}