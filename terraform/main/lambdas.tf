data "archive_file" "ocr_job_reader" {
  type        = "zip"
  source_dir  = "${path.module}/../../services/ocr_job_reader"
  output_path = "${path.module}/.build/ocr-job-reader.zip"
}

data "archive_file" "ocr_document_processor" {
  type        = "zip"
  source_dir  = "${path.module}/../../services/ocr_document_processor"
  output_path = "${path.module}/.build/ocr-document-processor.zip"
}

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
  description   = "Placeholder that will discover pending OCR jobs."
  role          = aws_iam_role.ocr_job_reader.arn

  runtime          = var.lambda_runtime
  handler          = "handler.handler"
  filename         = data.archive_file.ocr_job_reader.output_path
  source_code_hash = data.archive_file.ocr_job_reader.output_base64sha256

  architectures = ["x86_64"]
  memory_size   = 256
  timeout       = var.ocr_job_reader_timeout_seconds

  environment {
    variables = {
      SERVICE_NAME = "ocr-job-reader"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.ocr_job_reader,
    aws_iam_role_policy_attachment.ocr_job_reader_basic_execution,
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
  description   = "Placeholder that will process one OCR document job."
  role          = aws_iam_role.ocr_document_processor.arn

  runtime          = var.lambda_runtime
  handler          = "handler.handler"
  filename         = data.archive_file.ocr_document_processor.output_path
  source_code_hash = data.archive_file.ocr_document_processor.output_base64sha256

  architectures = ["x86_64"]
  memory_size   = var.ocr_document_processor_memory_size_mb
  timeout       = var.ocr_document_processor_timeout_seconds

  environment {
    variables = {
      SERVICE_NAME = "ocr-document-processor"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.ocr_document_processor,
    aws_iam_role_policy_attachment.ocr_document_processor_basic_execution,
  ]

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-document-processor"
    },
  )
}
