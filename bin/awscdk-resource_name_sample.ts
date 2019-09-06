#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwscdkResourceNameSampleStack } from '../lib/awscdk-resource_name_sample-stack';
import { ResourceName } from '../lib/resourceName';

const systemEnv = process.env.SYSTEM_ENV ? process.env.SYSTEM_ENV : 'dev';
const resourceName = new ResourceName('AWS-CDK-Resource-Sample', systemEnv);

const app = new cdk.App();
new AwscdkResourceNameSampleStack(app, resourceName);
