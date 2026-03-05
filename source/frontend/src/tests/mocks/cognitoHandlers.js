// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {http, HttpResponse} from 'msw';

// SRP parameters — structurally valid mock values.
// SRP_B: 768-char hex string (3072 bits), less than the SRP prime N so B % N != 0.
const SRP_B = 'a'.repeat(768);
const SALT = 'a'.repeat(32);
// SECRET_BLOCK: valid base64 string used as HMAC input by the Amplify SRP client.
const SECRET_BLOCK = 'A'.repeat(172);

const REGION = 'eu-central-1';
const USER_POOL_ID = 'eu-central-1_test';
const CLIENT_ID = 'testClientId';
const ISS = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

function base64url(obj) {
    return btoa(JSON.stringify(obj))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function makeJwt(payload) {
    const header = {alg: 'RS256', typ: 'JWT', kid: 'test-kid'};
    return `${base64url(header)}.${base64url(payload)}.fakesignature`;
}

const idToken = makeJwt({
    sub: 'test-user-id',
    iss: ISS,
    aud: CLIENT_ID,
    token_use: 'id',
    'cognito:username': 'testUser',
    email: 'test@example.com',
    exp: 9999999999,
    iat: 1700000000,
    auth_time: 1700000000,
});

const accessToken = makeJwt({
    sub: 'test-user-id',
    iss: ISS,
    client_id: CLIENT_ID,
    token_use: 'access',
    scope: 'openid profile email',
    username: 'testUser',
    exp: 9999999999,
    iat: 1700000000,
    auth_time: 1700000000,
});

const cognitoHandlers = [
    http.post(`https://cognito-idp.${REGION}.amazonaws.com/`, async ({request}) => {
        const target = request.headers.get('x-amz-target');
        const body = await request.json();

        if (target === 'AWSCognitoIdentityProviderService.InitiateAuth') {
            return HttpResponse.json({
                ChallengeName: 'PASSWORD_VERIFIER',
                ChallengeParameters: {
                    SALT,
                    SECRET_BLOCK,
                    SRP_B,
                    USERNAME: body.AuthParameters?.USERNAME ?? 'testUser',
                    USER_ID_FOR_SRP: body.AuthParameters?.USERNAME ?? 'testUser',
                },
            });
        }

        if (target === 'AWSCognitoIdentityProviderService.RespondToAuthChallenge') {
            return HttpResponse.json({
                AuthenticationResult: {
                    AccessToken: accessToken,
                    IdToken: idToken,
                    RefreshToken: 'mock-refresh-token',
                    ExpiresIn: 3600,
                    TokenType: 'Bearer',
                },
                ChallengeParameters: {},
            });
        }

        // Fallback for any other Cognito user pool calls (e.g., GetUser)
        return HttpResponse.json({});
    }),

    // Safety-net handler for identity pool credential requests
    http.post(`https://cognito-identity.${REGION}.amazonaws.com/`, async ({request}) => {
        const target = request.headers.get('x-amz-target');

        if (target === 'AWSCognitoIdentityService.GetId') {
            return HttpResponse.json({
                IdentityId: `${REGION}:test-identity-id`,
            });
        }

        if (target === 'AWSCognitoIdentityService.GetCredentialsForIdentity') {
            return HttpResponse.json({
                Credentials: {
                    AccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
                    SecretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                    SessionToken: 'mock-session-token',
                    Expiration: 9999999999,
                },
                IdentityId: `${REGION}:test-identity-id`,
            });
        }

        return HttpResponse.json({});
    }),
];

export default cognitoHandlers;
