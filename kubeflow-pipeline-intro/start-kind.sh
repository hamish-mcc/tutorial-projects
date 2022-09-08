#!/bin/bash
# Ensure GOPATH environment variable is set (probably ~/go) and added to PATH
go install sigs.k8s.io/kind@v0.15.0
kind create cluster --image=kindest/node:v1.19.16