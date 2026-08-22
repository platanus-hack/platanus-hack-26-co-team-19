output "ocr_job_reader_lambda_arn" {
  description = "ARN of the Lambda that will discover pending OCR jobs."
  value       = aws_lambda_function.ocr_job_reader.arn
}

output "ocr_document_processor_lambda_arn" {
  description = "ARN of the Lambda that will process individual OCR jobs."
  value       = aws_lambda_function.ocr_document_processor.arn
}

output "ocr_step_function_arn" {
  description = "ARN of the OCR Step Functions state machine."
  value       = aws_sfn_state_machine.ocr_pipeline.arn
}

output "ocr_ecr_repository_urls" {
  description = "ECR repositories used by the OCR Lambda container images."
  value = {
    for name, repository in aws_ecr_repository.ocr : name => repository.repository_url
  }
}

output "ocr_job_reader_image_uri" {
  description = "Immutable ECR image URI selected for the OCR job-reader."
  value       = "${aws_ecr_repository.ocr["job_reader"].repository_url}@${data.aws_ecr_image.ocr_job_reader.image_digest}"
}

output "postgres_secret_arn" {
  description = "ARN of the Secrets Manager secret containing PostgreSQL settings."
  value       = aws_secretsmanager_secret.postgres.arn
}

output "postgres_secret_name" {
  description = "Name of the PostgreSQL secret to use with the local publisher."
  value       = aws_secretsmanager_secret.postgres.name
}

output "legal_documents_bucket_name" {
  description = "Name of the private S3 bucket for legal documents."
  value       = aws_s3_bucket.legal_documents.bucket
}

output "legal_documents_bucket_arn" {
  description = "ARN of the private S3 bucket for legal documents."
  value       = aws_s3_bucket.legal_documents.arn
}

output "deepseek_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the DeepSeek API key."
  value       = aws_secretsmanager_secret.deepseek.arn
}

output "deepseek_secret_name" {
  description = "Name of the DeepSeek secret to use with the local publisher."
  value       = aws_secretsmanager_secret.deepseek.name
}

output "ocr_document_processor_image_uri" {
  description = "Immutable ECR image URI selected for the native LiteParse OCR processor."
  value       = "${aws_ecr_repository.ocr["document_processor"].repository_url}@${data.aws_ecr_image.ocr_document_processor.image_digest}"
}
