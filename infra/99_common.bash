#!/bin/bash

function sedi(){
    if command sed --version 2>&1 | grep -q GNU; then
        command sed -i "$@"
        return $?
    else
        command sed -i "" "$@"
        return $?
    fi
}

