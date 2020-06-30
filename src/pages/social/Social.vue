<template>
  <div>
    <Friends :selectedFriend="selectedFriend" @updateFollowing="updateFollowing" @updateFollower="updateFollower" />
    <Following :following="following" :followers="followers" @selectUser="selectUser" @updateFollower="updateFollower" />
  </div>
</template>
<script>
import Friends from 'src/pages/social/Friends'
import Following from 'src/pages/social/Following'
import {
  GET_FOLLOWERS_QUERY,
  GET_FOLLOWING_QUERY
} from 'src/graphql/queries/followerQueries'
const statusList = ['pending', 'accepted', 'declined', 'blocked']
export default {
  components: {
    Friends,
    Following
  },
  data () {
    return {
      selectedFriend: {}
    }
  },
  apollo: {
    following: {
      query: GET_FOLLOWING_QUERY,
      update: function (data) {
        return this.filterFollowing(data.following)
      }
    },
    followers: {
      query: GET_FOLLOWERS_QUERY,
      update: function (data) {
        return this.filterFollowers(data.followers)
      }
    }
  },
  methods: {
    selectUser (user) {
      this.$set(this.selectedFriend, 'friend', user)
    },
    updateFollowing (status, userName) {
      const following = Array.from(this.following)
      const followIndex = following.findIndex(f => f.userName === userName)
      following[followIndex].followingStatus = status
      this.following = following
    },
    updateFollower (status, userName) {
      const followers = Array.from(this.following)
      const followerIndex = followers.findIndex(f => f.userName === userName)
      followers[followerIndex].followerStatus = status
      this.followers = followers
    },
    filterFollowing (following) {
      return following
        .filter(user => {
          return user.status === 1
        })
        .map(user => {
          const tempUser = user.following
          tempUser.followingStatus = statusList[user.status]
          return tempUser
        })
    },
    filterFollowers (followers) {
      return followers
        .filter(user => {
          return user.status !== 3
        })
        .map(user => {
          const tempUser = user.follower
          tempUser.followerStatus = statusList[user.status]
          return tempUser
        })
    }
  }
}
</script>
<style>
.my-card {
  width: 100%;
  max-width: 350px;
}
.icon {
  float: right;
}
</style>
