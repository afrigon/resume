output "bucket" {
  description = "Name of the S3 bucket hosting the site content"
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "CloudFront distribution ID used for cache invalidation"
  value       = aws_cloudfront_distribution.site.id
}
