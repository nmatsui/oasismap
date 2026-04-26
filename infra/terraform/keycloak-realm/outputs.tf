# keycloak-realm 層の出力。

output "realm_id" {
  description = "Keycloak realm id (oasismap)."
  value       = keycloak_realm.oasismap.id
}

output "oidc_google_identity_provider_redirect_uri" {
  description = "OIDC Google identity provider redirect URI."
  value       = "https://keycloak.${data.terraform_remote_state.platform.outputs.root_domain_name}/realms/${keycloak_realm.oasismap.id}/broker/google/endpoint"
}

output "keycloak_url" {
  description = "keycloak url"
  value       = "https://keycloak.${data.terraform_remote_state.platform.outputs.root_domain_name}"
}

output "user_url" {
  description = "url for user"
  value       = "https://${data.terraform_remote_state.platform.outputs.root_domain_name}"
}

output "admin_url" {
  description = "url for admin"
  value       = "https://${data.terraform_remote_state.platform.outputs.root_domain_name}/admin/login"
}
