#!bin/sh

for DATA in 0 1 2
do
    curl -X POST http://localhost:8000/predict/batch \
        -d @./data/batch_$DATA.json \
        -H "Content-Type: application/json"

    echo ""
done