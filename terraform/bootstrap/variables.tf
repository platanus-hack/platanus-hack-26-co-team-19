variable "aws_region" {
  description = "AWS region where the Terraform state backend is created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Lowercase project name used to derive state backend resource names."
  type        = string
  default     = "ocr-pipeline"
}

variable "environment" {
  description = "Deployment environment included in state object and lock table names."
  type        = string
  default     = "dev"
}

variable "state_bucket_name" {
  description = "Optional globally unique S3 bucket name. When null, it is derived from project, account ID, and region."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition     = var.state_bucket_name == null || can(regex("^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$", var.state_bucket_name))
    error_message = "state_bucket_name must be a valid 3-63 character lowercase S3 bucket name."
  }
}

variable "tags" {
  description = "Additional tags applied to Terraform state backend resources."
  type        = map(string)
  default     = {}
}
