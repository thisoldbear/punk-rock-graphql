const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

/**
 * Band
 */
const BandType = new GraphQLObjectType({
  name: "Band",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    musicians: {
      type: new GraphQLList(MusicianType),
      resolve({ id }) {
        return axios
          .get(`http://localhost:3000/bands/${id}/musicians`)
          .then(({ data }) => data);
      }
    }
  })
});

/**
 * Musician
 */
const MusicianType = new GraphQLObjectType({
  name: "Musician",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    band: {
      type: BandType,
      // Get the bandId from the musician query data
      // and use it in the request URL
      resolve({ bandId }) {
        return axios
          .get(`http://localhost:3000/bands/${bandId}`)
          .then(({ data }) => data);
      }
    }
  })
});

/**
 * Queries
 */

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    musician: {
      type: MusicianType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, { id }) {
        return axios
          .get(`http://localhost:3000/musicians/${id}`)
          .then(({ data }) => data);
      }
    },
    band: {
      type: BandType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, { id }) {
        return axios
          .get(`http://localhost:3000/bands/${id}`)
          .then(({ data }) => data);
      }
    },
    bands: {
      type: new GraphQLList(BandType),
      resolve() {
        return axios
          .get(`http://localhost:3000/bands`)
          .then(({ data }) => data);
      }
    }
  }
});

/**
 * Mutations
 *
 * Some example mutations to add/edit/delete a musician in GraphiQL
 *
 * More TODO on this.
 *
 * Example add musician mutation query.
 *
 * Adds a new musician and returns the new id from the JSON server.
 *
 * mutation {
 *   addMusician(name: "Glenn Danzig") {
 *     id
 *   }
 * }
 */

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addMusicican: {
      type: MusicianType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }, // Required
        bandId: { type: GraphQLString } // Optional
      },
      resolve(parentValue, { name, bandId }) {
        return axios
          .post("http://localhost:3000/musicians", {
            name,
            bandId
          })
          .then(({ data }) => data);
      }
    },
    editMusician: {
      type: MusicianType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        bandId: { type: GraphQLString }
      },
      resolve(parentValue, {id, ...rest}) {
        return axios
          .patch(`http://localhost:3000/musicians/${id}`, {
            ...rest
          })
          .then(({ data }) => data);
      }
    },
    deleteMusician: {
      type: MusicianType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/musicians/${id}`)
          .then(({ data }) => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
