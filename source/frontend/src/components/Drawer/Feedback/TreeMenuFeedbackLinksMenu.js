import React from 'react';
import { Button, ExpandableSection, ColumnLayout} from '@awsui/components-react';

export default () => {
  return (
    <ExpandableSection
      className='first-level'
      variant='navigation'
      header='Get in touch'>
      <ColumnLayout columns={1} disableGutters>
        <Button
          variant='link'
          iconName='external'
          onClick={() =>
            window.open(
              'https://github.com/awslabs/aws-perspective/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=',
              '_blank', 'rel=noreferrer'
            )
          }
          className='sidepanel-button'>
          Feature request
        </Button>
        <Button
          variant='link'
          iconName='external'
          onClick={() =>
            window.open(
              'https://github.com/awslabs/aws-perspective/issues/new?assignees=&labels=bug&template=bug_report.md&title=',
              '_blank', 'rel=noreferrer'
            )
          }
          className='sidepanel-button'>
          Raise an issue
        </Button>
        <Button
          variant='link'
          iconName='external'
          onClick={() =>
            window.open(
              'https://github.com/awslabs/aws-perspective/issues',
              '_blank', 'rel=noreferrer'
            )
          }
          className='sidepanel-button'>
          Known issues
        </Button>
      </ColumnLayout>
    </ExpandableSection>
  );
};
