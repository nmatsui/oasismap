#!/bin/bash

source .env

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/04_vm.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}" \
      adminName="${VM_ADMIN}" \
      adminPublicKey="$(cat ${VM_ADMIN_PUBLIC_KEY_PATH})" \
      skuName="${VM_SKU}" \
      osDiskSku="${VM_OSDISK_SKU}"

public_ip=$(az network public-ip show \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${PREFIX}-PublicIP" \
  --query "ipAddress" \
  --output tsv)

echo "SSH Connection string : 'ssh -i <your_private_key_path> ${VM_ADMIN}@${public_ip}"
