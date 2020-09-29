<template>
<div>
  <div class="row justify-center">
        <q-avatar>
          <img :src="user.userImage || 'https://secure.gravatar.com/avatar'" />
        </q-avatar>
  </div>
  <div class="row justify-center">
      <div class="text-h6">{{ user.userName }}</div>
  </div>
</div>
</template>
<script>
import { QAvatar } from 'quasar'
export default {
  components: {
    QAvatar
  },
  props: {
    user: Object
  },
  data () {
    return {}
  },
  methods: {}
}
</script>
