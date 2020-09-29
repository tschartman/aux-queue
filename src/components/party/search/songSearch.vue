<template>
  <div>
    <q-select
      rounded
      outlined
      v-model="model"
      label="Search Songs"
      use-input
      hide-selected
      input-debounce="0"
      :options="options"
      @filter="filterFn"
    >
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
          v-on:click="$emit('selectSong', scope.opt)"
          clickable
          v-close-popup
        >
          <q-item-section avatar>
            <q-img :src="scope.opt.album.cover" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.title" />
            <q-item-label caption>{{ scope.opt.artist.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script>
import { QSelect, QItem, QImg } from 'quasar'

export default {
  name: 'songSearch',
  props: {
    options: Array,
    method: { type: Function }
  },
  components: {
    QSelect,
    QItem,
    QImg
  },
  data () {
    return {
      model: null
    }
  },
  methods: {
    filterFn (val, update, abort) {
      this.$emit('filterFn', val, update, abort)
    }
  }
}
</script>
