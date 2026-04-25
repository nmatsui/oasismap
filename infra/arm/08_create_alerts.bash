#!/bin/bash

source .env

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/08_alerts.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}" \
      emailAddress="${ALERT_MAIL_DEST_ADDRESS}"
