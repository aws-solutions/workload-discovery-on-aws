import * as React from 'react';
import { Alert, Link } from '@awsui/components-react';

const ResourceCountAlert = () => {
  const [visible, setVisible] = React.useState(true);

  return (
    <Alert
      onDismiss={() => setVisible(false)}
      visible={visible}
      type='info'
      dismissible
      dismissAriaLabel='Close alert'
      header='Considering AWS CloudFormation StackSets?'>
      <Link
        external
        href='https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html'>
        StackSets
      </Link>{' '}
      require specific permissions to perform operations across multiple
      accounts.
      <br />
      <br />
      To set up StackSets with{' '}
      <Link
        external
        href='https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html'>
        self-managed
      </Link>{' '}
      permissions you will need to perform the following tasks:
      <br />
      <ol>
        <li>
          In the administrator account, create the IAM role{' '}
          <strong>AWSCloudFormationStackSetAdministrationRole</strong> using
          this{' '}
          <Link
            external
            href='https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetAdministrationRole.yml'>
            CloudFormation template
          </Link>
        </li>
        <li>
          In each target account, create the service role{' '}
          <strong>AWSCloudFormationStackSetExecutionRole</strong> using this{' '}
          <Link
            external
            href='https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetExecutionRole.yml'>
            CloudFormation template
          </Link>{' '}
          and enter the account id of the trusted administrator account.
        </li>
      </ol>
      To set up StackSets with <strong>service-managed</strong> permissions, see {' '}
      <Link
        external
        href='https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-enable-trusted-access.html'>
        Enable trusted access with AWS Organizations
      </Link>
    </Alert>
  );
};

export default ResourceCountAlert;
