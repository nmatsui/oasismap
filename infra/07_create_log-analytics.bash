#!/bin/bash

source .env

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/07_log-analytics.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}"
