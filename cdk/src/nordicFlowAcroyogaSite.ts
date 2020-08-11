import { CloudFrontWebDistribution, OriginProtocolPolicy, SecurityPolicyProtocol, SSLMethod, } from '@aws-cdk/aws-cloudfront';
import { ARecord, HostedZone, HostedZoneAttributes, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { CloudFrontOriginBehavior } from './s3/cloudFrontOriginBehavior';

export interface NordicFlowAcroyogaSiteProps extends StackProps {
  hostedZone: HostedZoneAttributes;
  domainName: string;
  aliases?: string[];
  cloudFrontCertificate: { certificateArn: string };
}

export class NordicFlowAcroyogaSite extends Stack {
  constructor(scope: Construct, id: string, props: NordicFlowAcroyogaSiteProps) {
    super(scope, id, props);

    const zone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', props.hostedZone);
    const aliases = [props.domainName].concat(props.aliases ?? []);

    const bucket = new Bucket(this, 'Bucket', {
      bucketName: props.domainName,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });
    bucket.grantPublicAccess();

    const distribution = new CloudFrontWebDistribution(this, 'CloudFront', {
      aliasConfiguration: {
        acmCertRef: props.cloudFrontCertificate.certificateArn,
        names: aliases,
        sslMethod: SSLMethod.SNI,
        securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2018,
      },
      originConfigs: [
        {
          customOriginSource: {
            domainName: bucket.bucketWebsiteDomainName,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          },
          behaviors: [{ ...CloudFrontOriginBehavior.S3StaticShort, isDefaultBehavior: true }],
        },
      ],
    });

    const target = RecordTarget.fromAlias(new CloudFrontTarget(distribution));
    aliases.forEach((recordName, index) => {
      new ARecord(distribution, `AliasRecord${index}`, {
        recordName,
        target,
        zone,
      });
    });
  }
}
