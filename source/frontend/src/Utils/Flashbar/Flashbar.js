import React from 'react';
import { Flashbar, TextContent } from '@awsui/components-react';

export default ({ type, message, dismiss }) => {
  const [items, setItems] = React.useState([
    {
      type: type,
      content: (
        <TextContent>
          <p className='errorText'>{message}</p>
        </TextContent>
      ),
      buttonText: 'GitHub Issues',
      dismissible: dismiss,
      onButtonClick: () =>
        window.open('https://github.com/awslabs/aws-perspective/issues'),
      onDismiss: () => {
        dismiss();
      },
    },
  ]);

  return <Flashbar items={items} />;
};
