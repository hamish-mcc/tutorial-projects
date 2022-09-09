#!bin/bash
echo "Version 1 (Deprecated)"
curl -X POST http://localhost:8501/v1/models/animals/versions/2:predict \
    -d @./dog_example.json \
    -H "Content-Type: application/json"
echo "\n"
echo "Version 2 (Stable)"
curl -X POST http://localhost:8501/v1/models/animals/labels/stable:predict \
    -d @./dog_example.json \
    -H "Content-Type: application/json"