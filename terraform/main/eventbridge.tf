# EventBridge scheduled rules to trigger both pipelines automatically.

# --- OCR pipeline: daily at 10:00 AM UTC ---

resource "aws_scheduler_schedule" "ocr_pipeline_daily" {
  name        = "${local.name_prefix}-ocr-pipeline-daily"
  description = "Trigger OCR pipeline every day at 10:00 AM UTC"
  group_name  = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(0 10 * * ? *)"
  schedule_expression_timezone = "UTC"

  target {
    arn      = aws_sfn_state_machine.ocr_pipeline.arn
    role_arn = aws_iam_role.eventbridge_scheduler.arn
    input    = jsonencode({})

    retry_policy {
      maximum_event_age_in_seconds = 300
    }
  }
}

# --- Judge profile pipeline: daily at 1:00 PM UTC ---

resource "aws_scheduler_schedule" "judge_profile_pipeline_daily" {
  name        = "${local.name_prefix}-judge-profile-pipeline-daily"
  description = "Trigger judge profile pipeline every day at 1:00 PM UTC"
  group_name  = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(0 13 * * ? *)"
  schedule_expression_timezone = "UTC"

  target {
    arn      = aws_sfn_state_machine.judge_profile_pipeline.arn
    role_arn = aws_iam_role.eventbridge_scheduler.arn
    input    = jsonencode({})

    retry_policy {
      maximum_event_age_in_seconds = 300
    }
  }
}

# --- IAM role for EventBridge Scheduler ---

resource "aws_iam_role" "eventbridge_scheduler" {
  name               = "${local.name_prefix}-eventbridge-scheduler"
  assume_role_policy = data.aws_iam_policy_document.eventbridge_scheduler_assume_role.json

  tags = merge(local.common_tags, { Component = "scheduler" })
}

data "aws_iam_policy_document" "eventbridge_scheduler_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "eventbridge_scheduler_start_executions" {
  statement {
    effect  = "Allow"
    actions = ["states:StartExecution"]
    resources = [
      aws_sfn_state_machine.ocr_pipeline.arn,
      aws_sfn_state_machine.judge_profile_pipeline.arn,
    ]
  }
}

resource "aws_iam_role_policy" "eventbridge_scheduler_start_executions" {
  name   = "${local.name_prefix}-scheduler-start-executions"
  role   = aws_iam_role.eventbridge_scheduler.id
  policy = data.aws_iam_policy_document.eventbridge_scheduler_start_executions.json
}
