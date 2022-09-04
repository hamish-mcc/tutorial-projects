# DeepLearning.AI MLOps - Intro to K8s (with Tensorflow Serving)

Working Notes :

- [Tutorial Reference](https://github.com/https-deeplearning-ai/machine-learning-engineering-for-production-public/tree/main/course4/week2-ungraded-labs/C4_W2_Lab_2_Intro_to_Kubernetes)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- Create common directory to mount

        cp -R ./saved_model_half_plus_two_cpu /var/tmp

- Generate YAML for a pod running NGINX

        kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml

- Apply a configmap so the K8s deployment can access the saved model

        kubectl apply -f yaml/configmap.yaml
        kubectl describe cm tfserving-configs

- Create deployment

        kubectl apply -f yaml/deployment.yaml
        kubectl get deploy

- Expose deployment trhough a service

        kubectl apply -f yaml/service.yaml
        kubectl get svc tf-serving-service

- Test the deployment by sending some inference requests (use IP address of K3s server)

        curl -d '{"instances": [1.0, 2.0, 5.0]}' -X POST http://192.168.1.136:30001/v1/models/half_plus_two:predict

- Horizontal pod autoscaler
  - K3s should run the metrics server automatically, check with `kubectl get deployment metrics-server -n kube-system`
  - Create autoscaler with `kubectl apply -f yaml/autoscale.yaml` and check with `kubectl get hpa`

- Stress test
  - Run `sh request.sh`, make sure the script has the correct IP for the K3s instance.
  - Should automatically scale up from 1 to 3 pods

- Teardown with `kubectl delete -f yaml`