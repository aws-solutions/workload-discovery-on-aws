// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

declare type NonEmptyArray<T> = import('ramda').NonEmptyArray<T>;

declare type AppSyncResolverEvent<T> =
    import('aws-lambda').AppSyncResolverEvent<T>;

declare type AppSyncIdentity = import('aws-lambda').AppSyncIdentity;

declare type AppSyncIdentityCognito = import('aws-lambda').AppSyncIdentityCognito;

declare type AppSyncIdentityIAM = import('aws-lambda').AppSyncIdentityIAM;

declare type LambdaContext = import('aws-lambda').Context;

declare type STS = import('@aws-sdk/client-sts').STS;

declare type ServiceCatalogAppRegistryCls =
    typeof import('@aws-sdk/client-service-catalog-appregistry').ServiceCatalogAppRegistry;

declare type ResourceGroupsTaggingAPICls =
    typeof import('@aws-sdk/client-resource-groups-tagging-api').ResourceGroupsTaggingAPI;

declare type Application =
    import('@aws-sdk/client-service-catalog-appregistry').Application;

declare type AwsCredentialIdentityProvider =
    import('@smithy/types').AwsCredentialIdentityProvider;
declare type AwsCredentialidentityProviderFn = (
    arg0: WdMetadata,
    arg01: ApplicationMetadata
) => AwsCredentialIdentityProvider;
declare type Credentials = import('@aws-sdk/client-sts').Credentials;

declare type Arn = string;

declare type Partition = 'aws' | 'aws-cn' | 'aws-us-gov';

declare type VerifiedCredentials = {
    AccessKeyId: string;
    SecretAccessKey: string;
    SessionToken: string;
    Expiration: Date;
};

declare type VerifiedApplication = {
    applicationTag: Record<string, string>;
};

declare type TagResourcesDependencies = {
    ResourceGroupsTaggingAPI: ResourceGroupsTaggingAPICls;
    credentialProvider: AwsCredentialidentityProviderFn;
};

declare type Resource = {
    id: string;
    region: string;
    accountId: string;
};

declare type RegionResourceTuple = [string, Resource[]];

declare type WdMetadata = {
    externalId: string;
    wdAccountId: string;
    wdRegion: string;
};

declare type ApplicationMetadata = {
    region: string;
    accountId: string;
};

declare type CreateApplicationResponse = {
    name: string;
    applicationTag: Record<string, string>;
    unprocessedResources: string[];
};

declare type UnprocessedResources = {
    unprocessedResources: string[];
};

declare type CreateApplicationArguments = {
    accountId: string;
    region: string;
    name: string;
    resources: Resource[];
};

declare type MyApplicationResolverEvent =
    AppSyncResolverEvent<CreateApplicationArguments>;

declare type CreateApplicationDependencies = {
    tagResources: (
        applicationTag: Record<string, string>
    ) => (resourceTuple: RegionResourceTuple) => Promise<UnprocessedResources>;
    credentialProvider: AwsCredentialidentityProviderFn;
    ServiceCatalogAppRegistry: ServiceCatalogAppRegistryCls;
};

declare type Dependencies = {
    ServiceCatalogAppRegistry: ServiceCatalogAppRegistryCls;
    ResourceGroupsTaggingAPI: ResourceGroupsTaggingAPICls;
    credentialProvider: AwsCredentialidentityProviderFn;
};
