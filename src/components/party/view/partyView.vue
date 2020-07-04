<template>
  <div>
    <div class="row justify-center">
      <p v-if="findGuest && findGuest.status === 1" class="text-overline title">Requests Remaining: {{ songRequests }}</p>
      <p v-else-if="findGuest && findGuest.status === 0" class="text-overline title">Pending</p>
      <q-btn v-else @click="joinParty" flat color="primary">Join Party</q-btn>
    </div>
    <div class="q-pa-md" v-if="findGuest && findGuest.status === 1">
      <searchContainer @selectSong="suggestSong" />
    </div>
    <q-pull-to-refresh @refresh="pullRefreshSong">
      <currentPlayback
        :currentlyPlaying="party.currentlyPlaying"
        :controller="false"
      />
    </q-pull-to-refresh>
    <q-scroll-area style="height: 300px;">
      <suggestedSongs
        v-if="party.queue.length > 0"
        :host="false"
        @likeAction="likeSong"
        @dislikeAction="dislikeSong"
        :songs="party.queue"
      />
      <div v-else class="row justify-center text-body1">
        No suggested Songs
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea, QPullToRefresh } from 'quasar'
import suggestedSongs from '../songs/suggestedSongs'
import currentPlayback from '../playback/currentPlayback'
import searchContainer from '../search/searchContainer'

const alerts = [
  {
    color: 'negative',
    message: 'Error occured during rating',
    icon: 'report_problem'
  },
  {
    color: 'negative',
    message: 'You are out out song requests',
    icon: 'report_problem'
  },
  {
    color: 'negative',
    message: 'Error joining party',
    icon: 'report_problem'
  }
]
export default {
  components: {
    suggestedSongs,
    currentPlayback,
    QScrollArea,
    searchContainer,
    QPullToRefresh
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data () {
    return {}
  },
  computed: {
    songRequests () {
      const guest = this.findGuest
      return guest ? guest.allowedRequests - guest.amountRequested : null
    },
    findGuest () {
      return this.party.guests.find(
        g => g.user.userName === this.$store.getters.user.userName
      )
    }
  },
  methods: {
    likeSong (song, like) {
      this.$emit('likeSong', song, like)
    },
    dislikeSong (song, dislike) {
      this.$emit('dislikeSong', song, dislike)
    },
    suggestSong (song) {
      if (this.songRequests > 0) {
        this.$emit('suggestSong', song)
      } else {
        this.$q.notify(alerts[1])
      }
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
