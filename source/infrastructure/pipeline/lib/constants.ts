/**
 * These constants will be used when configuring where you want your solution to be built and deployed.
 * AWS_REGION - The Region you wish to deploy to.
 * BUCKET_NAME - The S3 Bucket name to be created to store your deployment artifacts.
 * SOLUTION_NAME - A name for your test solution.
 * VERSION - A version number for this test release e.g vX.Y.Z
 * IMAGE_TAG - The tag that will be given to Docker image.
 * REPO_NAME - The CodeCommit repo that will be tracking any changes you make.
 * ADMIN_EMAIL - The email you'd like to use to login to workload discovery.
 */
export enum Constants {
    AWS_REGION = 'us-west-2',
    BUCKET_NAME = 'workload-discovery-dist-bucket',
    SOLUTION_NAME = 'workload-discovery',
    VERSION = 'v2.1.0',
    IMAGE_TAG= 'wdTag',
    REPO_NAME='workload-discovery-on-aws',
    ADMIN_EMAIL=''
}