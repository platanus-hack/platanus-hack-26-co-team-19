# The PostgreSQL JSON value is intentionally published outside Terraform by
# scripts/publish_postgres_secret.py. Do not add secret_string to this resource.
resource "aws_secretsmanager_secret" "postgres" {
  name                    = local.postgres_secret_name
  description             = "PostgreSQL connection settings for the OCR pipeline."
  recovery_window_in_days = 30

  lifecycle {
    prevent_destroy = true
  }

  tags = merge(
    local.common_tags,
    {
      Component = "postgres-credentials"
      Name      = local.postgres_secret_name
    },
  )
}
