# AWS CI/CD Runbook

## Pre-requisites

- Authenticate github account.
- Enough privilege ("god mode") to create the resources.  

## CodeBuild
To create CodeBuild resources, we need to use codebuild.yml. 
Either, use this file using CloudFormation UI or run the following command from aws cli. 

```
aws cloudformation create-stack --stack-name <stack_name> --template-body file://<path>/codebuild.yml  --capabilities CAPABILITY_NAMED_IAM
``` 

To update stack:

```
aws cloudformation update-stack --stack-name <stack_name> --template-body file://<path>/codebuild.yml  --capabilities CAPABILITY_NAMED_IAM
``` 

What this will do? 
- Create S3 Bucket
- Create CodeBuild Service Role including Policy doc
- Create CodeBuild Project
