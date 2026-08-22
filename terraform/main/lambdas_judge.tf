# Lambda functions for the judge profile pipeline.

resource "aws_cloudwatch_log_group" "judge_profile_reader" {
  name              = "/aws/lambda/${local.judge_profile_reader_function_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = merge(local.common_tags, { Component = "judge-profile-reader" })
}

resource "aws_cloudwatch_log_group" "judge_profile_processor" {
  name              = "/aws/lambda/${local.judge_profile_processor_function_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = merge(local.common_tags, { Component = "judge-profile-processor" })
}

resource "aws_lambda_function" "judge_profile_reader" {
  function_name = local.judge_profile_reader_function_name
  description   = "Reads judges from providencias, compares against profiles, returns work list."
  role          = aws_iam_role.judge_profile_reader.arn

  package_type = "Image"
  image_uri    = "${aws_ecr_repository.judge["profile_reader"].repository_url}@${data.aws_ecr_image.judge_profile_reader.image_digest}"

  architectures = ["x86_64"]
  memory_size   = 256
  timeout       = 30

  environment {
    variables = {
      POSTGRES_SECRET_ARN = aws_secretsmanager_secret.postgres.arn
      SERVICE_NAME        = "judge-profile-reader"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.judge_profile_reader,
    aws_iam_role_policy_attachment.judge_profile_reader_basic_execution,
    aws_iam_role_policy_attachment.judge_profile_reader_postgres_secret_read,
  ]

  tags = merge(local.common_tags, { Component = "judge-profile-reader" })
}

resource "aws_lambda_function" "judge_profile_processor" {
  function_name = local.judge_profile_processor_function_name
  description   = "Builds or updates a judge profile using DeepSeek structured extraction."
  role          = aws_iam_role.judge_profile_processor.arn

  package_type = "Image"
  image_uri    = "${aws_ecr_repository.judge["profile_processor"].repository_url}@${data.aws_ecr_image.judge_profile_processor.image_digest}"

  architectures = ["x86_64"]
  memory_size   = 512
  timeout       = 300

  environment {
    variables = {
      DEEPSEEK_MODEL      = var.deepseek_model
      DEEPSEEK_SECRET_ARN = aws_secretsmanager_secret.deepseek.arn
      POSTGRES_SECRET_ARN = aws_secretsmanager_secret.postgres.arn
      SERVICE_NAME        = "judge-profile-processor"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.judge_profile_processor,
    aws_iam_role_policy_attachment.judge_profile_processor_basic_execution,
    aws_iam_role_policy_attachment.judge_profile_processor_postgres_secret_read,
    aws_iam_role_policy_attachment.judge_profile_processor_deepseek_secret_read,
  ]

  tags = merge(local.common_tags, { Component = "judge-profile-processor" })
}
