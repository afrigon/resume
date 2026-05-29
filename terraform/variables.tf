variable "region" {
  type        = string
  description = "The target aws region"
  default     = "us-east-1"
}

variable "domain" {
  type        = string
  description = "The target domain the site will be deployed to"
  default     = "alexandre.frigon.app"
}

variable "zone" {
  type        = string
  description = "The target zone to add records to"
  default     = "frigon.app"
}
