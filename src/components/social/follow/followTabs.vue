<template>
  <div>
    <q-tabs v-if="following && followers" v-model="tab" class="text-teal">
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
          @updateFollower="updateFollower"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import { QTabs, QTab, QTabPanel, QTabPanels, QSeparator } from 'quasar'
import followerList from 'src/components/social/follow/followerList'
import followingList from 'src/components/social/follow/followingList'
import {
  GET_FOLLOWERS_QUERY,
  GET_FOLLOWING_QUERY,
  UPDATE_FOLLOWER_MUTATION
} from 'src/graphql/queries/followerQueries'
export default {
  props: {
    method: { type: Function }
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
  apollo: {
    following: {
      query: GET_FOLLOWING_QUERY,
      update: data => data.following.filter(f => f.status === 1)
    },
    followers: {
      query: GET_FOLLOWERS_QUERY,
      update: data => data.followers.filter(f => f.status !== 3)
    }
  },
  methods: {
    selectUser (user) {
      this.$emit('selectUser', user)
    },
    updateFollower (status, id) {
      this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          id: id,
          status: status
        }
      })
    }
  }
}
</script>
<style></style>
