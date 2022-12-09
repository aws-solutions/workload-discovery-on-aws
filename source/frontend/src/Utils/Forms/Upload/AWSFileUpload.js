// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { readString } from 'react-papaparse';
import { SpaceBetween, Button } from '@awsui/components-react';
import PropTypes from 'prop-types';

const reader = new FileReader();
import * as R  from 'ramda';

const FileUploader = ({ validateAndUpload, onError }) => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded && fileUploaded.size >= 2048 ) {
      onError([
        {
          item: null,
          message: 'File is too large. It must be under 2KB',
        },
      ]);
    } else {
      reader.readAsText(fileUploaded);

      reader.onload = function () {        
        validateAndUpload(
          R.map(
            (e) => R.pick(['accountId', 'accountName', 'region'], e),
            readString(reader.result, {
              header: true,
              delimiter: ',',
              skipEmptyLines: true,
            }).data
          )
        );
      };

      reader.onerror = function () {
        console.error(reader.error);
      };
    }
  };
  return (
    <SpaceBetween direction='vertical' size='xs'>
      <Button iconName='upload' onClick={handleClick}>
        Upload a CSV
      </Button>
      <input
        id='tempInput'
        accept='.csv,text/csv'
        type='file'
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </SpaceBetween>
  );
};

FileUploader.propTypes = {
  validateAndUpload: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default FileUploader;
