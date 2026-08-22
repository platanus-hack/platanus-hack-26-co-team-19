data "aws_iam_policy_document" "step_function_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ocr_step_function" {
  name               = "${local.name_prefix}-ocr-step-function"
  assume_role_policy = data.aws_iam_policy_document.step_function_assume_role.json

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-step-function"
    },
  )
}

data "aws_iam_policy_document" "ocr_step_function_invoke_lambdas" {
  statement {
    effect = "Allow"
    actions = [
      "lambda:InvokeFunction",
    ]
    resources = [
      aws_lambda_function.ocr_job_reader.arn,
      aws_lambda_function.ocr_document_processor.arn,
    ]
  }
}

resource "aws_iam_role_policy" "ocr_step_function_invoke_lambdas" {
  name   = "${local.name_prefix}-ocr-invoke-lambdas"
  role   = aws_iam_role.ocr_step_function.id
  policy = data.aws_iam_policy_document.ocr_step_function_invoke_lambdas.json
}

data "aws_iam_policy_document" "ocr_step_function_logs" {
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

resource "aws_iam_role_policy" "ocr_step_function_logs" {
  name   = "${local.name_prefix}-ocr-step-function-logs"
  role   = aws_iam_role.ocr_step_function.id
  policy = data.aws_iam_policy_document.ocr_step_function_logs.json
}
