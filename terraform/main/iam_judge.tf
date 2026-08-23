# IAM roles and policies for the judge profile pipeline Lambdas.

# --- judge_profile_reader ---

resource "aws_iam_role" "judge_profile_reader" {
  name               = "${local.name_prefix}-judge-profile-reader"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(local.common_tags, { Component = "judge-profile-reader" })
}

resource "aws_iam_role_policy_attachment" "judge_profile_reader_basic_execution" {
  role       = aws_iam_role.judge_profile_reader.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "judge_profile_reader_postgres_secret_read" {
  role       = aws_iam_role.judge_profile_reader.name
  policy_arn = aws_iam_policy.ocr_postgres_secret_read.arn
}

# --- judge_profile_processor ---

resource "aws_iam_role" "judge_profile_processor" {
  name               = "${local.name_prefix}-judge-profile-processor"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(local.common_tags, { Component = "judge-profile-processor" })
}

resource "aws_iam_role_policy_attachment" "judge_profile_processor_basic_execution" {
  role       = aws_iam_role.judge_profile_processor.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "judge_profile_processor_postgres_secret_read" {
  role       = aws_iam_role.judge_profile_processor.name
  policy_arn = aws_iam_policy.ocr_postgres_secret_read.arn
}

resource "aws_iam_role_policy_attachment" "judge_profile_processor_deepseek_secret_read" {
  role       = aws_iam_role.judge_profile_processor.name
  policy_arn = aws_iam_policy.ocr_document_processor_deepseek_secret_read.arn
}
