# Single compute for scrapping-samai: this EC2 runs FastAPI and Chrome.
# Clients hit the instance Elastic IP on port 8000. Do not add ALB, NLB,
# API Gateway, or a second instance in front of this service.

resource "random_password" "scraper_token" {
  length  = 48
  special = false
}

resource "aws_secretsmanager_secret" "scraper_token" {
  name                    = local.scraper_token_secret_name
  description             = "Bearer token for the scrapping-samai HTTP API."
  recovery_window_in_days = 30

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = local.scraper_token_secret_name
    },
  )
}

resource "aws_secretsmanager_secret_version" "scraper_token" {
  secret_id     = aws_secretsmanager_secret.scraper_token.id
  secret_string = random_password.scraper_token.result
}

data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

resource "aws_vpc" "scraper" {
  cidr_block           = "10.80.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = "${local.scraper_function_name}-vpc"
    },
  )
}

resource "aws_internet_gateway" "scraper" {
  vpc_id = aws_vpc.scraper.id

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = "${local.scraper_function_name}-igw"
    },
  )
}

resource "aws_subnet" "scraper_public" {
  vpc_id                  = aws_vpc.scraper.id
  cidr_block              = "10.80.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[0]

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = "${local.scraper_function_name}-public"
    },
  )
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_route_table" "scraper_public" {
  vpc_id = aws_vpc.scraper.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.scraper.id
  }

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = "${local.scraper_function_name}-public-rt"
    },
  )
}

resource "aws_route_table_association" "scraper_public" {
  subnet_id      = aws_subnet.scraper_public.id
  route_table_id = aws_route_table.scraper_public.id
}

resource "aws_security_group" "scraper" {
  name        = "${local.scraper_function_name}-sg"
  description = "HTTP API and optional SSH for scrapping-samai."
  vpc_id      = aws_vpc.scraper.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = "${local.scraper_function_name}-sg"
    },
  )
}

resource "aws_vpc_security_group_ingress_rule" "scraper_http" {
  for_each = toset(var.scraper_http_cidr_blocks)

  security_group_id = aws_security_group.scraper.id
  description       = "Scraper HTTP API"
  ip_protocol       = "tcp"
  from_port         = 8000
  to_port           = 8000
  cidr_ipv4         = each.value
}

resource "aws_vpc_security_group_ingress_rule" "scraper_ssh" {
  for_each = toset(var.scraper_ssh_cidr_blocks)

  security_group_id = aws_security_group.scraper.id
  description       = "SSH"
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
  cidr_ipv4         = each.value
}

data "aws_iam_policy_document" "scraper_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "scraper" {
  name               = "${local.scraper_function_name}-ec2"
  assume_role_policy = data.aws_iam_policy_document.scraper_assume_role.json

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
    },
  )
}

data "aws_iam_policy_document" "scraper" {
  statement {
    sid    = "ReadSecrets"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      aws_secretsmanager_secret.postgres.arn,
      aws_secretsmanager_secret.scraper_token.arn,
    ]
  }

  statement {
    sid    = "WriteLegalDocuments"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.legal_documents.arn,
      "${aws_s3_bucket.legal_documents.arn}/*",
    ]
  }

  statement {
    sid    = "PullEcr"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "PullScraperImage"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
    ]
    resources = [aws_ecr_repository.scraper.arn]
  }
}

resource "aws_iam_role_policy" "scraper" {
  name   = "${local.scraper_function_name}-ec2"
  role   = aws_iam_role.scraper.id
  policy = data.aws_iam_policy_document.scraper.json
}

resource "aws_iam_instance_profile" "scraper" {
  name = "${local.scraper_function_name}-ec2"
  role = aws_iam_role.scraper.name
}

resource "aws_instance" "scraper" {
  # Only VM that exposes the scraper HTTP API.
  ami                         = data.aws_ami.al2023.id
  instance_type               = var.scraper_instance_type
  subnet_id                   = aws_subnet.scraper_public.id
  vpc_security_group_ids      = [aws_security_group.scraper.id]
  iam_instance_profile        = aws_iam_instance_profile.scraper.name
  associate_public_ip_address = true
  key_name                    = var.scraper_key_name

  user_data = templatefile("${path.module}/templates/scraper_userdata.sh.tftpl", {
    aws_region               = var.aws_region
    repository_url           = aws_ecr_repository.scraper.repository_url
    image_tag                = var.scraper_image_tag
    registry                 = split("/", aws_ecr_repository.scraper.repository_url)[0]
    postgres_secret_arn      = aws_secretsmanager_secret.postgres.arn
    scraper_token_secret_arn = aws_secretsmanager_secret.scraper_token.arn
    s3_bucket                = aws_s3_bucket.legal_documents.bucket
  })

  user_data_replace_on_change = true

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = local.scraper_function_name
    },
  )
}

resource "aws_eip" "scraper" {
  domain   = "vpc"
  instance = aws_instance.scraper.id # public HTTP IP of this VM, not a load balancer

  tags = merge(
    local.common_tags,
    {
      Component = "scrapping-samai"
      Name      = "${local.scraper_function_name}-eip"
    },
  )
}
