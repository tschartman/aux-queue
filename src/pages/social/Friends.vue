<template>
  <div>
    <q-select
      rounded
      outlined
      v-model="friends"
      label="Search"
      use-input
      hide-selected
      input-debounce="0"
      :options="filterOptions"
      @filter="filterFn"
    >
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
          v-on:click="selectUser(scope.opt)"
          clickable
          v-close-popup
        >
          <q-item-section avatar>
            <q-img
              :src="user.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.userName" />
            <q-item-label caption>{{ scope.opt.firstName }}</q-item-label>
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
    <div>
      <div v-if="friend">
        <div class="row justify-center" q-ma-md>
          <follow
            :status="friend.followingStatus"
            @unFollow="unFollow"
            @sendFollowRequest="sendFollowRequest"
          />
          <follower
            :status="friend.followerStatus"
            @block="block"
            @unBlock="unBlock"
            @acceptFollower="acceptFollower"
            @declineFollower="declineFollower"
          />
        </div>
        <userView :user="friend" />
      </div>
    </div>
  </div>
</template>
<script>
import { QSelect, QImg } from 'quasar'
import { GET_USERS_QUERY } from 'src/graphql/queries/userQueries'
import {
  GET_FOLLOWING_QUERY,
  GET_FOLLOWERS_QUERY,
  SEND_FOLLOW_MUTATION,
  UPDATE_FOLLOWER_MUTATION,
  REMOVE_FOLLOW_MUTATION,
  REMOVE_FOLLOWER_MUTATION
} from 'src/graphql/queries/followerQueries'
import userView from 'src/components/social/users/userView'
import follow from 'src/components/social/menu/follow'
import follower from 'src/components/social/menu/follower'
const statusList = ['pending', 'accepted', 'declined', 'blocked']
export default {
  props: {
    user: Object,
    selectedFriend: Object
  },
  components: {
    follow,
    follower,
    QSelect,
    QImg,
    userView
  },
  data () {
    return {
      friends: [],
      options: [],
      filterOptions: [],
      friend: null
    }
  },
  watch: {
    selectedFriend: {
      immediate: true,
      deep: true,
      async handler (selectedFriend) {
        if (selectedFriend.friend) {
          const friend = {
            firstName: selectedFriend.friend.firstName,
            userImage: selectedFriend.friend.userImage,
            userName: selectedFriend.friend.userName
          }
          this.selectUser(friend)
        }
      }
    }
  },
  methods: {
    async selectUser (user) {
      this.friend = user
      const followingStatus = await this.findFollowingStatus(user.userName)
      const followerStatus = await this.findFollowerStatus(user.userName)
      this.$set(this.friend, 'followingStatus', followingStatus)
      this.$set(this.friend, 'followerStatus', followerStatus)
    },
    async findFollowingStatus (userName) {
      const followingData = await this.$apollo.query({
        query: GET_FOLLOWING_QUERY
      })
      const found = followingData.data.following.find(
        f => f.following.userName === userName
      )
      if (found) {
        return statusList[found.status]
      }
      return 'none'
    },
    async findFollowerStatus (userName) {
      const followerData = await this.$apollo.query({
        query: GET_FOLLOWERS_QUERY
      })
      const found = followerData.data.followers.find(
        f => f.follower.userName === userName
      )
      if (found) {
        return statusList[found.status]
      }
      return 'none'
    },
    async sendFollowRequest () {
      const follow = await this.$apollo.mutate({
        mutation: SEND_FOLLOW_MUTATION,
        variables: { userName: this.friend.userName }
      })
      if (follow.data.sendFollowRequest.ok) {
        this.$set(this.friend, 'followingStatus', 'pending')
      } else {
        this.notify('Error sending follow request')
      }
    },
    async unFollow () {
      const removeFollow = await this.$apollo.mutate({
        mutation: REMOVE_FOLLOW_MUTATION,
        variables: {
          userName: this.friend.userName
        }
      })
      if (removeFollow.data.removeFollowRequest.ok) {
        this.$set(this.friend, 'followingStatus', 'none')
      } else {
        this.notify('Error unfollowing user')
      }
    },
    async block () {
      const updatedFollower = await this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          userName: this.friend.userName,
          status: 'blocked'
        }
      })
      if (updatedFollower.data.updateFollowerRequest.ok) {
        this.$set(this.friend, 'followerStatus', 'blocked')
      } else {
        this.notify('Error blocking user')
      }
    },
    async unBlock () {
      const removeFollower = await this.$apollo.mutate({
        mutation: REMOVE_FOLLOWER_MUTATION,
        variables: {
          userName: this.friend.userName
        }
      })
      if (removeFollower.data.removeFollowerRequest.ok) {
        this.$set(this.friend, 'followerStatus', 'none')
      } else {
        this.notify('Error unblocking user')
      }
    },
    async acceptFollower () {
      const updatedFollower = await this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          userName: this.friend.userName,
          status: 'accepted'
        }
      })
      if (updatedFollower.data.updateFollowerRequest.ok) {
        this.$set(this.friend, 'followerStatus', 'accepted')
      } else {
        this.notify('Error accepting friend request')
      }
    },
    async declineFollower () {
      const removeFollower = await this.$apollo.mutate({
        mutation: REMOVE_FOLLOWER_MUTATION,
        variables: {
          userName: this.friend.userName
        }
      })
      if (removeFollower.data.removeFollowerRequest.ok) {
        this.$set(this.friend, 'followerStatus', 'none')
      } else {
        this.notify('Error declining follow request')
      }
    },
    notify (msg) {
      this.$q.notify({
        color: 'negative',
        message: msg,
        icon: 'report_problem'
      })
    },
    filterFn (val, update, abort) {
      if (val.length < 1 || val === '' || !val) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filterOptions = this.options.filter(
          v => v.userName.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  },
  async created () {
    const users = await this.$apollo.query({ query: GET_USERS_QUERY })
    this.options = users.data.users.filter(user => {
      if (user.userName === this.user.userName) {
        return false
      }
      return true
    })
    this.filterOptions = this.options
  }
}
</script>
