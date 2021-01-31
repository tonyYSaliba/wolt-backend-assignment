# Backend assignment

## Introduction

This is a REST Server built in nodejs and typescript.

This project provides a good Developer Experience by following Software Engineering's best practices as well as some of Devop's best practices.

## Features

* Language - [TypeScript](https://www.typescriptlang.org/)
* REST API - [koa2](http://koajs.com/)
* Graceful Shutdown - [Pattern](https://nemethgergely.com/nodejs-healthcheck-graceful-shutdown/)
* HealthCheck - [Pattern /health](http://microservices.io/patterns/observability/health-check-api.html)
* Database - [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/)
* SQL Database & Migrations - [knex](http://knexjs.org/) + [knex-postgis](https://www.npmjs.com/package/knex-postgis)
* Authentication and Authorization - [JWT](https://github.com/auth0/node-jsonwebtoken)
* Validation - [Joi](https://github.com/hapijs/joi)
* Testing - [Mocha](https://mochajs.org/) [Chai](http://www.chaijs.com/) + [Sinon](http://sinonjs.org/) [Coverage](https://istanbul.js.org/)
* Code Style - [Prettier](https://prettier.io/)
* Git Hooks - [Husky](https://github.com/typicode/husky)
* Containerization - [Docker](https://www.docker.com/)

## Installation & Run

### Running with Docker

``` 
>> npm install
>> docker-compose up
```
* *npm install* - Install dependencies
* *docker-compose up* (compose and run, it also creates the PostgreSQL database and installs the PostGIS extension)

### Running without Docker

``` 
>> npm install
>> npm run build
>> npm run start
```
* *npm install* - Install dependencies
* *npm run build* - Transpile TypeScript code
* *npm run start* - Start application (It needs a PostgreSQL database and the PostGIS extension)

PS: if you want to run the program without docker, you need to install PostgreSQL and PostGIS extension, and you need to configure your database.

You can find the database configuration in the **.env** file.

example:
```
DB_HOST= 127.0.0.1
DB_PORT= 5432
DB_USER= root
DB_PASSWORD= secret
```
`It is recommended that you run the server using Docker.` 

## Usage

1) Run the server (as described above in [Installation & Run](#installation--run))
2) Check for server health using [GET `/health`](#health-endpoints) to see if everything is running smoothly
3) Register a new User using [POST `/api/v1/users/`](#user-endpoints)
4) Sign in using [POST `/api/v1/users/login`](#user-endpoints) and the new registered user
5) Copy the access token and use it in your next calls 
    
    if you're using Postman:
    - click on the Authorization tab and choose type 'API key' 
    - Insert in the field "key": `authorization`, and in the field "value" insert your access token
    - In the field "Add to", pick `Header`
6) Upload restaurants using [POST `/api/v1/restaurants/upload`](#restaurant-endpoints) and the data provided inside [restaurants.json](./restaurants.json) (just copy and paste the data into the body of the request)
7) Test the discovery feature using [GET `/api/v1/restaurants/discovery?lat=60.1709&lon=24.941`](#restaurant-endpoints)

## Other npm commands

* *npm run clean* - Remove dist, node_modules, coverage folders
* *npm run coverage* - Run NYC coverage
* *npm run lint* - Lint the TypeScript code
* *npm run test* - Run unit tests
* *npm run test:integration* - Run integration tests
* *npm run test:all* - Run Unit and Integration tests

## API endpoints

### Health endpoints

- GET `/health`
    - Gets Server's health status
    - example response body:
    ```
    {
        "startTime": "2021-01-31T10:52:35.265Z",
        "upTime": "an hour",
        "isShuttingDown": false
    }
    ```
### User endpoints

- GET `/api/v1/users/me`
    - Gets authenticated user's information
    - requires pre authentication
    - Authorized roles:
      - user
      - admin
  - example response body:
  ```
    {
        "id": 1,
        "email": "user@wolt.com",
        "firstName": "John",
        "lastName": "Doe",
        "created": "2021-01-31T10:53:18.521Z",
        "updated": "2021-01-31T10:53:18.521Z"
    }
    ```
- POST `/api/v1/users/`
    - Registers a new user
    - example request body:
    ```
    {
        "email": "user@wolt.com",
        "password": "password",
        "firstName": "John",
        "lastName": "Doe"
    }
    ```
    - example response body:
    ```
    {
        "id": 1,
        "email": "user@wolt.com",
        "firstName": "John",
        "lastName": "Doe",
        "created": "2021-01-31T10:53:18.521Z",
        "updated": "2021-01-31T10:53:18.521Z"
    }
    ```
- POST `/api/v1/users/login`
    - signs in a user
    - example request body:
    ```
    {
        "email": "user@wolt.com",
        "password": "password"
    }
    ```
    - example response body:
    ```
    {
        "accessToken": "eyJhbGciOiJIUzI1N..."
    }
    ```
- PUT `/api/v1/users/`
    -Updates authenticated user
    - Requires pre authentication
    - Authorized roles:
        - user
        - admin
    - Example request body:
    ```
    {
        "firstName": "Tony",
        "lastName": "Saliba"
    }
    ```
- PUT `/api/v1/users/password`
    - Changes the password of a user
    - Requires pre authentication
    - Authorized roles:
        - user
        - admin
    - Example request body:
    ```
    {
        "oldPassword": "old password",
        "newPassword": "new password"
    }
    ```
- DELETE `/api/v1/users/:id`
    - Deletes a user using its id (Integer)
    - Requires pre authentication
    - Authorized roles:
        - admin

<hr>

### Restaurant endpoints

- GET `/api/v1/restaurants/discovery?lat=latitude&lon=longitude`
    - Gets restaurant's discovery using location (latitude and longitude)
    - requires pre authentication
    - Authorized roles:
      - user
      - admin
  - example response body:
    ```
    {
        "sections": [
            {
                "title": "Popular Restaurants",
                "restaurants": [...10 restaurant objects...]
            },
            {
                "title": "New Restaurants",
                "restaurants": [...10 restaurant objects...]
            },
            {
                "title": "Nearby Restaurants",
                "restaurants": [...10 restaurant objects...]
            }
        ]
    }
    ```
- GET `/api/v1/restaurants/:id`
    - Gets a restaurant using its id (Integer)
    - requires pre authentication
    - Authorized roles:
      - user
      - admin
    - example response body:
    ```
    {
        "id": 1,
        "blurhash": "UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0",
        "location": [
            24.941244,
            60.171987
        ],
        "name": "Ketchup XL",
        "online": false,
        "launch_date": "2020-02-23",
        "popularity": 0.30706741877410304
    }
    ```
- GET `/api/v1/restaurants/`
    - Gets all restaurants
    - requires pre authentication
    - Authorized roles:
      - user
      - admin
    - example response body:
    ```
    [
        {
            "id": 1,
            "blurhash": "UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0",
            "location": [
                24.941244,
                60.171987
            ],
            "name": "Ketchup XL",
            "online": false,
            "launch_date": "2020-02-23",
            "popularity": 0.30706741877410304
        },
        {
            "id": 2,
            "blurhash": "UCO;.s:bO%r_yWXlORbbC?TFvobaVDi_t9nS",
            "location": [
                24.935637,
                60.156621
            ],
            "name": "Tender Lettuce",
            "online": true,
            "launch_date": "2020-02-19",
            "popularity": 0.3919633748546864
        }
    ]
    ```
- POST `/api/v1/restaurants/upload`
    - Uploads multiple restaurants at once 
    - requires pre authentication
    - Authorized roles:
      - user
      - admin
    - example request body:
    ```
    {
        "restaurants": [
            {
                "blurhash": "UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0",
                "launch_date": "2020-02-23",
                "location": [
                    24.941244,
                    60.171987
                ],
                "name": "Ketchup XL",
                "online": false,
                "popularity": 0.30706741877410304
            },
            {
                "blurhash": "UCO;.s:bO%r_yWXlORbbC?TFvobaVDi_t9nS",
                "launch_date": "2020-02-19",
                "location": [
                    24.935637,
                    60.156621
                ],
                "name": "Tender Lettuce",
                "online": true,
                "popularity": 0.3919633748546864
            }
        ]
    }
    ```
- POST `/api/v1/restaurants/`
    - Creates a new restaurants 
    - requires pre authentication
    - Authorized roles:
      - user
      - admin
    - example request body:
    ```
    {
        "blurhash":"UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG",
        "location":[
            24.933257,
            60.171263
        ],
        "name":"Charming",
        "online": true,
        "launch_date":"2020-09-20",
        "popularity":0.665082352909038
    }
    ```
- PUT `/api/v1/restaurants/:id`
    - Updates a restaurant using its id
    - Requires pre authentication
    - Authorized roles:
        - user
        - admin
    - Example request body:
    ```
    {
        "blurhash":"UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG",
        "location":[
            24.933257,
            60.171263
        ],
        "name":"Charming",
        "online": true,
        "launch_date":"2020-09-20",
        "popularity":0.665082352909038
    }
    ```
- DELETE `/api/v1/restaurants/:id`
    - Deletes a restaurant using its id (Integer)
    - Requires pre authentication
    - Authorized roles:
        - user
        - admin
