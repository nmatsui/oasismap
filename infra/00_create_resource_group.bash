#!/bin/bash

source .env

az login
az group create --name ${RESOURCE_GROUP_NAME} --location ${LOCATION}
