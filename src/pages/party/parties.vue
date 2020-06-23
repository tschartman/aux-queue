<template>
  <div>
    <q-tab-panels
      v-model='tab'
      animated
      swipeable
      transition-prev='jump-up'
      transition-next='jump-up'
    >
      <q-tab-panel name='parties'>
        <followingParties
          @switchTab='switchTab'
          :parties='parties'
        />
      </q-tab-panel>
      <q-tab-panel name='party'>
        <party
          v-if="parties.length > 0"
          :id="id === null ? parties[0].id : id"
          @switchTab='switchTab'
          @refreshParty='refreshParty'
        />
        <div v-else>
          <div class="row justify-center">
            <q-btn @click="startParty" flat color="primary">Start One!</q-btn>
          </div>
          <div class="row justify-center text-body1">
            None of your friends are hosting parties.
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  GET_PARTIES_QUERY,
  // JOIN_PARTY_MUTATION,
  CREATE_PARTY_MUTATION
} from 'src/graphql/queries/partyQueries'
import { QTabPanel, QTabPanels } from 'quasar'
import followingParties from 'components/party/view/followingParties'
import party from 'src/pages/party/party'
const alerts = [
  {
    color: 'negative',
    message: 'Error occured creating party',
    icon: 'report_problem'
  },
  {
    color: 'negative',
    message: 'Error occured joining party',
    icon: 'report_problem'
  }
]
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
      query: GET_PARTIES_QUERY
    }
  },
  methods: {
    // async joinParty (userName) {
    //   const joinParty = await this.$apollo.mutate({
    //     mutation: JOIN_PARTY_MUTATION,
    //     variables: { userName: userName }
    //   })
    //   if (joinParty.data.joinParty.ok) {
    //     this.joinedParty = true
    //     this.tab = 'party'
    //   } else {
    //     this.$q.notify(alerts[1])
    //   }
    // },
    switchTab (tab, id) {
      if (tab === 'parties') {
        this.tab = tab
      } else {
        this.id = id
        this.tab = tab
      }
    },
    async startParty () {
      const createParty = await this.$apollo.mutate({
        mutation: CREATE_PARTY_MUTATION
      })
      if (createParty.data.createParty.ok) {
        this.tab = 'party'
      } else {
        this.$q.notify(alerts[0])
      }
    },
    refreshParty (id, currentlyPlaying) {
      const parties = Array.from(this.parties)
      const partyIndex = parties.findIndex(p => p.id === id)
      if (partyIndex !== -1) {
        parties[partyIndex].currentlyPlaying = currentlyPlaying
        this.parties = parties
      }
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
