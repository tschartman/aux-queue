import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import Store from 'src/store/index'

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql/'
  // 'https://auxstack.herokuapp.com/graphql/'
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8000/graphql/',
  options: {
    reconnect: true
  }
})

// Create a new Middleware Link using setContext
const middlewareLink = setContext(() => ({
  headers: {
    Authorization: 'JWT ' + Store.getters.token
  }
}))

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  middlewareLink.concat(httpLink)
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  },
  connectToDevTools: true
})
