<template>
  <div>
    <q-tab-panels
      v-if="parties.length > 0"
      v-model='tab'
      animated
      swipeable
      transition-prev='jump-up'
      transition-next='jump-up'
    >
      <q-tab-panel name='parties'>
        <followingParties
          @switchTab='switchTab'
          @startParty='startParty'
          :parties='parties'
        />
      </q-tab-panel>
      <q-tab-panel name='party'>
        <party
          :id="id === null ? parties[0].id : id"
          @switchTab='switchTab'
          @shutDownParty='shutDownParty'
        />
      </q-tab-panel>
    </q-tab-panels>
    <div v-else>
      <div class="row justify-center">
        <q-btn @click="startParty" flat color="primary">Start One!</q-btn>
      </div>
      <div class="row justify-center text-body1">
        None of your friends are hosting parties.
      </div>
    </div>
  </div>
</template>
<script>
import {
  GET_PARTIES_QUERY,
  SHUT_DOWN_PARTY_MUTATION,
  CREATE_PARTY_MUTATION,
  PARTY_CREATED_SUBSCRIPTION,
  PARTY_DELETED_SUBSCRIPTION,
  PARTIES_UPDATED_SUBSCRIPTION
} from 'src/graphql/queries/partyQueries'
import { QTabPanel, QTabPanels } from 'quasar'
import followingParties from 'components/party/view/followingParties'
import createPartyForm from 'src/modals/createPartyForm'
import party from 'src/pages/party/party'
export default {
  name: 'Parties',
  components: {
    followingParties,
    party,
    QTabPanel,
    QTabPanels
  },
  data () {
    return {
      parties: [],
      tab: 'parties',
      joinedParty: false,
      id: null
    }
  },
  apollo: {
    parties: {
      query: GET_PARTIES_QUERY,
      subscribeToMore: [{
        document: PARTY_CREATED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (previousResult.parties.find(party => party.id === subscriptionData.data.partyCreated.id)) {
            return previousResult
          }
          return {
            parties: [
              ...previousResult.parties,
              subscriptionData.data.partyCreated
            ]
          }
        }
      },
      {
        document: PARTY_DELETED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            parties: [
              ...previousResult.parties.filter(party => party.id !== subscriptionData.data.partyDeleted.id)
            ]
          }
        }
      },
      {
        document: PARTIES_UPDATED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        }
      }]
    }
  },
  methods: {
    switchTab (tab, id) {
      if (tab === 'parties') {
        this.tab = tab
      } else {
        this.id = id
        this.tab = tab
      }
    },
    shutDownParty () {
      this.$store.dispatch('shutDownParty')
      this.$apollo.mutate({
        mutation: SHUT_DOWN_PARTY_MUTATION,
        refetchQueries: [{
          query: GET_PARTIES_QUERY
        }],
        update: () => {
          this.tab = 'parties'
          this.id = this.parties.length > 0 ? this.parties[0].id : null
        }
      })
    },
    async startParty () {
      this.$q.dialog({
        component: createPartyForm,
        parent: this
      }).onOk((data) => {
        this.$store.dispatch('startParty')
        this.$apollo.mutate({
          mutation: CREATE_PARTY_MUTATION,
          variables: data,
          refetchQueries: [{
            query: GET_PARTIES_QUERY
          }],
          update: (cache, { data: { createParty } }) => {
            this.id = createParty.party.id
            this.tab = 'party'
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.title {
  display: block;
  margin: auto;
  text-align: center;
}
</style>
