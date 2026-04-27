data "azurerm_log_analytics_workspace" "main" {
  name                = data.terraform_remote_state.platform.outputs.log_analytics_workspace_name
  resource_group_name = local.resource_group_name
}
