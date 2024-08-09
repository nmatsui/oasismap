#!/bin/bash

source .env

custom_data=$(cat << '__EOS__'
#!/bin/bash

echo "@@@ custom_data start @@@"
while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 ; do
  echo "Waiting for other apt-get instances to exit"
  sleep 1
done
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl jq
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
echo "@@@ custom_data end @@@"
__EOS__
)

az deployment group create \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --template-file ./templates/04_vm.template.json \
  --parameters \
      location="${LOCATION}" \
      prefix="${PREFIX}" \
      adminName="${VM_ADMIN}" \
      adminPublicKey="$(cat ${VM_ADMIN_PUBLIC_KEY_PATH})" \
      skuName="${VM_SKU}" \
      osDiskSku="${VM_OSDISK_SKU}" \
      customData="${custom_data}"

public_ip=$(az network public-ip show \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${PREFIX}-VMIP" \
  --query "ipAddress" \
  --output tsv)

echo "SSH Connection string : 'ssh -i <your_private_key_path> ${VM_ADMIN}@${public_ip}"
