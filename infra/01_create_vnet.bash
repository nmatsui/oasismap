#!/bin/bash

source .env

az deployment group create \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --template-file ./templates/01_vnet.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}"

