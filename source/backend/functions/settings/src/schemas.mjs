import {z} from 'zod';

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
    'us-west-2',
];

// z.enum expects a non-empty array, which is modeled [T, ...T[]] in the type system, hence we must
// supply the array in this form to satisfy the constraint
const regionEnum = z.enum(['global', ...AWS_REGIONS]);

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

const AccountIdSchema = z.union([
    z.string(createRegexStringErrorMap('account ID'))
        .regex(/^(\d{12})$/),
    z.literal('aws')
]);

const RegionSchema = z.object({
    name: regionEnum,
    isConfigEnabled: z.boolean().optional(),
    lastCrawled: z.string().datetime().optional(),
});

const AccountNameSchema = z.string({
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_string) {
            return {message: "Account names may not contain '<' or '>' character"};
        }
        return {message: ctx.defaultError};
    },
})
    // Account names may not contain the < or > character
    .regex(/^[^<>]*$/)
    .max(100);

const ResourcesRegionMetadataSchema = z.object({
    accountId: AccountIdSchema,
    count: z.number().int(),
    regions: z.array(z.object({
        count: z.number().int(),
        name: regionEnum,
        resourceTypes: z.array(z.object({
            count: z.number().int(),
            type: z.string().max(200),
        })),
    })),
});

const AccountSchema = z.object({
    accountId: AccountIdSchema,
    name: AccountNameSchema.optional(),
    organizationId: z
        .string(createRegexStringErrorMap('organizarion ID'))
        .regex(/^o-[a-z0-9]{10,32}$/).optional(),
    isIamRoleDeployed: z.boolean().optional(),
    isManagementAccount: z.boolean().optional(),
    lastCrawled: z.string().datetime().optional(),
    regions: z.array(RegionSchema).optional(),
    resourcesRegionMetadata: ResourcesRegionMetadataSchema.optional(),
});

export const AddAccountSchema = z.object({
    accounts: z.array(AccountSchema),
});

export const AddRegionsSchema = z.object({
    accountId: AccountIdSchema,
    regions: z.array(RegionSchema),
});

export const DeleteAccountsSchema = z.object({
    accountIds: z.array(AccountIdSchema),
});

export const DeleteRegionsSchema = z.object({
    accountId: AccountIdSchema,
    regions: z.array(RegionSchema),
});

export const GetAccountSchema = z.object({
    accountId: AccountIdSchema,
});

export const UpdateAccountSchema = z.object({
        accountId: AccountIdSchema,
        lastCrawled: z.string().datetime().optional(),
        name: AccountNameSchema.optional(),
        isIamRoleDeployed: z.boolean().optional(),
        resourcesRegionMetadata: ResourcesRegionMetadataSchema.optional(),
    },
);

export const UpdateRegionsSchema = z.object({
    accountId: AccountIdSchema,
    regions: z.array(RegionSchema),
});

export const GetResourcesAccountMetadataSchema = z.object({
    accounts: z.array(AccountSchema).optional(),
});

export const GetResourcesRegionMetadata = z.object({
    accounts: z.array(AccountSchema).optional(),
});
