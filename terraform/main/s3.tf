data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "legal_documents" {
  bucket        = local.legal_documents_bucket_name
  force_destroy = false

  lifecycle {
    prevent_destroy = true
  }

  tags = merge(
    local.common_tags,
    {
      Component = "legal-documents"
      Name      = local.legal_documents_bucket_name
    },
  )
}

resource "aws_s3_bucket_versioning" "legal_documents" {
  bucket = aws_s3_bucket.legal_documents.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "legal_documents" {
  bucket = aws_s3_bucket.legal_documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "legal_documents" {
  bucket = aws_s3_bucket.legal_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "legal_documents" {
  bucket = aws_s3_bucket.legal_documents.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

data "aws_iam_policy_document" "legal_documents_bucket" {
  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]

    resources = [
      aws_s3_bucket.legal_documents.arn,
      "${aws_s3_bucket.legal_documents.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "legal_documents" {
  bucket = aws_s3_bucket.legal_documents.id
  policy = data.aws_iam_policy_document.legal_documents_bucket.json
}

data "aws_iam_policy_document" "ocr_document_processor_legal_documents_read" {
  statement {
    sid    = "ReadLegalDocuments"
    effect = "Allow"
    actions = [
      "s3:GetObject",
    ]
    resources = ["arn:aws:s3:::platanus-deleype/*"]
  }
}

resource "aws_iam_policy" "ocr_document_processor_legal_documents_read" {
  name        = "${local.name_prefix}-legal-documents-read"
  description = "Allows the OCR document processor to read legal documents."
  policy      = data.aws_iam_policy_document.ocr_document_processor_legal_documents_read.json

  tags = merge(
    local.common_tags,
    {
      Component = "legal-documents"
    },
  )
}

resource "aws_iam_role_policy_attachment" "ocr_document_processor_legal_documents_read" {
  role       = aws_iam_role.ocr_document_processor.name
  policy_arn = aws_iam_policy.ocr_document_processor_legal_documents_read.arn
}
