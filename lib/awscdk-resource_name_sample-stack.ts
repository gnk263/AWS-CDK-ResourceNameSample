import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { Duration } from '@aws-cdk/core';
import cdk = require('@aws-cdk/core');
import { ResourceName } from './resourceName';


export class AwscdkResourceNameSampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, resourceName: ResourceName, props?: cdk.StackProps) {
    const id = resourceName.stackName('App');
    super(scope, id, props);

    // DynamoDB
    const userTableName = resourceName.dynamodbName('user');
    const userTable = new dynamodb.Table(this, userTableName, {
      tableName: userTableName,
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });


    // Lmabda (ユーザ作成)
    const createUserLambdaName = resourceName.lambdaName('create-user');
    const createUserLambda = new lambda.Function(this, createUserLambdaName, {
      code: lambda.Code.asset('src/lambda'),
      handler: 'createUser.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      functionName: createUserLambdaName,
      timeout: Duration.seconds(3),
      environment: {
        SYSTEM_ENV: resourceName.systemEnv,
        USER_TABLE_NAME: userTable.tableName,
      }
    });

    // Lmabda (ユーザ取得)
    const getUserLambdaName = resourceName.lambdaName('get-user');
    const getUserLambda = new lambda.Function(this, getUserLambdaName, {
      code: lambda.Code.asset('src/lambda'),
      handler: 'getUser.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      functionName: getUserLambdaName,
      timeout: Duration.seconds(3),
      environment: {
        SYSTEM_ENV: resourceName.systemEnv,
        USER_TABLE_NAME: userTable.tableName,
      }
    });

    // API Gateway
    const apiName = resourceName.apiName('user');
    const api = new apigateway.RestApi(this, apiName, {
      restApiName: apiName,
    });

    const integrationCreateUserLambda = new apigateway.LambdaIntegration(createUserLambda, {
      proxy: true,
    });
    const integrationGetUserLambda = new apigateway.LambdaIntegration(getUserLambda, {
      proxy: true,
    });

    const userResource = api.root.addResource('user');
    const idResource = userResource.addResource('{id}');
    idResource.addMethod('POST', integrationCreateUserLambda);
    idResource.addMethod('GET', integrationGetUserLambda);
  }
}
