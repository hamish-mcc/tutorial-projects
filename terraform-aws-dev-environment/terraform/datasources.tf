data "aws_ami" "server_ami" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*"]
  }
}

resource "aws_key_pair" "dev_auth" {
  key_name   = "devkey"
  public_key = file("~/.ssh/devkey.pub")
}
