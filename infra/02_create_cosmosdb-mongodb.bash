#!/bin/bash

source .env
source 99_common.bash

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/02_cosmosdb-mongodb.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}"

db_account_name=$(az cosmosdb list \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --query "[].{name: name}[0]" \
  --output tsv)

connection_string=$(az cosmosdb keys list \
  --type connection-strings \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${db_account_name}" \
  --query "connectionStrings[?keyKind=='Primary'].connectionString" \
  --output tsv)

if [[ ${connection_string} =~ ^mongodb://([^:]+):([^@]+)@([^/]+)/.*$ ]]; then
  username=${BASH_REMATCH[1]}
  password=${BASH_REMATCH[2]}
  host=${BASH_REMATCH[3]}
else
  echo "ERROR: can't get username, password, host"
fi

sedi s/^MONGOHOST=.*/MONGOHOST=\""${host}"\"/g _env-azure.gen
sedi s/^MONGOUSERNAME=.*/MONGOUSERNAME=\""${username}"\"/g _env-azure.gen
sedi s/^MONGOPASSWORD=.*/MONGOPASSWORD=\""${password}"\"/g _env-azure.gen

echo "Replace the connection parameters to MongoDB in '_env-azure.gen'"
