# Step Function for the judge profile pipeline.

resource "aws_cloudwatch_log_group" "judge_profile_pipeline" {
  name              = "/aws/vendedlogs/states/${local.judge_profile_state_machine_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = merge(local.common_tags, { Component = "judge-profile-step-function" })
}

resource "aws_sfn_state_machine" "judge_profile_pipeline" {
  name     = local.judge_profile_state_machine_name
  role_arn = aws_iam_role.judge_profile_step_function.arn
  type     = "STANDARD"

  definition = templatefile("${path.module}/../../services/judge_profile_step_function/definition.json", {
    judge_profile_reader_lambda_arn    = aws_lambda_function.judge_profile_reader.arn
    judge_profile_processor_lambda_arn = aws_lambda_function.judge_profile_processor.arn
  })

  logging_configuration {
    include_execution_data = false
    level                  = "ALL"
    log_destination        = "${aws_cloudwatch_log_group.judge_profile_pipeline.arn}:*"
  }

  depends_on = [
    aws_iam_role_policy.judge_profile_step_function_invoke_lambdas,
    aws_iam_role_policy.judge_profile_step_function_logs,
  ]

  tags = merge(local.common_tags, { Component = "judge-profile-step-function" })
}

resource "aws_iam_role" "judge_profile_step_function" {
  name               = "${local.name_prefix}-judge-profile-step-function"
  assume_role_policy = data.aws_iam_policy_document.step_function_assume_role.json

  tags = merge(local.common_tags, { Component = "judge-profile-step-function" })
}

data "aws_iam_policy_document" "judge_profile_step_function_invoke_lambdas" {
  statement {
    effect  = "Allow"
    actions = ["lambda:InvokeFunction"]
    resources = [
      aws_lambda_function.judge_profile_reader.arn,
      aws_lambda_function.judge_profile_processor.arn,
    ]
  }
}

resource "aws_iam_role_policy" "judge_profile_step_function_invoke_lambdas" {
  name   = "${local.name_prefix}-judge-profile-invoke-lambdas"
  role   = aws_iam_role.judge_profile_step_function.id
  policy = data.aws_iam_policy_document.judge_profile_step_function_invoke_lambdas.json
}

data "aws_iam_policy_document" "judge_profile_step_function_logs" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogDelivery",
      "logs:GetLogDelivery",
      "logs:UpdateLogDelivery",
      "logs:DeleteLogDelivery",
      "logs:ListLogDeliveries",
      "logs:PutResourcePolicy",
      "logs:DescribeResourcePolicies",
      "logs:DescribeLogGroups",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "judge_profile_step_function_logs" {
  name   = "${local.name_prefix}-judge-profile-step-function-logs"
  role   = aws_iam_role.judge_profile_step_function.id
  policy = data.aws_iam_policy_document.judge_profile_step_function_logs.json
}
