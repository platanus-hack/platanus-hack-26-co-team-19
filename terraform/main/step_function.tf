resource "aws_cloudwatch_log_group" "ocr_pipeline" {
  name              = "/aws/vendedlogs/states/${local.ocr_state_machine_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-step-function"
    },
  )
}

resource "aws_sfn_state_machine" "ocr_pipeline" {
  name     = local.ocr_state_machine_name
  role_arn = aws_iam_role.ocr_step_function.arn
  type     = "STANDARD"

  definition = templatefile("${path.module}/../../services/ocr_step_function/definition.json", {
    ocr_document_processor_lambda_arn = aws_lambda_function.ocr_document_processor.arn
    ocr_job_reader_lambda_arn         = aws_lambda_function.ocr_job_reader.arn
  })

  logging_configuration {
    include_execution_data = false
    level                  = "ALL"
    log_destination        = "${aws_cloudwatch_log_group.ocr_pipeline.arn}:*"
  }

  depends_on = [
    aws_iam_role_policy.ocr_step_function_invoke_lambdas,
    aws_iam_role_policy.ocr_step_function_logs,
  ]

  tags = merge(
    local.common_tags,
    {
      Component = "ocr-step-function"
    },
  )
}
