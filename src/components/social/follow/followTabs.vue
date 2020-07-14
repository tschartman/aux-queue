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
  UPDATE_FOLLOWER_MUTATION,
  RELATIONSHIP_CREATED_SUBSCRIPTION,
  RELATIONSHIPS_UPDATED_SUBSCRIPTION,
  RELATIONSHIPS_DELETED_SUBSCRIPTION
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
      update: data => data.following.filter(f => f.status === 1),
      subscribeToMore: [{
        document: RELATIONSHIPS_DELETED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: function (previousResult, { subscriptionData }) {
          if (subscriptionData.data.relationshipsDeleted.follower.userName === this.$store.getters.user.userName) {
            return {
              following: previousResult.following.filter(following => following.id !== subscriptionData.data.relationshipsDeleted.id)
            }
          }
        }
      },
      {
        document: RELATIONSHIPS_UPDATED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: function (previousResult, { subscriptionData }) {
          if (subscriptionData.data.relationshipsUpdated.follower.userName === this.$store.getters.user.userName) {
            if (previousResult.following.find(following => following.id === subscriptionData.data.relationshipsUpdated.id)) {
              return previousResult
            }
            return {
              following: [
                ...previousResult.following,
                subscriptionData.data.relationshipsUpdated
              ]
            }
          }
        }
      }]
    },
    followers: {
      query: GET_FOLLOWERS_QUERY,
      update: data => data.followers.filter(f => f.status !== 3),
      subscribeToMore: [{
        document: RELATIONSHIPS_DELETED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: function (previousResult, { subscriptionData }) {
          if (subscriptionData.data.relationshipsDeleted.following.userName === this.$store.getters.user.userName) {
            return {
              followers: previousResult.followers.filter(follower => follower.id !== subscriptionData.data.relationshipsDeleted.id)
            }
          }
        }
      },
      {
        document: RELATIONSHIP_CREATED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: function (previousResult, { subscriptionData }) {
          if (subscriptionData.data.relationshipCreated.following.userName === this.$store.getters.user.userName) {
            if (previousResult.followers.find(follower => follower.id === subscriptionData.data.relationshipCreated.id)) {
              return previousResult
            }
            return {
              followers: [
                ...previousResult.followers,
                subscriptionData.data.relationshipCreated
              ]
            }
          }
        }
      }]
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
