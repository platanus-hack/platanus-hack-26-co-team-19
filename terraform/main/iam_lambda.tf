
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ocr_job_reader" {
  name               = "${local.name_prefix}-ocr-job-reader"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-job-reader"
    },
  )
}

resource "aws_iam_role_policy_attachment" "ocr_job_reader_basic_execution" {
  role       = aws_iam_role.ocr_job_reader.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "ocr_document_processor" {
  name               = "${local.name_prefix}-ocr-document-processor"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-document-processor"
    },
  )
}

resource "aws_iam_role_policy_attachment" "ocr_document_processor_basic_execution" {
  role       = aws_iam_role.ocr_document_processor.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "ocr_postgres_secret_read" {
  statement {
    sid    = "ReadPostgresSecret"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [aws_secretsmanager_secret.postgres.arn]
  }
}

resource "aws_iam_policy" "ocr_postgres_secret_read" {
  name        = "${local.name_prefix}-postgres-secret-read"
  description = "Allows OCR Lambdas to read their PostgreSQL connection secret."
  policy      = data.aws_iam_policy_document.ocr_postgres_secret_read.json

  tags = merge(
    local.common_tags,
    {
      Component = "postgres-credentials"
    },
  )
}

resource "aws_iam_role_policy_attachment" "ocr_job_reader_postgres_secret_read" {
  role       = aws_iam_role.ocr_job_reader.name
  policy_arn = aws_iam_policy.ocr_postgres_secret_read.arn
}

resource "aws_iam_role_policy_attachment" "ocr_document_processor_postgres_secret_read" {
  role       = aws_iam_role.ocr_document_processor.name
  policy_arn = aws_iam_policy.ocr_postgres_secret_read.arn
}

data "aws_iam_policy_document" "ocr_document_processor_deepseek_secret_read" {
  statement {
    sid    = "ReadDeepSeekSecret"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [aws_secretsmanager_secret.deepseek.arn]
  }
}

resource "aws_iam_policy" "ocr_document_processor_deepseek_secret_read" {
  name        = "${local.name_prefix}-deepseek-secret-read"
  description = "Allows the OCR processor to read its DeepSeek API key."
  policy      = data.aws_iam_policy_document.ocr_document_processor_deepseek_secret_read.json

  tags = merge(
    local.common_tags,
    {
      Component = "deepseek-credentials"
    },
  )
}

resource "aws_iam_role_policy_attachment" "ocr_document_processor_deepseek_secret_read" {
  role       = aws_iam_role.ocr_document_processor.name
  policy_arn = aws_iam_policy.ocr_document_processor_deepseek_secret_read.arn
}
