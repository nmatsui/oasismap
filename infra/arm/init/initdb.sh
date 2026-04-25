#!/bin/bash

# add-column.sqlを実行
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -f /opt/init.sql
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -f /opt/add-column.sql
