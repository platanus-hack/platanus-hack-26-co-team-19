resource "aws_cloudwatch_log_group" "ocr_job_reader" {
  name              = "/aws/lambda/${local.ocr_job_reader_function_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-job-reader"
    },
  )
}

resource "aws_cloudwatch_log_group" "ocr_document_processor" {
  name              = "/aws/lambda/${local.ocr_document_processor_function_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-document-processor"
    },
  )
}

resource "aws_lambda_function" "ocr_job_reader" {
  function_name = local.ocr_job_reader_function_name
  description   = "Reads incomplete OCR jobs from PostgreSQL."
  role          = aws_iam_role.ocr_job_reader.arn

  package_type = "Image"
  image_uri    = "${aws_ecr_repository.ocr["job_reader"].repository_url}@${data.aws_ecr_image.ocr_job_reader.image_digest}"

  architectures = ["x86_64"]
  memory_size   = 256
  timeout       = var.ocr_job_reader_timeout_seconds

  environment {
    variables = {
      POSTGRES_SECRET_ARN = aws_secretsmanager_secret.postgres.arn
      SERVICE_NAME        = "ocr-job-reader"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.ocr_job_reader,
    aws_iam_role_policy_attachment.ocr_job_reader_basic_execution,
    aws_iam_role_policy_attachment.ocr_job_reader_postgres_secret_read,
  ]

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-job-reader"
    },
  )
}

resource "aws_lambda_function" "ocr_document_processor" {
  function_name = local.ocr_document_processor_function_name
  description   = "Processes legal PDFs with LiteParse OCR and DeepSeek structured extraction."
  role          = aws_iam_role.ocr_document_processor.arn

  package_type = "Image"
  image_uri    = "${aws_ecr_repository.ocr["document_processor"].repository_url}@${data.aws_ecr_image.ocr_document_processor.image_digest}"

  architectures = ["x86_64"]
  memory_size   = var.ocr_document_processor_memory_size_mb
  timeout       = var.ocr_document_processor_timeout_seconds

  environment {
    variables = {
      DEEPSEEK_MODEL              = var.deepseek_model
      DEEPSEEK_SECRET_ARN         = aws_secretsmanager_secret.deepseek.arn
      LEGAL_DOCUMENTS_BUCKET      = aws_s3_bucket.legal_documents.bucket
      OCR_LANGUAGE                = "spa"
      POSTGRES_SECRET_ARN         = aws_secretsmanager_secret.postgres.arn
      PROVIDENCIA_COMPLETE_STATUS = var.providencia_complete_status
      SERVICE_NAME                = "ocr-document-processor"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.ocr_document_processor,
    aws_iam_role_policy_attachment.ocr_document_processor_basic_execution,
    aws_iam_role_policy_attachment.ocr_document_processor_deepseek_secret_read,
    aws_iam_role_policy_attachment.ocr_document_processor_legal_documents_read,
    aws_iam_role_policy_attachment.ocr_document_processor_postgres_secret_read,
  ]

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-document-processor"
    },
  )
}
