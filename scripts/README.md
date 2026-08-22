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
