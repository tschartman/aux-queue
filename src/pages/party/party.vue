<template>
  <div v-if="party.host">
    <div class="row">
      <q-icon
        class="clickable"
        @click="$emit('switchTab', 'parties')"
        name="navigate_before"
        color="blue"
        size="xl"
      />
      <h5 class="title">{{ party.host.userName }}'s Party</h5>
    </div>
    <partyHostView
      v-if="$store.getters.user.userName === party.host.userName"
      :party="party"
      @shutDownParty="shutDownParty"
      @removeSong="removeSong"
      @refreshSong="refreshSong"
    />
    <partyView
      v-else
      :party="party"
      @joinParty="joinParty"
      @removeSong="removeSong"
      @refreshSong="refreshSong"
      @suggestSong="suggestSong"
      @leaveParty="leaveParty"
      @likeSong="likeSong"
      @dislikeSong="dislikeSong"
    />
  </div>
</template>
<script>
import {
  GET_PARTY_QUERY,
  SUGGEST_SONG_MUTATION,
  LEAVE_PARTY_MUTATION,
  SHUT_DOWN_PARTY_MUTATION,
  REFRESH_CURRENT_SONG,
  RATE_SONG_MUTATION,
  REMOVE_RATING_MUTATION,
  JOIN_PARTY_MUTATION
} from 'src/graphql/queries/partyQueries'
import partyView from 'components/party/view/partyView'
import partyHostView from 'components/party/view/partyHostView'
const alerts = [
  {
    color: 'negative',
    message: 'Error occured during suggesting song',
    icon: 'report_problem'
  },
  {
    color: 'negative',
    message: 'Error occured while leaving party',
    icon: 'report_problem'
  }
]
export default {
  name: 'Party',
  components: {
    partyView,
    partyHostView
  },
  props: {
    method: { type: Function },
    id: String
  },
  data () {
    return {
      party: {},
      queue: []
    }
  },
  apollo: {
    party: {
      query: GET_PARTY_QUERY,
      variables () {
        return {
          id: this.id
        }
      }
    }
  },
  methods: {
    async suggestSong (song) {
      const queue = Array.from(this.party.queue)
      const newSong = {
        id: this.party.id,
        title: song.name,
        artist: song.artists[0].name,
        album: song.album.name,
        coverUri: song.album.images[0].url,
        songUri: song.uri
      }
      if (queue.findIndex(s => s.song.songUri === newSong.songUri) === -1) {
        await this.$apollo.mutate({
          mutation: SUGGEST_SONG_MUTATION,
          variables: { input: newSong },
          refetchQueries: [{
            query: GET_PARTY_QUERY,
            variables: { id: this.id }
          }]
        })
      }
    },
    async refreshSong (userName) {
      const currentSong = await this.$apollo.mutate({
        mutation: REFRESH_CURRENT_SONG,
        variables: { userName: userName }
      })
      if (currentSong.data.refreshCurrentSong.ok) {
        if (this.party) {
          this.party.currentlyPlaying =
            currentSong.data.refreshCurrentSong.currentSong
          this.$emit(
            'refreshParty',
            this.party.id,
            currentSong.data.refreshCurrentSong.currentSong
          )
        }
      }
    },
    removeSong (song) {
      let songs = Array.from(this.party.queue)
      songs = songs.filter(s => s.id !== song.id)
      this.$set(this.party, 'queue', songs)
    },
    async shutDownParty () {
      const shutDownParty = await this.$apollo.mutate({
        mutation: SHUT_DOWN_PARTY_MUTATION
      })
      if (shutDownParty.data.shutDownParty.ok) {
        this.$emit('changeView')
      } else {
        this.$q.notify(alerts[1])
      }
    },
    async leaveParty () {
      const leaveParty = await this.$apollo.mutate({
        mutation: LEAVE_PARTY_MUTATION
      })
      if (leaveParty.data.leaveParty.ok) {
        this.$emit('leaveParty')
      } else {
        this.$q.notify(alerts[1])
      }
    },
    async joinParty () {
      await this.$apollo.mutate({
        mutation: JOIN_PARTY_MUTATION,
        variables: {
          userName: this.party.host.userName
        },
        refetchQueries: [{
          query: GET_PARTY_QUERY,
          variables: { id: this.id }
        }]
      })
    },
    async likeSong (song, like) {
      if (like) {
        this.removeRating(song)
      } else {
        await this.$apollo.mutate({
          mutation: RATE_SONG_MUTATION,
          variables: {
            like: true,
            id: song.id,
            partyId: this.party.id
          },
          refetchQueries: [{
            query: GET_PARTY_QUERY,
            variables: { id: this.id }
          }]
        })
      }
    },
    async dislikeSong (song, dislike) {
      if (dislike) {
        this.removeRating(song)
      } else {
        await this.$apollo.mutate({
          mutation: RATE_SONG_MUTATION,
          variables: {
            like: false,
            id: song.id,
            partyId: this.party.id
          },
          refetchQueries: [{
            query: GET_PARTY_QUERY,
            variables: { id: this.id }
          }]
        })
      }
    },
    async removeRating (song) {
      await this.$apollo.mutate({
        mutation: REMOVE_RATING_MUTATION,
        variables: {
          id: song.id,
          partyId: this.party.id
        },
        refetchQueries: [{
          query: GET_PARTY_QUERY,
          variables: { id: this.id }
        }]
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
.clickable {
  cursor: pointer;
}
</style>
