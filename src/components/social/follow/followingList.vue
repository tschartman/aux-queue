<template>
  <div>
    <q-item
      v-for="follow in following"
      :key="follow.following.followingName"
      @click="$emit('selectUser', follow.following)"
      clickable
    >
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="follow.following.userImage || 'https://www.gravatar.com/avatar/'" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-html="follow.following.userName" />
        <q-item-label caption
          >{{ follow.following.firstName }} {{ follow.following.lastName }}</q-item-label
        >
      </q-item-section>
      <q-item-section avatar> </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar } from 'quasar'

export default {
  components: {
    QImg,
    QAvatar
  },
  props: {
    following: Array,
    method: { type: Function }
  }
}
</script>
<style lang="stylus"></style>
