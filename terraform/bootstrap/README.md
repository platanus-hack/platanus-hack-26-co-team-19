# Bootstrap del state remoto

Este root se ejecuta una sola vez con state local para crear el backend remoto de `terraform/main`:

- Bucket S3 privado, cifrado con SSE-S3, versionado y sin acceso público.
- Tabla DynamoDB on-demand para evitar `apply` concurrentes.
- Protección contra destrucción accidental de ambos recursos.

## 1. Crear el backend

Desde la raíz del repositorio, carga las credenciales AWS locales y aplica el bootstrap:

```bash
source .env
terraform -chdir=terraform/bootstrap init -input=false
terraform -chdir=terraform/bootstrap plan -out=bootstrap.tfplan
terraform -chdir=terraform/bootstrap apply bootstrap.tfplan
```

El nombre de bucket predeterminado incluye el ID de la cuenta AWS y la región, para ser globalmente único. Si necesitas uno específico, pasa `-var='state_bucket_name=<nombre-unico>'` al `plan` y al `apply`.

## 2. Migrar `terraform/main` al backend remoto

Después de aplicar el bootstrap, ejecuta:

```bash
STATE_BUCKET="$(terraform -chdir=terraform/bootstrap output -raw terraform_state_bucket_name)"
STATE_KEY="$(terraform -chdir=terraform/bootstrap output -raw terraform_state_key)"
STATE_LOCK_TABLE="$(terraform -chdir=terraform/bootstrap output -raw terraform_lock_table_name)"

terraform -chdir=terraform/main init -migrate-state \
  -backend-config="bucket=${STATE_BUCKET}" \
  -backend-config="key=${STATE_KEY}" \
  -backend-config="region=us-east-1" \
  -backend-config="dynamodb_table=${STATE_LOCK_TABLE}" \
  -backend-config="encrypt=true"
```

Terraform pedirá confirmación si encuentra state local que deba copiar al bucket. Después de migrarlo, usa `terraform -chdir=terraform/main plan` y `apply` normalmente.

No guardes access keys, secretos de PostgreSQL ni tokens de DeepSeek en archivos de backend o `.tfvars` versionados.
