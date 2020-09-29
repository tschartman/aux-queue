<template>
  <songSearch
    :options="options"
    @selectSong="selectSong"
    @filterFn="filterFn"
  />
</template>
<script>
import { appApi } from 'src/utils/app-api'

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
    async filterFn (val, update, abort) {
      if (val.length < 1) {
        abort()
        return
      }
      update(async () => {
        const res = await appApi.get('/search/', {
          params: { track: val }
        })
        this.options = res.data.data
        console.log(res.data.data)
      })
    },
    selectSong (song) {
      this.$emit('selectSong', song)
    }
  }
}
</script>
