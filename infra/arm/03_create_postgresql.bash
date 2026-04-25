#!/bin/bash

source .env
source 99_common.bash

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/03_postgresql.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}" \
      adminName="${POSTGRES_USER}" \
      adminPassword="${POSTGRES_PASSWORD}" \
      skuName="${POSTGRES_SKU}" \
      storageSizeGB=${POSTGRES_STORAGE_GB}

fqdn=$(az postgres flexible-server list \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --query "[].fullyQualifiedDomainName" \
  --output tsv)

sedi s/^POSTGREHOST=.*/POSTGREHOST=\""${fqdn}"\"/g _env-azure.gen
sedi s/^POSTGREUSER=.*/POSTGREUSER=\""${POSTGRES_USER}"\"/g _env-azure.gen
sedi s/^POSTGREPASSWORD=.*/POSTGREPASSWORD=\""${POSTGRES_PASSWORD}"\"/g _env-azure.gen

echo "Replace the connection parameters to PostgreSQL in '_env-azure.gen'"
