import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import S3BucketItem from './S3BucketDetails/S3BucketItem';
import S3BucketHover from './S3BucketDetails/S3BucketHover';
import { getConnectedNodes } from '../../../../components/Actions/GraphActions';

const fetchConnectedNodes = async (nodeId) => {
  const params = {
    focusing: false,
    nodeId: nodeId,
  };
  const response = await getConnectedNodes(params);
  if (response.error) {
    // setShowError(response.error);
    console.error('Error getting connected nodes');
  }
  else {
    return response;
  }
};

export const parseS3Bucket = (node) => {
   
  return {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#545B64',
      borderOpacity: 0.25,
      borderSize: 1,
      message: '',
      colour: '#fff',
    },
    icon: fetchImage(node.properties.resourceType, undefined),
    // detailsComponent: (
    //   <S3BucketItem
    //     title='S3 Bucket Details'
    //     connectedCount={connectedNodeCount}
    //   />
    // ),
    // hoverComponent: (
    //   <S3BucketHover
    //     connectedCount={connectedNodeCount}
    //   />
    // )
  };
};
