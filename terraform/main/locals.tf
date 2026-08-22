locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = merge(
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = var.project_name
    },
    var.tags,
  )

  ocr_job_reader_function_name         = "${local.name_prefix}-ocr-job-reader"
  ocr_document_processor_function_name = "${local.name_prefix}-ocr-document-processor"
  ocr_state_machine_name               = "${local.name_prefix}-ocr-pipeline"
  postgres_secret_name                 = coalesce(var.postgres_secret_name, "${local.name_prefix}/postgres")
  deepseek_secret_name                 = coalesce(var.deepseek_secret_name, "${local.name_prefix}/deepseek")
  legal_documents_bucket_name = coalesce(
    var.legal_documents_bucket_name,
    "${local.name_prefix}-legal-documents-${data.aws_caller_identity.current.account_id}-${var.aws_region}",
  )
}
