export function generateCloudFormationLink(
  accountId,
  region,
  templateLocation,
  loggedIn
) {
  return loggedIn
    ? `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/new?stackName=aws-perspective&templateURL=${templateLocation}`
    : `https://${accountId}.signin.aws.amazon.com/console`
}
