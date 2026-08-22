
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
