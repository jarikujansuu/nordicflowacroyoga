import { Behavior, CloudFrontAllowedMethods } from '@aws-cdk/aws-cloudfront';
import { Duration } from '@aws-cdk/core';

export class CloudFrontOriginBehavior {
  static readonly S3CorsHeaders = [
    'Access-Control-Request-Headers',
    'Access-Control-Request-Method',
    'Origin',
  ];

  static readonly S3DynamicUI: Partial<Behavior> = {
    allowedMethods: CloudFrontAllowedMethods.ALL,
    forwardedValues: {
      queryString: true,
      headers: CloudFrontOriginBehavior.S3CorsHeaders,
      cookies: { forward: 'all' },
    },
    compress: true,
  };

  static readonly S3Static: Partial<Behavior> = {
    allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
    forwardedValues: {
      queryString: false,
      headers: CloudFrontOriginBehavior.S3CorsHeaders,
      cookies: { forward: 'none' },
    },
    compress: true,
  };

  static readonly S3StaticShort: Partial<Behavior> = {
    ...CloudFrontOriginBehavior.S3Static,
    minTtl: Duration.seconds(0),
    defaultTtl: Duration.seconds(0),
  };

  static readonly S3StaticLong: Partial<Behavior> = {
    ...CloudFrontOriginBehavior.S3Static,
    minTtl: Duration.days(100),
    defaultTtl: Duration.days(100),
  };
}
