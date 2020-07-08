<template>
  <div class="page">
    <div class="row justify-center">
      <h6>Parties</h6>
    </div>
    <div class="row justify-center">
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
            {{ party.host.userName }}'s party
          </div>
          <q-card class="party-card"
           @click="$emit('switchTab', 'party', party.id)"
            bordered
          >
            <q-img
              class="cover"
              v-if="party.currentlyPlaying"
              :src="party.currentlyPlaying.coverUri"
            >
            </q-img>
            <div v-else>
              <q-card-section class="row justify-center">
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
  methods: {}
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
</style>
