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
  default     = "http://keycloak:8080"
}

variable "keycloak_client_base_url" {
  description = "client base url."
  type        = string
  default     = "http://localhost:3000"
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

variable "keycloak_general_user_client_secret" {
  description = "client secret for general-user-client"
  type        = string
  sensitive   = true
}

variable "keycloak_admin_client_secret" {
  description = "client secret for admin-client"
  type        = string
  sensitive   = true
}

locals {
  general_user_client_secret = var.keycloak_general_user_client_secret
  admin_client_secret = var.keycloak_admin_client_secret
  keycloak_client_base_url = var.keycloak_client_base_url
}
