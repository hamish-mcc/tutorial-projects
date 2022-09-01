#!bin/sh

for DATA in 0 1 2
do
    curl -X POST http://localhost:8000/predict \
        -d @./data/$DATA.json \
        -H "Content-Type: application/json"

    echo ""
done

# curl -X 'POST' http://localhost:8000/predict \
#   -H 'Content-Type: application/json' \
#   -d '{
#   "alcohol":12.6,
#   "malic_acid":1.34,
#   "ash":1.9,
#   "alcalinity_of_ash":18.5,
#   "magnesium":88.0,
#   "total_phenols":1.45,
#   "flavanoids":1.36,
#   "nonflavanoid_phenols":0.29,
#   "proanthocyanins":1.35,
#   "color_intensity":2.45,
#   "hue":1.04,
#   "od280_od315_of_diluted_wines":2.77,
#   "proline":562.0
# }'