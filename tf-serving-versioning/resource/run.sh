#!bin/bash
docker run -t --rm  -p 8501:8501 \
--mount type=bind,source="$(pwd)/models",target=/models/ tensorflow/serving \
--model_config_file=/models/models.config \
--model_config_file_poll_wait_seconds=60 \
--allow_version_labels_for_unavailable_models=true