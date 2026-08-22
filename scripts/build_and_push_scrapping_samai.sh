#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${1:-scraper-v1}"
AWS_REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"

REPOSITORY_URL="$(terraform -chdir=terraform/main output -raw scraper_ecr_repository_url)"
REGISTRY="${REPOSITORY_URL%%/*}"

aws ecr get-login-password --region "${AWS_REGION}" \
  | docker login --username AWS --password-stdin "${REGISTRY}"

docker buildx build \
  --platform linux/amd64 \
  --tag "${REPOSITORY_URL}:${IMAGE_TAG}" \
  --push \
  services/scrapping-samai

printf 'Pushed scrapping-samai image: %s:%s\n' "${REPOSITORY_URL}" "${IMAGE_TAG}"
