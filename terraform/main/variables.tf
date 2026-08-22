variable "aws_region" {
  description = "AWS region where the OCR pipeline resources are created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project prefix used in OCR resource names."
  type        = string
  default     = "ocr-pipeline"
}

variable "environment" {
  description = "Deployment environment used in OCR resource names and tags."
  type        = string
  default     = "dev"
}

variable "lambda_runtime" {
  description = "Python runtime used by the placeholder OCR Lambdas."
  type        = string
  default     = "python3.12"
}

variable "lambda_log_retention_days" {
  description = "CloudWatch log retention period for the OCR pipeline."
  type        = number
  default     = 30
}

variable "ocr_job_reader_timeout_seconds" {
  description = "Timeout for the OCR job-reader Lambda."
  type        = number
  default     = 30

  validation {
    condition     = var.ocr_job_reader_timeout_seconds >= 1 && var.ocr_job_reader_timeout_seconds <= 900
    error_message = "The OCR job-reader timeout must be between 1 and 900 seconds."
  }
}

variable "ocr_document_processor_timeout_seconds" {
  description = "Timeout for the OCR document-processor Lambda."
  type        = number
  default     = 300

  validation {
    condition     = var.ocr_document_processor_timeout_seconds >= 1 && var.ocr_document_processor_timeout_seconds <= 900
    error_message = "The OCR document-processor timeout must be between 1 and 900 seconds."
  }
}

variable "ocr_document_processor_memory_size_mb" {
  description = "Memory allocated to the OCR document-processor Lambda."
  type        = number
  default     = 1024

  validation {
    condition     = var.ocr_document_processor_memory_size_mb >= 128 && var.ocr_document_processor_memory_size_mb <= 10240
    error_message = "The OCR document-processor memory must be between 128 and 10240 MB."
  }
}

variable "tags" {
  description = "Additional tags applied to OCR infrastructure resources."
  type        = map(string)
  default     = {}
}
