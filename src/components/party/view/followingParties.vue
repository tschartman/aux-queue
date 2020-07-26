<template>
  <div class="page">
    <div class="row justify-center">
      <h6>Parties</h6>
    </div>
    <div v-if="!$store.getters.party" class="row justify-center">
      <q-btn @click="$emit('startParty')" flat color="primary">Start One!</q-btn>
    </div>
    <q-scroll-area style="height: 550px;">
      <div class="row justify-center">
        <div
          class="q-pa-lg"
          v-for="party in parties"
          :key="party.host.userName"
        >
          <div class="row justify-center text-subtitle2">
            {{party.name ? party.name : `${party.host.userName} 's Party` }}
          </div>
          <q-card class="party-card"
           @click="$emit('switchTab', 'party', party.id)"
            bordered
          >
          <div v-if="party.queue.length > 3" class="row">
            <q-img
              class="col-6"
              ratio="1"
              v-for="song in topSong(party.queue)"
              :src="song.song.coverUri"
              v-bind:key="song.song.coverUri"
            />
          </div>
            <q-img
              class="cover"
              v-else-if="party.queue.length < 4 && party.queue.length > 0"
              :src="topSong(party.queue)[0].song.coverUri"
            >
            </q-img>
            <div v-else>
              <q-card-section class="row justify-center icon">
                <q-icon name="album" style="font-size:100px;" />
              </q-card-section>
              <q-card-section class="row justify-center text">
                <div class="row justify-center text-subtitle1">No songs in Queue</div>
              </q-card-section>
            </div>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea, QCard, QImg, QCardSection } from 'quasar'

export default {
  components: {
    QScrollArea,
    QCard,
    QImg,
    QCardSection
  },
  props: {
    parties: { type: Array },
    method: { type: Function }
  },
  data () {
    return {}
  },
  computed: {

  },
  methods: {
    topSong (partyQueue) {
      if (partyQueue.length < 1) {
        return []
      }
      const queue = Array.from(partyQueue)
      queue.sort((a, b) => this.score(b) - this.score(a))
      return queue.length > 3 ? queue.slice(0, 4) : [queue[0]]
    },
    score (song) {
      return (
        song.rating.filter(r => r.like).length -
        song.rating.filter(r => !r.like).length
      )
    }
  }
}
</script>
<style scoped>
h6 {
  margin: 0;
}
.page {
  width: 100%;
  overflow: hidden;
}
.party-card {
  width: 200px;
  height: 200px;
  cursor: pointer;
}
.text {
  padding-bottom: 0;
}
.icon {
  padding-top: 30px;
  padding-bottom: 0px;
}
</style>
