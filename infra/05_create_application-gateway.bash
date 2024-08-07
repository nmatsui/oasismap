#!/bin/bash

source .env

# You have to install 'lego' before executing this script. https://go-acme.github.io/lego/
lego \
  --domains "${ROOT_DOMAIN_NAME}" --domains "keycloak.${ROOT_DOMAIN_NAME}" --domains "backend.${ROOT_DOMAIN_NAME}" \
  --email "${EMAIL}" \
  --dns "azuredns" \
  --accept-tos \
  --path "$(pwd)/cert/lego" \
  run

# You have to install 'openssl' before executing this script.
openssl pkcs12 \
  -export \
  -in "$(pwd)/cert/lego/certificates/${ROOT_DOMAIN_NAME}.crt" \
  -inkey "$(pwd)/cert/lego/certificates/${ROOT_DOMAIN_NAME}.key" \
  -password "pass:${PFX_PASSWORD}" \
  -out "cert/${ROOT_DOMAIN_NAME}.pfx"

vm_private_ip=$(az network nic show \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${PREFIX}-NIC" \
  --query "ipConfigurations[].privateIPAddress" \
  --output tsv)

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/05_application-gateway.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}" \
      certData="$(openssl base64 -in cert/${ROOT_DOMAIN_NAME}.pfx)" \
      certPassword="${PFX_PASSWORD}" \
      rootDomain="${ROOT_DOMAIN_NAME}" \
      backendIpAddress="${vm_private_ip}" \
      agwSku="${AGW_SKU}" \
      minCapacity=${AGW_MIN_CAPACITY} \
      maxCapacity=${AGW_MAX_CAPACITY} \
      wafMode="${WAF_MODE}"

public_ip=$(az network public-ip show \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${PREFIX}-AGWIP" \
  --query "ipAddress" \
  --output tsv)

echo "PublicIP of Application Gateway: ${public_ip}"
