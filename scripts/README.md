# Publicar secretos PostgreSQL

`publish_postgres_secret.py` lee valores desde un `.env` local ignorado por Git y publica una nueva versión de un secreto que Terraform ya creó. No imprime el contenido del secreto ni lo agrega a Terraform state.

## Variables locales requeridas

Agrega estas variables solo a tu `.env` local:

```text
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_SSLMODE=
```

Las credenciales AWS también pueden permanecer en ese archivo; el script las carga sin ejecutar el contenido como código shell.

## Flujo

1. Inicializa el backend remoto y aplica `terraform/main`, que crea el contenedor de Secrets Manager y entrega `postgres_secret_name`.
2. Publica el valor desde tu máquina:

```bash
python3 scripts/publish_postgres_secret.py \
  --secret-id "$(terraform -chdir=terraform/main output -raw postgres_secret_name)" \
  --region us-east-1
```

3. Para validar el archivo sin hacer una llamada AWS, usa `--dry-run`:

```bash
python3 scripts/publish_postgres_secret.py \
  --secret-id placeholder \
  --region us-east-1 \
  --dry-run
```

El script usa `put-secret-value`; por eso no crea secretos fuera de Terraform y falla de forma segura si el recurso todavía no existe.

## Imágenes Docker de las Lambdas OCR

Ambas Lambdas se despliegan como imágenes Linux/x86_64 en ECR. El reader contiene Python, `boto3` y `psycopg`; el procesador añade LiteParse, PDFium y Tesseract. Antes de aplicar Terraform, construye y sube los dos tags. Terraform los resuelve a digests ECR inmutables:

```bash
source .env
bash scripts/build_and_push_ocr_job_reader.sh ocr-reader-v1
bash scripts/build_and_push_ocr_document_processor.sh ocr-processor-v2
terraform -chdir=terraform/main plan \
  -var='ocr_job_reader_image_tag=ocr-reader-v1' \
  -var='ocr_document_processor_image_tag=ocr-processor-v2'
```

No reutilices tags existentes. Usa tags nuevos y pásalos con `-var` cuando actualices cualquiera de las imágenes. El primer cambio desde ZIP a `package_type = "Image"` reemplaza ambas Lambdas existentes.

## Imagen Docker de scrapping-samai

El scraper corre en **una sola EC2** con Elastic IP. FastAPI y Chrome viven en esa máquina; no hay ALB ni otra instancia. Los clientes llaman `http://<eip>:8000` directo. Primero aplica Terraform para crear el repositorio ECR (y esa VM). Luego sube la imagen; el `user-data` de **esa misma** instancia reintenta el `docker pull`.

```bash
source .env
bash scripts/build_and_push_scrapping_samai.sh scraper-v1
terraform -chdir=terraform/main apply \
  -var='scraper_image_tag=scraper-v1'
```

La URL e IP salen en `scraper_http_url` y `scraper_public_ip`. El bearer token está en Secrets Manager (`scraper_token_secret_name`); no se imprime.

```bash
TOKEN="$(aws secretsmanager get-secret-value \
  --secret-id "$(terraform -chdir=terraform/main output -raw scraper_token_secret_name)" \
  --query SecretString --output text)"
curl -s "$(terraform -chdir=terraform/main output -raw scraper_http_url)/health"
curl -s -X POST "$(terraform -chdir=terraform/main output -raw scraper_http_url)/jobs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paginas":10,"desde":1}'
```

## Publicar DeepSeek

Agrega `DEEPSEEK_API_KEY` solo al `.env` local ignorado por Git. Después de aplicar Terraform y crear el contenedor del secreto, publica el valor:

```bash
python3 scripts/publish_deepseek_secret.py \
  --secret-id "$(terraform -chdir=terraform/main output -raw deepseek_secret_name)" \
  --region us-east-1
```
