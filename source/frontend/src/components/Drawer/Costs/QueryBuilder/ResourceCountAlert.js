import * as React from 'react';
import { Alert } from '@awsui/components-react';

const ResourceCountAlert = () => {
  const [visible, setVisible] = React.useState(true);

  return (
    <Alert    
      onDismiss={() => setVisible(false)}
      visible={visible}
      dismissible
      dismissAriaLabel='Close alert'
      header='Seeing a much higher resource count?'>
      This is likely due to the query running across Regions not discoverable to
      Perspective. It will also be returning resources types that Perspective
      does not yet support.
      <br />      
      You can select an <strong>Account</strong> and the{' '}
      <strong>Regions</strong> you wish to include in the query using the form
      on the left-hand side of this page.
    </Alert>
  );
};

export default ResourceCountAlert;
