// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { randomUUID } from "crypto";
import { S3Client, paginateListObjectsV2, HeadObjectCommand } from "@aws-sdk/client-s3";
import { SSMClient, GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm";
import axios from 'axios';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import aws4 from 'aws4';

const {REGION: region} = process.env;
const s3Client = new S3Client({region});
const ssmClient = new SSMClient({region});
const metrics_parameter_name = '/Solutions/WorkloadDiscovery/anonymous_metrics_uuid';

type Metric = {
    numberOfDiagrams: number,
    costFeatureEnabled: boolean,
    numberOfAccounts: number,
    crossAccountDiscovery: string | undefined,
    numberOfResources: number
}

type Usage = {
    Solution: string,
    UUID: string,
    TimeStamp: string,
    Data: Metric,
    Version: string
}

export const handler = async () => {
    const {CROSS_ACCOUNT_DISCOVERY: crossAccountDiscovery} = process.env;
    let [ numberOfDiagrams, costFeatureEnabled ] = await Promise.all([getDiagramCount(), checkCostFeature()])
    let {numberOfAccounts, numberOfResources}: any = await getAccountAndResourceCount();
    await sendMetrics({
      numberOfDiagrams,
      costFeatureEnabled,
      crossAccountDiscovery,
      numberOfAccounts,
      numberOfResources
    });
};

async function getDiagramCount() {
    let diagramsCount: number = 0;

    for await (const s3Page of paginateListObjectsV2({
        client: s3Client,
        pageSize: 100
    },{
        Bucket: process.env.diagramBucket,
        Prefix: "private/"
    })) {
        if (s3Page.KeyCount) {
            diagramsCount += s3Page?.KeyCount;
        }
    }
    for await (const s3Page of paginateListObjectsV2({
        client: s3Client,
        pageSize: 100
    }, {
        Bucket: process.env.diagramBucket,
        Prefix: "public/"
    })) {
        if (s3Page.KeyCount) {
            diagramsCount += s3Page.KeyCount;
        }
    }

    return diagramsCount
}

async function checkCostFeature() {
  const getCostFileCommand = new HeadObjectCommand({
    Bucket: process.env.costFeatureBucket,
    Key: "aws-programmatic-access-test-object"
  })
  try {
    await s3Client.send(getCostFileCommand)
  }
  catch {
    return false
  }
  return true
}

async function getAccountAndResourceCount(): Promise<Object> {
  const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_ENDPOINT as string;
  const CredentialsProvider = fromNodeProviderChain();
  const method = 'POST';
  const query = /* GraphQL */ `
    query MyQuery {
      getResourcesAccountMetadata {
        accountId
        count
      }
    }
  `;
  let credentials = await CredentialsProvider();
  const url = new URL(GRAPHQL_ENDPOINT)
  const region = process.env.REGION;

  const signingOptions = {
      method,
      host: url.hostname,
      path: url.pathname,
      region,
      body: JSON.stringify({
          query
      }),
      service: 'appsync'
  };

  const sig = aws4.sign(signingOptions, credentials);

  const response = await axios.request({
      url: GRAPHQL_ENDPOINT,
      method: method,
      headers: sig.headers,
      data: signingOptions.body
  })

  let results: any = {
    numberOfAccounts: 0,
    numberOfResources: 0
  }

  let resourcesCount = 0;

  const accountData = response.data.data.getResourcesAccountMetadata
  if (accountData) {
    
    for(const accountIndex in accountData) {
      resourcesCount += accountData[accountIndex]["count"]
    }

    results.numberOfResources = resourcesCount;

    if (accountData.length >= 2) {
      let foundIndex = accountData.findIndex((data: any) => data.accountId == "aws")
      if (foundIndex != -1) {
        accountData.splice(foundIndex,1)
      }
    }

    results.numberOfAccounts = accountData.length;
  }

  return results;
}

async function getAnonymousUuid(): Promise<string> {
    try {
      const input = new GetParameterCommand({
        Name: metrics_parameter_name
      });
      let response = await ssmClient.send(input);
      return response.Parameter?.Value as string
    }
    catch(error: any) {
      if (error.name == 'ParameterNotFound') {
        const uuid = randomUUID();
        await updateAnonymousUuid(uuid);
        return uuid;
      }
      throw error;
    }
  }

  async function updateAnonymousUuid(uuid: string) {
    const input = new PutParameterCommand({
      Name: metrics_parameter_name,
      Description:'Unique Id for anonymous metrics collection',
      Value: uuid,
      Type:'String'
    });
    return ssmClient.send(input);
  }

async function sendMetrics(metric: Metric) {
    const UUID = await getAnonymousUuid();
    return postToMetricsApi({
        Solution: 'SO0075',
        UUID,
        TimeStamp: new Date().toISOString().replace("T"," ").substring(0, 21),
        Data: metric,
        Version: process.env.SOLUTION_VERSION as string
    });
}

async function postToMetricsApi(usage: Usage) {
  const url = 'https://metrics.awssolutionsbuilder.com/generic';
  return axios.post(url, usage, {
      headers: {
          "Content-Type": "application/json"
      }
  })
}
