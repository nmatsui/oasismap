terraform {
  required_version = ">= 1.14.5"

  required_providers {
    keycloak = {
      source = "keycloak/keycloak"
      version = "5.7.0"
    }
  }
}

provider "keycloak" {
  url                      = var.keycloak_url
  realm                    = "master"
  client_id                = "admin-cli"
  username                 = var.keycloak_admin
  password                 = var.keycloak_admin_password
}

variable "keycloak_url" {
  description = "Keycloak url."
  type        = string
}

variable "keycloak_admin" {
  description = "admin username for Keycloak."
  type        = string
  sensitive   = true
}

variable "keycloak_admin_password" {
  description = "admin password for Keycloak."
  type        = string
  sensitive   = true
}

