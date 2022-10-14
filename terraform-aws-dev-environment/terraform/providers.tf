terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region                   = "ap-southeast-2"
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = "vscode"
}