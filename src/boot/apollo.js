import { apolloClient } from 'src/utils/apollo'
import VueApollo from 'vue-apollo'

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
