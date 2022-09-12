from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel
import uvicorn
import json
import app.consumers as consumers
from dotenv import load_dotenv
import os

load_dotenv()

FRONTEND_URL = os.getenv('FRONTEND_URL', default='http://localhost:3000')
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
REDIS_USER = os.getenv('REDIS_USER')
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')

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
    state = build_state(pk)
    return state


def build_state(pk: str):
    pks = Event.all_pks()
    all_events = [Event.get(pk) for pk in pks]
    events = [event for event in all_events if event.delivery_id == pk]
    state = {}
    for event in events:
        state = consumers.CONSUMERS[event.type](state, event)
    redis.set(f'delivery:{pk}', json.dumps(state))
    return state


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


@app.post('/event')
async def dispatch(request: Request):
    body = await request.json()
    delivery_id = body['delivery_id']
    event = Event(
        delivery_id=delivery_id,
        type=body['type'],
        data=json.dumps(body['data'])
    ).save()
    state = await get_state(delivery_id)
    new_state = consumers.CONSUMERS[event.type](state, event)
    redis.set(f'delivery:{delivery_id}', json.dumps(new_state))
    return new_state


def start():
    """Launched with `poetry run server` at root level"""
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
