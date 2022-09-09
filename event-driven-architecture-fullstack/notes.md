# Event-Driven Architecture with React and FastAPI

- [freeCodeCamp Tutorial](https://www.youtube.com/watch?v=NVvIpqmf_Xc)
- [Frontend Reference Code](https://github.com/scalablescripts/react-event-driven)
- [Backend Reference Code](https://github.com/scalablescripts/fast-api-event-driven)

## Backend

- Create a Redis Cloud trial subscription.
    - [Subscription home](https://app.redislabs.com/#/subscriptions/subscription/1840108/bdb)
    - Create a Redis Stack DB
- Install [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) management GUI
    - Connect to the Redis CLoud DB with the public endpoint, user and password from the dashboard.
- Using redos_om
    - HashModel.save() method saves data to Redis JSON DB
    - redis.set() method saves data to cache

**Continue from 1:06.00**