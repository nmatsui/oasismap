# app 層の出力（ドキュメントとアプリ設定用の URL、FQDN）。

output "app_frontend_fqdn" {
  description = "Frontend App Service default hostname (for AGW backend)."
  value       = azurerm_linux_web_app.frontend.default_hostname
}

output "app_backend_fqdn" {
  description = "Backend App Service default hostname (for AGW backend)."
  value       = azurerm_linux_web_app.backend.default_hostname
}

output "app_keycloak_fqdn" {
  description = "Keycloak App Service default hostname (for AGW backend)."
  value       = azurerm_linux_web_app.keycloak.default_hostname
}

# ACME で取得した AGW 用証明書の Key Vault secret ID（AGW の ssl_certificate.key_vault_secret_id に指定する）
output "agw_ssl_certificate_versionless_secret_id" {
  description = "Key Vault certificate secret ID for Application Gateway HTTPS listener (versionless)."
  value       = azurerm_key_vault_certificate.agw_ssl.versionless_secret_id
  sensitive   = true
}

output "root_url" {
  description = "Root URL (https://root_domain_name) for NEXTAUTH_URL etc."
  value       = "https://${data.terraform_remote_state.platform.outputs.root_domain_name}"
}

output "backend_url" {
  description = "Backend URL for app settings."
  value       = "https://backend.${data.terraform_remote_state.platform.outputs.root_domain_name}"
}

output "keycloak_url" {
  description = "Keycloak URL for KC_HOSTNAME_URL etc."
  value       = "https://keycloak.${data.terraform_remote_state.platform.outputs.root_domain_name}"
}

output "key_vault_id" {
  description = "Key Vault ID (for keycloak-realm layer to read client secrets)."
  value       = data.azurerm_key_vault.main.id
}
