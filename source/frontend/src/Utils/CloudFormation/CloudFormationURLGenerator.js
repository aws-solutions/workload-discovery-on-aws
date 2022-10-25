export function generateCloudFormationConsoleLink(accountId, region) {
  return `https://${accountId}.signin.aws.amazon.com/console/cloudformation?region=${region}`
}