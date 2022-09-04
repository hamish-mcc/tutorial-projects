cp -R ./saved_model_half_plus_two_cpu /var/tmp

kubectl apply -f yaml/configmap.yaml
kubectl apply -f yaml/deployment.yaml
kubectl apply -f yaml/service.yaml
kubectl apply -f yaml/autoscale.yaml