provider "aws" {
  region = var.region
}

# CloudFront only accepts ACM certificates issued in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}