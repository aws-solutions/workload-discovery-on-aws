import React, { useState, useEffect } from 'react';
import Main from './Main';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import Amplify from 'aws-amplify';

// import "@awsui/global-styles/index.css"
import './css/awsui-styles.css';


export default () => {
  const [authState, setAuthState] = useState();
  Amplify.configure(window.amplify);
  useEffect(() => {
    onAuthUIStateChange((stateChanged) => {
      setAuthState(stateChanged);
    });
  }, []);

  const signedIn = authState === 'signedin';

  return (
    <div>
      {signedIn ? (
        <Main />
      ) : (
        <div className='amplify-auth-container'>
          <AmplifyAuthenticator usernameAlias='username'>
            <AmplifySignIn
              headerText='Sign in to AWS Perspective'
              slot='sign-in'
              usernameAlias='username'
              formFields={[
                {
                  type: 'username',
                  label: 'Username *',
                  placeholder: 'Enter your username',
                  required: true,
                  inputProps: { autoComplete: 'off' },
                },
                {
                  type: 'password',
                  label: 'Password *',
                  placeholder: 'Enter your password',
                  required: true,
                  inputProps: { autoComplete: 'off' },
                },
              ]}>
              <div slot='secondary-footer-content'></div>
            </AmplifySignIn>
          </AmplifyAuthenticator>
        </div>
      )}
    </div>
  );
};
