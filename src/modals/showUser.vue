<template>
  <div class="row justify-center items-center">
    <q-dialog ref="dialog" @hide="cancel">
      <q-card class="screen" flat>
        <Friends :user="user"/>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import {
  QCard
} from 'quasar'
import Friends from 'src/pages/social/Friends'
export default {
  props: {
    user: { type: Object }
  },
  components: {
    QCard,
    Friends
  },
  data () {
    return {
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    cancel () {
      this.hide()
    }
  }
}
</script>
<style scoped>
.screen {
  width: 300px;
  height: 225px;
}
</style>
