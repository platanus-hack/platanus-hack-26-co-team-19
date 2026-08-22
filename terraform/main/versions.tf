terraform {
  required_version = ">= 1.10.0"

  # Values are supplied with -backend-config after terraform/bootstrap is applied.
  backend "s3" {}

  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
