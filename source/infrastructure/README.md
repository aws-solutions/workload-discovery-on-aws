# Welcome to the Workload Discovery Pipeline

This pipeline will build, test, and deploy your solution to your local account for easy development.

1) Create a CodeCommit repository and push up your fork. Follow the [setup guide](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up.html) if you need help creating your new repository.
2) Fill out the constants in the constants file located in `source/infrastructure/pipeline/lib/constants.ts`. 
3) Navigate to the `source/infrastructure/pipeline` and run `cdk bootstrap` if you haven't already.
4) In that same directory, run `cdk deploy PipelineStack --parameters workingBranch=main` to deploy your new pipeline. Change the workingBranch parameter to the branch that you'd like your pipeline to deploy changes from.
5) The pipeline should run your changes once deployed and will deploy the newest version of your code every time you make a change.