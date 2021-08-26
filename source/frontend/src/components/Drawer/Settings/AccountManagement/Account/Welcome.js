import React from 'react';
import { HelpPanel, SpaceBetween, TextContent } from '@awsui/components-react';
import { Auth } from 'aws-amplify';

const Welcome = () => {
  const [username, setUsername] = React.useState();

  React.useEffect(() => {
    Auth.currentAuthenticatedUser().then((response) =>
      setUsername(response.username)
    );
  }, []);
  return (
    <SpaceBetween direction='vertical' size='l'>
      <HelpPanel>
        <h5>{`Welcome, ${username}`}</h5>
        <p>Thank you for installing AWS Perspective.</p>
        <dl>
          <dt>How do I make my Regions discoverable to Perspective?</dt>
          <dd>
            Make AWS Regions discoverable by completing the set up
            Wizard to the right.
          </dd>
          <dt>How do I know if my Regions are discoverable?</dt>
          <dd>
            A Region will appear in the {' '}
            <strong>Regions</strong> table below when it is discoverable.
          </dd>

          <dt>Where are my AWS Resources?</dt>
          <dd>
            The <strong>Last scanned</strong> column in the <strong>Accounts & Region</strong> table shows when Perspective most
            recently discovered resources within the Region. This
            indicates that resources should be available within the Perspective
            UI. Please close this dialog and look for <strong>Resources</strong> in the
            side navigation panel.
          </dd>
        </dl>
      </HelpPanel>
    </SpaceBetween>
  );
};

export default Welcome;
