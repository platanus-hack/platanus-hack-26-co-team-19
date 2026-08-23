#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${1:-judge-reader-v1}"
AWS_REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"

REPOSITORY_URL="$(terraform -chdir=terraform/main output -json judge_ecr_repository_urls | python3 -c '
import json
import sys
print(json.load(sys.stdin)["profile_reader"])
')"
REGISTRY="${REPOSITORY_URL%%/*}"

aws ecr get-login-password --region "${AWS_REGION}" \
  | docker login --username AWS --password-stdin "${REGISTRY}"

docker buildx build \
  --platform linux/amd64 \
  --tag "${REPOSITORY_URL}:${IMAGE_TAG}" \
  --push \
  services/judge_profile_reader

printf 'Pushed judge profile reader image: %s:%s\n' "${REPOSITORY_URL}" "${IMAGE_TAG}"
