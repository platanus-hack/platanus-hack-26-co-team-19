# ECR repositories for the OCR Lambda container images.

locals {
  ocr_ecr_repositories = {
    job_reader         = "ocr-job-reader"
    document_processor = "ocr-document-processor"
  }
}

resource "aws_ecr_repository" "ocr" {
  for_each = local.ocr_ecr_repositories

  name                 = "${local.name_prefix}-${each.value}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(
    local.common_tags,
    {
      Component = each.key
      Name      = "${local.name_prefix}-${each.value}"
    },
  )
}

resource "aws_ecr_lifecycle_policy" "ocr" {
  for_each = aws_ecr_repository.ocr

  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep the last 3 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 3
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_repository" "scraper" {
  name                 = local.scraper_function_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = local.scraper_function_name
    },
  )
}

resource "aws_ecr_lifecycle_policy" "scraper" {
  repository = aws_ecr_repository.scraper.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep the last 3 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 3
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

data "aws_ecr_image" "ocr_job_reader" {
  repository_name = aws_ecr_repository.ocr["job_reader"].name
  image_tag       = var.ocr_job_reader_image_tag
}

data "aws_ecr_image" "ocr_document_processor" {
  repository_name = aws_ecr_repository.ocr["document_processor"].name
  image_tag       = var.ocr_document_processor_image_tag
}
