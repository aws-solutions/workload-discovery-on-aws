import React from 'react';
import { RadioGroup } from '@awsui/components-react';

const RegionUploadMethod = ({setUploadMethod}) => {
  const [value, setValue] = React.useState('csv');

  const onSelectionChange = (uploadMethod) => {
      setValue(uploadMethod)
      setUploadMethod(uploadMethod)
  }
  return (
    <RadioGroup
      onChange={({ detail }) => onSelectionChange(detail.value)}
      value={value}
      items={[
        {
          value: 'csv',
          label: 'Add Accounts & Regions using a CSV file',
          description: 'Provide up to 50 AWS Account/Region pairs in a CSV file.',
        },
        {
          value: 'input',
          label: 'Add Accounts & Regions using a form.',
          description:
            'Provide the AWS Account and Region details using the form provided.',
        },
      ]}
    />
  );
};

export default RegionUploadMethod;
