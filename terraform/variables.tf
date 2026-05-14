variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.medium"
}

variable "key_name" {
  description = "Name of existing EC2 key pair for SSH access"
  type        = string
  default     = "jenkey"
}

variable "ami_id" {
  description = "Ubuntu 24.04 LTS AMI ID for us-east-1"
  type        = string
  default     = "ami-0c7217cdde317cfec"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "wahaj-devops-ec2"
}

variable "app_port" {
  description = "Port the Next.js app runs on"
  type        = number
  default     = 3000
}
