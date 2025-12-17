import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as cdk from "aws-cdk-lib"
import * as cm from "aws-cdk-lib/aws-certificatemanager"
import * as r53 from "aws-cdk-lib/aws-route53"
import * as r53Targets from "aws-cdk-lib/aws-route53-targets"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import * as cf from "aws-cdk-lib/aws-cloudfront"
import * as cfOrigins from "aws-cdk-lib/aws-cloudfront-origins"

export class ResumeStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const zone = r53.PublicHostedZone.fromLookup(this, "zone", {
            domainName: "frigon.app"
        })

        const certificate = new cm.Certificate(this, "certificate", {
            domainName: "alexandre.frigon.app",
            validation: cm.CertificateValidation.fromDns(zone)
        })

        const bucket = new s3.Bucket(this, "bucket", {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            enforceSSL: true,
            versioned: false
        })

        const distribution = new cf.Distribution(this, "distribution", {
            defaultRootObject: "index.html",
            domainNames: ["alexandre.frigon.app"],
            certificate,
            httpVersion: cf.HttpVersion.HTTP2_AND_3,
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                    ttl: cdk.Duration.days(30)
                }
            ],
            defaultBehavior: {
                origin: cfOrigins.S3BucketOrigin.withOriginAccessControl(bucket),
                viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                responseHeadersPolicy: cf.ResponseHeadersPolicy.SECURITY_HEADERS
            }
        })

        new r53.ARecord(this, "A-alexandre", {
            zone,
            recordName: "alexandre",
            target: r53.RecordTarget.fromAlias(new r53Targets.CloudFrontTarget(distribution))
        })

        new r53.AaaaRecord(this, "AAAA-alexandre", {
            zone,
            recordName: "alexandre",
            target: r53.RecordTarget.fromAlias(new r53Targets.CloudFrontTarget(distribution))
        })

        // Hashed assets with immutable cache
        new s3Deploy.BucketDeployment(this, "content-assets", {
            sources: [s3Deploy.Source.asset("../dist/assets")],
            destinationBucket: bucket,
            destinationKeyPrefix: "assets",
            distribution,
            distributionPaths: ["/assets/*"],
            prune: true,
            cacheControl: [
                s3Deploy.CacheControl.setPublic(),
                s3Deploy.CacheControl.maxAge(cdk.Duration.days(365)),
                s3Deploy.CacheControl.immutable()
            ]
        })

        // Static files (favicons, robots.txt, etc.)
        new s3Deploy.BucketDeployment(this, "content-static", {
            sources: [
                s3Deploy.Source.asset("../dist", {
                    exclude: ["assets"]
                })
            ],
            destinationBucket: bucket,
            distribution,
            distributionPaths: ["/*"],
            prune: false,
            cacheControl: [
                s3Deploy.CacheControl.setPublic(),
                s3Deploy.CacheControl.maxAge(cdk.Duration.days(30))
            ]
        })
    }
}
