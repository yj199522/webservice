packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_access_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "subnet_id" {
  type      = string
  default   = ""
  sensitive = true
}

variable "aws_regions" {
  type      = string
  default   = env("AWS_REGION")
  sensitive = true
}

variable "aws_secret_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "instance_type" {
  type      = string
  default   = ""
  sensitive = true
}

variable "ssh_name" {
  type      = string
  default   = ""
  sensitive = true
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "nodeApi" {
  access_key    = "${var.aws_access_key}"
  secret_key    = "${var.aws_secret_key}"
  region        = "${var.aws_regions}"
  instance_type = "${var.instance_type}"
  subnet_id     = "${var.subnet_id}"
  skip_region_valiation = "false"
  source_ami_filter {
    filters = {
      name                = "amzn2-ami-hvm-2.*.1-x86_64-gp2"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  ssh_username    = "${var.ssh_name}"
  ami_name        = "nodeApi-app-${local.timestamp}"
  ami_description = "Amazon Linux AMI for CSYE 6225"
}

build {
  sources = [
    "source.amazon-ebs.nodeApi"
  ]

  provisioner "file" {
    source      = "/home/runner/work/webservice/webservice/codedeploy_artifact/nodeApi.zip"
    destination = "/home/ec2-user/nodeApi.zip"
  }

  provisioner "file" {
    source      = "./nodeApi.service"
    destination = "/tmp/nodeApi.service"
  }

  provisioner "shell" {
    script = "./postgres.sh"
  }

  provisioner "shell" {
    script = "./app.sh"
  }

}