// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ServiceCatalogAppRegistry} from '@aws-sdk/client-service-catalog-appregistry';
import {ResourceGroupsTaggingAPI} from '@aws-sdk/client-resource-groups-tagging-api';
import {Logger} from '@aws-lambda-powertools/logger';
import {build as buildArn} from '@aws-sdk/util-arn-parser';
import * as R from 'ramda';
import z from 'zod';
import {fromTemporaryCredentials} from '@aws-sdk/credential-providers';

const logger = new Logger({serviceName: 'WdMyApplicationsExport'});

const ACCESS_DENIED = 'AccessDenied';
const ROLE_SESSION_DURATION_SECONDS = 3600;
const GLOBAL = 'global';

const AWS_REGIONS = [
    'af-south-1',
    'ap-east-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ap-south-1',
    'ap-south-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'ca-central-1',
    'ca-west-1',
    'cn-north-1',
    'cn-northwest-1',
    'eu-central-1',
    'eu-central-2',
    'eu-north-1',
    'eu-south-1',
    'eu-south-2',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'me-central-1',
    'me-south-1',
    'sa-east-1',
    'us-east-1',
    'us-east-2',
    'us-gov-east-1',
    'us-gov-west-1',
    'us-west-1',
    'us-west-2'
];

class TypeGuardError extends Error {
    /**
     * @param {string} message
     * @param {{cause?: Error}} [options]
     */
    constructor(message, options) {
        super(message, options);
        this.name = 'TypeGuardError';
    }
}

class AccessDeniedError extends Error {
    /**
     * @param {string} message
     * @param {string} accountId
     * @param {{cause?: Error}} [options]
     */
    constructor(message, accountId, options) {
        super(message, options);
        this.name = 'AccessDeniedError';
        this.accountId = accountId;
    }
}

/** @type {Partition}*/
const AWS_PARTITION = 'aws';
/** @type {Partition}*/
const AWS_CN_PARTITION = 'aws-cn';
/** @type {Partition}*/
const AWS_US_GOV_PARTITION = 'aws-us-gov';

/** @type {Map<string, Partition>}*/
const partitions = new Map([
    ['cn-north-1', AWS_CN_PARTITION],
    ['cn-northwest-1', AWS_CN_PARTITION],
    ['us-gov-east-1', AWS_US_GOV_PARTITION],
    ['us-gov-west-1', AWS_US_GOV_PARTITION],
]);

/** @type { (wdMetadata: WdMetadata, applicationMetadta: ApplicationMetadata) => Arn }*/
function createMyApplicationsRoleArn(
    {wdAccountId, wdRegion},
    {accountId, region}
) {
    /** @type {Partition}*/
    const partition = partitions.get(region) ?? AWS_PARTITION;
    const resource = `role/WorkloadDiscoveryMyApplicationsRole-${wdAccountId}-${wdRegion}`;

    return buildArn({
        service: 'iam',
        partition,
        region: '',
        accountId,
        resource,
    });
}

const tagResources = R.curry(
    /** @type {(tagResourcesDependencies: TagResourcesDependencies, wdMetadata: WdMetadata, applicationTag: Record<string, string>, resourceTuple: RegionResourceTuple) => Promise<UnprocessedResources>} */
    async (
        {ResourceGroupsTaggingAPI, credentialProvider},
        {wdAccountId, wdRegion, externalId},
        applicationTag,
        [accRegion, resources]
    ) => {
        const [accountId, region] = accRegion.split('|');

        const taggingClient = new ResourceGroupsTaggingAPI({
            credentials: await credentialProvider(
                {wdAccountId, wdRegion, externalId},
                {accountId, region}
            ),
            region,
        });

        const BATCH_SIZE = 20;

        return Promise.resolve(R.splitEvery(BATCH_SIZE, resources))
            .then(
                R.map(chunk => {
                    return taggingClient
                        .tagResources({
                            ResourceARNList: chunk.map(x => x.id),
                            Tags: {
                                ...applicationTag,
                            },
                        })
                        .then(({FailedResourcesMap = {}}) => {
                            const unprocessedResources =
                                Object.keys(FailedResourcesMap);

                            if (!R.isEmpty(unprocessedResources)) {
                                logger.error(
                                    'There were errors tagging resources.',
                                    {
                                        unprocessedResources:
                                            FailedResourcesMap,
                                    }
                                );
                            }

                            return unprocessedResources;
                        });
                })
            )
            .then(ps => Promise.all(ps))
            .then(ps => ({unprocessedResources: ps.flat()}))
            .catch(err => {
                logger.error(
                    'There was an error preventing any resources being tagged.',
                    {error: err, accountId, region}
                );
                return {unprocessedResources: resources.map(x => x.id)};
            });
    }
);

/**
 * A type guard to validate the response from CreateApplication. The applicationTag field
 * should always be present but if it isn't it is an unrecoverable error and we should throw.
 *
 * @type {(application: Application) => asserts application is VerifiedApplication} */
function hasApplicationTag(application) {
    if (application.applicationTag == null) {
        throw new TypeGuardError('awsApplication tag is missing');
    }
}

/**
 * @type { (dependencies: CreateApplicationDependencies, wdMetadata: WdMetadata, applicationMetadata: ApplicationMetadata, name: string, resources: NonEmptyArray<Resource>) => Promise<CreateApplicationResponse> }
 * @throws {TypeGuardError}
 * */
async function createApplication(
    {ServiceCatalogAppRegistry, tagResources, credentialProvider},
    {wdAccountId, wdRegion, externalId},
    {accountId, region},
    name,
    resources
) {
    const appRegistryClient = new ServiceCatalogAppRegistry({
        credentials: await credentialProvider(
            {wdAccountId, wdRegion, externalId},
            {accountId, region}
        ),
        region,
    });

    const applicationTag = await appRegistryClient
        .createApplication({name})
        .then(R.tap(() => logger.info('Empty application created.')))
        .then(({application = {}}) => {
            hasApplicationTag(application);
            return application.applicationTag;
        })
        .catch(err => {
            logger.error(`There was an error creating the application: ${err}`);
            if (err.message === `You already own an application '${name}'`) {
                throw new Error(
                    `An application with the name ${name} already exists.`,
                    {cause: err}
                );
            }
            throw err;
        });

    const grouped = R.groupBy(x => {
        // we need to choose a region to tag global resources so we use the region the application
        // is being created in as the fallback
        const groupRegion = x.region === GLOBAL ? region : x.region;
        return `${x.accountId}|${groupRegion}`;
    }, resources);

    return (
        Promise.resolve(grouped)
            .then(R.toPairs)
            // The resource array in RegionResourceTuple cannot be undefined because the Zod validation
            // done in the lambda handler ensures that there will always be at least one element of
            // type Resource in the resources array passed to R.groupBy
            // @ts-expect-error
            .then(R.map(tagResources(applicationTag)))
            .then(ps => Promise.all(ps))
            .then(x => {
                const unprocessedResources = x.flatMap(
                    x => x.unprocessedResources
                );
                logger.info(
                    `There were ${unprocessedResources.length} unprocessed resources.`,
                    {unprocessedResources}
                );
                return {name, applicationTag, unprocessedResources};
            })
            .then(
                R.tap(({unprocessedResources}) => {
                    logger.info('Application successfully created', {
                        metricEvent: {
                            type: 'ApplicationCreated',
                            resourceCount: resources.length,
                            unprocessedResourceCount:
                                unprocessedResources.length,
                            regions: Object.keys(
                                R.groupBy(x => x.region, resources)
                            ),
                        },
                    });
                })
            )
    );
}

class EnvironmentVariableError extends Error {
    /**
     * @param {string} message
     * @param {{cause?: Error}} [options]
     */
    constructor(message, options) {
        super(message, options);
        this.name = 'EnvironmentVariableError';
    }
}

class ValidationError extends Error {
    /**
     * @param {string} message
     * @param {{cause?: Error}} [options]
     */
    constructor(message, options) {
        super(message, options);
        this.name = 'ValidationError';
    }
}

/** @type {(prettyTypeName: string) => {errorMap: z.ZodErrorMap}} */
function createRegexStringErrorMap(prettyTypeName) {
    return {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_string) {
                return {message: `Not a valid ${prettyTypeName}`};
            }
            return {message: ctx.defaultError};
        },
    };
}

// z.enum expects a non-empty array, which is modeled [T, ...T[]] in the type system, hence we must
// supply the array in this form to satisfy the constraint
const regionEnum = z.enum([AWS_REGIONS[0], ...AWS_REGIONS.slice(1)]);

const createApplicationArgumentsSchema = z.object({
    accountId: z
        .string(createRegexStringErrorMap('account ID'))
        .regex(/^(\d{12})$/),
    region: regionEnum,
    name: z.string().regex(/[-.\w]+/, {
        message: `Application name must satisfy the following pattern: [-.\\w]+`,
    }),
    resources: z
        .array(
            z.object({
                id: z
                    .string(createRegexStringErrorMap('ARN'))
                    .max(4096)
                    .regex(/arn:(aws|aws-cn|aws-us-gov):.*/),
                accountId: z
                    .string(createRegexStringErrorMap('account ID'))
                    .regex(/^(\d{12})$/),
                region: z.enum([GLOBAL, ...AWS_REGIONS]),
            })
        )
        .nonempty(),
});

/**
 * @type { (args: CreateApplicationArguments) => z.infer<typeof createApplicationArgumentsSchema> }
 * @throws {ValidationError}
 * */
function validateCreateApplicationArguments(args) {
    const {data, error, success} =
        createApplicationArgumentsSchema.safeParse(args);

    if (!success) {
        const message = error.issues
            .map(({path, message}) => {
                return `Validation error for ${path.join('/')}: ${message}`;
            })
            .join('\n');
        throw new ValidationError(message, {cause: error});
    }

    return data;
}

const envSchema = z.object({
    AWS_ACCOUNT_ID: z.string(),
    AWS_REGION: z.string(),
    EXTERNAL_ID: z.string(),
});

/**
 * Wraps the fromTemporaryCredentials Provider to provide a customised error message
 * @type {(wdMetadata: WdMetadata, applicationMetadata: ApplicationMetadata) => AwsCredentialIdentityProvider}
 */
export function wrappedCredentialProvider(
    {wdAccountId, wdRegion, externalId},
    {accountId, region}
) {
    const RoleArn = createMyApplicationsRoleArn(
        {wdAccountId, wdRegion, externalId},
        {accountId, region}
    );

    return () => {
        const provider = fromTemporaryCredentials({
            params: {
                RoleArn,
                RoleSessionName: 'myApplicationDiscovery',
                DurationSeconds: ROLE_SESSION_DURATION_SECONDS,
                ExternalId: externalId
            },
        });

        return provider().catch(e => {
            logger.error(`Error in wrappedCredentialProvider: ${e}`);
            if (e.Code === ACCESS_DENIED) {
                throw new AccessDeniedError(
                    `Error assuming ${RoleArn}. Ensure the global-resources template is deployed in account: ${accountId}.`,
                    accountId
                );
            }

            throw e;
        });
    };
}

/**
 * A type guard to validate ensure the username variable exists in the AppSync resolver identity field.
 * This will always be there as the system is only configured to use IAM and Cognito authentication
 * but we need to inform the compiler of this.
 *
 * @type {(identity: AppSyncIdentity) => identity is AppSyncIdentityCognito | AppSyncIdentityIAM} */
function hasUsername(identity) {
    return identity != null && ('username' in identity);
}

/**
 * @type { (dependencies: Dependencies, env: NodeJS.ProcessEnv) => (event: MyApplicationResolverEvent, context: LambdaContext) => Promise<CreateApplicationResponse> }
 * @throws {EnvironmentVariableError}
 * @throws {TypeGuardError}
 * @throws {ValidationError}
 * */
export function _handler(
    {ResourceGroupsTaggingAPI, ServiceCatalogAppRegistry, credentialProvider},
    env
) {
    return async (event, context) => {
        const fieldName = event.info.fieldName;
        if(hasUsername(event.identity)) {
            logger.info(`User ${event.identity.username} invoked the ${fieldName} operation.`);
        }

        const {data: parsedEnv, error, success} = envSchema.safeParse(env);
        if (!success) {
            logger.error('Unable to retrieve environment variables', {
                error,
                env,
            });
            throw new EnvironmentVariableError(
                'Unable to retrieve environment variables',
                {cause: error}
            );
        }

        const {
            AWS_ACCOUNT_ID: wdAccountId,
            AWS_REGION: wdRegion,
            EXTERNAL_ID: externalId,
        } = parsedEnv;

        const args = event.arguments;
        logger.info(
            'GraphQL arguments:',
            {arguments: args, operation: fieldName}
        );

        switch (fieldName) {
            case 'createApplication': {
                const {accountId, region, name, resources} =
                    validateCreateApplicationArguments(args);

                const tagResourcesPartial = tagResources(
                    {credentialProvider, ResourceGroupsTaggingAPI},
                    {wdAccountId, wdRegion, externalId}
                );

                return createApplication(
                    {
                        ServiceCatalogAppRegistry,
                        credentialProvider,
                        tagResources: tagResourcesPartial,
                    },
                    {wdAccountId, wdRegion, externalId},
                    {accountId, region},
                    name,
                    resources
                );
            }
            default: {
                return Promise.reject(
                    new Error(
                        `Unknown field, unable to resolve ${fieldName}.`
                    )
                );
            }
        }
    };
}

/** @type {(event: MyApplicationResolverEvent, context: LambdaContext) => Promise<CreateApplicationResponse>} */
export const handler = _handler(
    {
        ServiceCatalogAppRegistry,
        ResourceGroupsTaggingAPI,
        credentialProvider: wrappedCredentialProvider,
    },
    process.env
);
