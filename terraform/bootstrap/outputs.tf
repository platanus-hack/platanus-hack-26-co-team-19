output "terraform_state_bucket_name" {
  description = "Name of the S3 bucket that stores Terraform state."
  value       = aws_s3_bucket.terraform_state.bucket
}

output "terraform_state_key" {
  description = "Object key used by terraform/main for its remote state."
  value       = local.state_key
}

output "terraform_lock_table_name" {
  description = "DynamoDB table used for Terraform state locking."
  value       = aws_dynamodb_table.terraform_lock.name
}

output "terraform_backend_configuration" {
  description = "Non-sensitive backend values required to initialize terraform/main."
  value = {
    bucket         = aws_s3_bucket.terraform_state.bucket
    key            = local.state_key
    region         = var.aws_region
    dynamodb_table = aws_dynamodb_table.terraform_lock.name
    encrypt        = true
  }
}
