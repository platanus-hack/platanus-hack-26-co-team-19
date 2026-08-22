# ECR repositories for the judge profile Lambda container images.

locals {
  judge_ecr_repositories = {
    profile_reader    = "judge-profile-reader"
    profile_processor = "judge-profile-processor"
  }
}

resource "aws_ecr_repository" "judge" {
  for_each = local.judge_ecr_repositories

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

resource "aws_ecr_lifecycle_policy" "judge" {
  for_each = aws_ecr_repository.judge

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

data "aws_ecr_image" "judge_profile_reader" {
  repository_name = aws_ecr_repository.judge["profile_reader"].name
  image_tag       = var.judge_profile_reader_image_tag
}

data "aws_ecr_image" "judge_profile_processor" {
  repository_name = aws_ecr_repository.judge["profile_processor"].name
  image_tag       = var.judge_profile_processor_image_tag
}
