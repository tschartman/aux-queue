<template>
  <div>
    <div v-if="party" class="row justify-center" q-ma-md>
      <q-btn @click="confirmShutDown" flat color="red">shut down party</q-btn>
    </div>
    <h6 class="title">Top Requested Song</h6>
    <div class="row justify-center items-center">
      <q-img
          v-if="party.queue.length > 0"
          :src="topSong.song.coverUri"
          style="width: 150px"
          :ratio="1"
          basic
          spinner-color="white"
          class="rounded-borders"
      />
    </div>
    <q-tabs v-model="tab" narrow-indicator dense align="justify">
      <q-tab
        class="text-purple"
        name="queue"
        icon="format_list_bulleted"
        label="Queue"
      />
      <q-tab class="text-orange" name="guests" icon="people" label="Guests" />
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="queue">
        <q-scroll-area style="height: 350px;">
          <suggestedSongs
            v-if="party.queue.length > 0"
            :host="true"
            :songs="party.queue"
            @removeAction="removeSong"
            @playAction="playSong"
          />
          <div v-else class="row justify-center text-body1">
            No suggested Songs. Invite more people to your party so that can
            suggest some!
          </div>
        </q-scroll-area>
      </q-tab-panel>
      <q-tab-panel name="guests">
        <q-scroll-area style="height: 400px;">
          <partyUsersList
            v-if="party.guests.length > 0"
            :users="party.guests"
          />
          <div v-else class="row justify-center text-body1">
            No one is in your party. Invite more people to your pary!
          </div>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import { spotifyApi } from 'src/utils/spotify-api'
import {
  QScrollArea,
  QTabs,
  QTab,
  QTabPanel,
  QTabPanels,
  QSeparator
} from 'quasar'
import suggestedSongs from '../songs/suggestedSongs'
import partyUsersList from '../users/partyUsersList'
import { REMOVE_SONG_MUTATION } from 'src/graphql/queries/partyQueries'
const alerts = [
  {
    color: 'negative',
    message: 'Error occured removing song',
    icon: 'report_problem'
  }
]
export default {
  components: {
    suggestedSongs,
    partyUsersList,
    QScrollArea,
    QTabs,
    QTab,
    QTabPanel,
    QTabPanels,
    QSeparator
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data () {
    return {
      tab: 'queue'
    }
  },
  computed: {
    topSong () {
      const queue = Array.from(this.party.queue)
      queue.sort((a, b) => this.score(b) - this.score(a))
      if (this.party.queue.length > 0) {
        return queue[0]
      }
      return null
    }
  },
  methods: {
    score (song) {
      return (
        song.rating.filter(r => r.like).length -
        song.rating.filter(r => !r.like).length
      )
    },
    async removeSong (song) {
      const removeSong = await this.$apollo.mutate({
        mutation: REMOVE_SONG_MUTATION,
        variables: {
          id: song.id
        }
      })
      if (removeSong.data.removeSong.ok) {
        this.$emit('removeSong', song)
      } else {
        this.$q.notify(alerts[0])
      }
    },
    confirmShutDown () {
      this.$q.notify({
        message: 'Are you sure you want to shut down the party?',
        actions: [
          { label: 'Nevermind', color: 'white', handler: () => {} },
          {
            label: 'Shut Down',
            color: 'red',
            handler: () => {
              this.$emit('shutDownParty')
            }
          }
        ]
      })
    },
    playSong (song) {
      this.removeSong(song)
      spotifyApi.put('/me/player/play', { uris: [song.song.songUri] })
    },
    pullRefreshSong (done) {
      this.$emit('refreshSong', this.party.host.userName, done)
      done()
    }
  }
}
</script>
<style scoped>
.title {
  margin: auto;
  text-align: center;
}
</style>
