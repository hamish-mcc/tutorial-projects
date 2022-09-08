from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel
import uvicorn
import json
import app.consumers as consumers

# TODO refactor to use env variables before pushing to GitHub
FRONTEND_URL = "http://localhost:3000"
REDIS_HOST = "redis-17589.c296.ap-southeast-2-1.ec2.cloud.redislabs.com"
REDIS_PORT = 17589
REDIS_USER = "default"
REDIS_PASSWORD = "hurfGY2mEMi2ANg7G15Be4NKhfYTx7WX"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=['*'],
    allow_headers=['*']
)

redis = get_redis_connection(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    username=REDIS_USER,
    decode_responses=True
)


class Delivery(HashModel):
    budget: int = 0
    notes: str = ""

    class Meta:
        database = redis


class Event(HashModel):
    delivery_id: str = None
    type: str
    data: str

    class Meta:
        database = redis


@app.get('/deliveries/{pk}/status')
async def get_state(pk: str):
    state = redis.get(f'delivery:{pk}')
    if state is not None:
        return json.loads(state)
    return {}


@app.post('/deliveries/create')
async def create(request: Request):
    body = await request.json()

    delivery = Delivery(
        budget=body['data']['budget'],
        notes=body['data']['notes']
    ).save()

    event = Event(
        delivery_id=delivery.pk,
        type=body['type'],
        data=json.dumps(body['data'])
    ).save()

    state = consumers.create_delivery({}, event)
    redis.set(f'delivery:{delivery.pk}', json.dumps(state))
    return state


def start():
    """Launched with `poetry run server` at root level"""
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
