#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { NordicFlowAcroyogaSite } from './nordicFlowAcroyogaSite';

const account = {
  env: {
    account: '451440606702',
    region: 'eu-north-1',
  },
};

const app = new cdk.App();

new NordicFlowAcroyogaSite(app, 'prod-nordicflowacroyoga-site', {
  ...account,
  hostedZone: {
    hostedZoneId: 'Z00389013O76EFC1KFHDI',
    zoneName: 'nordicflowacroyoga.fi',
  },
  domainName: 'preview.nordicflowacroyoga.fi',
  cloudFrontCertificate: {
    certificateArn:
      'arn:aws:acm:us-east-1:451440606702:certificate/006ee609-7653-491f-993a-927434aaa052',
  },
});
