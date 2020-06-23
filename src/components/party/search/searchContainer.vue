<template>
  <songSearch
    :options="options"
    @selectSong="selectSong"
    @filterFn="filterFn"
  />
</template>
<script>
import { spotifyApi } from 'src/utils/spotify-api'
import songSearch from './songSearch'
export default {
  name: 'searchContainer',
  props: {
    method: { type: Function }
  },
  components: {
    songSearch
  },
  data () {
    return {
      options: []
    }
  },
  methods: {
    filterFn (val, update, abort) {
      if (val.length < 1) {
        abort()
        return
      }
      update(() => {
        spotifyApi
          .get('/search?q=' + val + '&type=track')
          .then(res => (this.options = res.data.tracks.items))
      })
    },
    selectSong (song) {
      this.$emit('selectSong', song)
    }
  }
}
</script>
