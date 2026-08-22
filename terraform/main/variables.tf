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

variable "postgres_secret_name" {
  description = "Optional Secrets Manager name for PostgreSQL credentials. The secret value is never supplied to Terraform."
  type        = string
  default     = null
  nullable    = true
}

variable "legal_documents_bucket_name" {
  description = "Optional globally unique S3 bucket name for private legal documents. When null, it is derived from project, environment, account ID, and region."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition     = var.legal_documents_bucket_name == null || can(regex("^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$", var.legal_documents_bucket_name))
    error_message = "legal_documents_bucket_name must be a valid 3-63 character lowercase S3 bucket name."
  }
}

variable "lambda_packaging_python" {
  description = "Python interpreter with pip used to build Lambda dependency packages. Override it when /usr/local/bin/python3 is unavailable."
  type        = string
  default     = "/usr/local/bin/python3"
}

variable "deepseek_secret_name" {
  description = "Optional Secrets Manager name for the DeepSeek API key. The key is never supplied to Terraform."
  type        = string
  default     = null
  nullable    = true
}

variable "deepseek_model" {
  description = "DeepSeek model used for structured providencia extraction."
  type        = string
  default     = "deepseek-v4-flash"
}

variable "providencia_complete_status" {
  description = "Status stored after the OCR processor validates and persists a providencia."
  type        = string
  default     = "COMPLETE"
}


variable "ocr_job_reader_image_tag" {
  description = "Immutable ECR image tag to deploy for the OCR job-reader container image."
  type        = string
  default     = "ocr-reader-v1"
}
variable "ocr_document_processor_image_tag" {
  description = "Immutable ECR image tag to deploy once the OCR processor moves to a container image."
  type        = string
  default     = "ocr-processor-v2"
}
