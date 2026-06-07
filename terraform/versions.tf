terraform {
  required_version = ">= 1.15"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.47"
    }
  }

  backend "s3" {
    bucket       = "terraform-xehos"
    key          = "resume.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}