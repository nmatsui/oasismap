#!/bin/bash

source .env

az login
az group create --name "${RESOURCE_GROUP_NAME}" --location "${LOCATION}"

resource_group_id=$(az group list --query "[?name=='${RESOURCE_GROUP_NAME}'].id" --output tsv)
group_id=$(az ad group show --group "${GROUP_NAME}" --query "id" --output tsv)
role_id=$(az role definition list --query "[?roleName=='${ROLE_NAME}'].name" --output tsv)
az role assignment create --assignee "${group_id}" \
  --role "${role_id}" \
  --scope "${resource_group_id}"

cp ../_env-azure ./_env-azure.gen
