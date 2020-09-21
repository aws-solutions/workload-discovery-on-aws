import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import CloudFrontDistributionItem from './CloudFrontDistributionDetails/CloudFrontDistributionItem';
import CloudFrontDistributionHover from './CloudFrontDistributionDetails/CloudFrontDistributionHover';

export const parseCloudFrontDistribution = (node) => {
  return {
    styling: {
      borderStyle: 'solid',
      borderColour: '#545B64',
      borderOpacity: 0.25,
      borderSize: 1,
      message: '',
      colour: '#fff',
    },
    icon: fetchImage(node.properties.resourceType, undefined),
    detailsComponent: (
      <CloudFrontDistributionItem
        title='Distribution Details'
        configuration={node.properties.configuration}
      />
    ),
    // hoverComponent: (
    //   <CloudFrontDistributionHover
    //     statement={statement}
    //     resourceStatus={getResourceStatus(statement)}
    //     actionStatus={getActionStatus(statement)}
    //   />
    // ),
  };
};

const getEngineType = (properties) => {
  const configuration = JSON.parse(properties.configuration);
  if (configuration.engine) {
    return `AWS::RDS::DBInstance-${configuration.engine}`;
  } else {
    return 'AWS::RDS::DBInstance';
  }
};
