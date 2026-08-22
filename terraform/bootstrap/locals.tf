locals {
  state_bucket_name = coalesce(
    var.state_bucket_name,
    "${var.project_name}-terraform-state-${data.aws_caller_identity.current.account_id}-${var.aws_region}",
  )

  state_key       = "${var.project_name}/${var.environment}/terraform.tfstate"
  lock_table_name = "${var.project_name}-${var.environment}-terraform-locks"

  common_tags = merge(
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = var.project_name
      Purpose     = "terraform-state"
    },
    var.tags,
  )
}
