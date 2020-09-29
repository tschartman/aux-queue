<template>
  <div>
    <div class="row justify-center">
      <p v-if="findGuest && findGuest.status === 1" class="text-overline title">Requests Remaining: {{ songRequests }}</p>
      <p v-else-if="findGuest && findGuest.status === 0" class="text-overline title">Pending</p>
      <p v-else-if="findGuest && findGuest.status === 2" class="text-overline title blocked">Blocked</p>
      <q-btn v-else @click="$emit('joinParty')" flat color="primary">Join Party</q-btn>
    </div>
    <h6 class="title">Top Requested Song</h6>
    <div v-if="party.queue.length > 0" class="row justify-center items-center">
      <q-img
          :src="topSong.song.coverUri"
          style="width: 150px"
          :ratio="1"
          basic
          spinner-color="white"
          class="rounded-borders"
      />
    </div>
    <div class="q-pa-md" v-if="findGuest && findGuest.status === 1">
      <searchContainer @selectSong="suggestSong" />
    </div>
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
import { QScrollArea } from 'quasar'
import suggestedSongs from '../songs/suggestedSongs'
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
    QScrollArea,
    searchContainer
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data () {
    return {}
  },
  computed: {
    topSong () {
      const queue = Array.from(this.party.queue)
      queue.sort((a, b) => this.score(b) - this.score(a))
      if (this.party.queue.length > 0) {
        return queue[0]
      }
      return null
    },
    songRequests () {
      const guest = this.findGuest
      return this.party.limitRequests ? (guest ? guest.allowedRequests - guest.amountRequested : null) : 'Unlimited'
    },
    findGuest () {
      return this.party.guests.find(
        g => g.user.userName === this.$store.getters.user.userName
      )
    }
  },
  methods: {
    score (song) {
      return (
        song.rating.filter(r => r.like).length -
        song.rating.filter(r => !r.like).length
      )
    },
    likeSong (song, like) {
      this.$emit('likeSong', song, like)
    },
    dislikeSong (song, dislike) {
      this.$emit('dislikeSong', song, dislike)
    },
    suggestSong (song) {
      if (!this.party.limitRequests || this.songRequests > 0) {
        this.$emit('suggestSong', song)
      } else {
        this.$q.notify(alerts[1])
      }
    }
  }
}
</script>
<style scoped>
.title {
  margin: auto;
  text-align: center;
}
.blocked {
  color: red;
}
</style>
