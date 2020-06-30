<template>
  <div>
    <q-tabs v-model="tab" class="text-teal">
      <q-tab name="following" label="Following">{{ following.length }} </q-tab>
      <q-tab name="followers" label="Followers">{{ followers.length }}</q-tab>
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="following">
        <followingList :following="following" @selectUser="selectUser" />
      </q-tab-panel>
      <q-tab-panel name="followers">
        <followerList
          :followers="followers"
          @selectUser="selectUser"
          @updateFollow="updateFollow"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import { QTabs, QTab, QTabPanel, QTabPanels, QSeparator } from 'quasar'
import followerList from 'src/components/social/follow/followerList'
import followingList from 'src/components/social/follow/followingList'
export default {
  props: {
    method: { type: Function },
    followers: Array,
    following: Array
  },
  components: {
    QTabs,
    QTab,
    QTabPanel,
    QTabPanels,
    QSeparator,
    followerList,
    followingList
  },
  data () {
    return {
      tab: 'following'
    }
  },
  methods: {
    selectUser (user) {
      this.$emit('selectUser', user)
    },
    updateFollow (status, userName) {
      this.$emit('updateFollow', status, userName)
    }
  }
}
</script>
<style></style>
