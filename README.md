## punk-rock-graphql

Example [GraphQL](https://github.com/graphql) app using [Express](https://github.com/expressjs/express) and [JSON Server](https://github.com/typicode/json-server) to serve and store band and musician data from a RESTful API.

## Installation

`npm install`

## Run

### Start the Node server

`node run dev`

Starts a server running at http://localhost:4000

### Start the JSON server

`npm run json:server`

Starts a server running at http://localhost:3000

## GraphiQL

Queries can be made using the [GraphiQL](https://github.com/graphql/graphiql) in-browser IDE.

FIrstly, start the Node server and the JSON server respectively.

Then head to http://localhost:4000/graphql to run queries using GraphiQL.

### Example Queries

#### Get musicians in the Circle Jerks

JSON Server URL: http://localhost:3000/bands/2/musicians

##### GraphiQL query:

```
{
  band (id: "2") {
    name
    musicians {
      name
    }
  }
}
```

#### Get musician details of Brian Baker

JSON Server URL: http://localhost:3000/musicians/3

##### GraphiQL query:

```
{
  musician (id: "3") {
    name,
    band {
      name
    }
  }
}
```

#### Get all band names

JSON Server URL: http://localhost:3000/bands

##### GraphiQL query:

```
{
  bands {
    name
  }
}
```

#### Get all bands and respective musicians

JSON Server URL: N/A

The power of GraphQL comes into play here 🤘

With a RESTful API, we'd likely need to make two requests.

The first to get bands and a second to get musicians, before combining the data.

With GraphQL, we can get make the requqst and get back the combined data in one go using nested queries, which make use of bidirectonal relations between Bands and Musicians setup in `schema/schema.js`

##### GraphiQL query

```
{
  bands {
    name,
    musicians {
      name
    }
  }
}
```
