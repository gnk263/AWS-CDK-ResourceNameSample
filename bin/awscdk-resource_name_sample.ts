#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwscdkResourceNameSampleStack } from '../lib/awscdk-resource_name_sample-stack';

const app = new cdk.App();
new AwscdkResourceNameSampleStack(app, 'AwscdkResourceNameSampleStack');
