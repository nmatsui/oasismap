#/bin/bash

TOKEN=$(curl -s -d "client_id=admin-cli" \
     -d "username=${TF_VAR_keycloak_admin}" \
     -d "password=${TF_VAR_keycloak_admin_password}" \
     -d "grant_type=password" \
     "${TF_VAR_keycloak_url}/realms/master/protocol/openid-connect/token" \
     | jq -r '.access_token')

if [ "${TOKEN}" == "null" ] || [ -z "${TOKEN}" ]; then
    echo "Error: アクセストークンの取得に失敗しました。認証情報を確認してください。"
    exit 1
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer ${TOKEN}" \
    "${TF_VAR_keycloak_url}/admin/realms/${TF_VAR_keycloak_realm_name}")

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Realm '${TF_VAR_keycloak_realm_name}' が見つかりました。削除を実行します..."
    
    DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
        -H "Authorization: Bearer ${TOKEN}" \
        "${TF_VAR_keycloak_url}/admin/realms/${TF_VAR_keycloak_realm_name}")
    
    if [ "${DELETE_STATUS}" -eq 204 ]; then
        echo "削除に成功しました。"
    else
        echo "Error: 削除に失敗しました (HTTP Status: ${DELETE_STATUS})"
        exit 1
    fi
else
    echo "Realm '${TF_VAR_keycloak_realm_name}' は存在しません。削除をスキップします。"
fi

echo "terraformを用いてkeycloakの設定を行います。"
/usr/local/bin/terraform init && /usr/local/bin/terraform apply -auto-approve
