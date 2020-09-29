<template>
  <div>
   <q-select
      rounded
      outlined
      v-model="model"
      label="Search"
      use-input
      hide-selected
      input-debounce="0"
      :options="filteredOptions"
      @filter="filterFn"
    >
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
          v-on:click="$emit('selectUser', scope.opt)"
          clickable
          v-close-popup
        >
          <q-item-section avatar>
            <q-img
              :src="scope.opt.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.userName" />
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
import { QSelect, QImg } from 'quasar'
import { GET_USERS_QUERY } from 'src/graphql/queries/userQueries'
export default {
  components: {
    QSelect,
    QImg
  },
  data () {
    return {
      model: null,
      options: [],
      filteredOptions: []
    }
  },
  apollo: {
    options: {
      query: GET_USERS_QUERY,
      update: data => data.users
    }
  },
  methods: {
    filterFn (val, update, abort) {
      if (val.length < 1 || val === '' || !val) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.options.filter(
          v => v.userName.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  }
}
</script>
