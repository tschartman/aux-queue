<template>
  <div>
    <div>
      <div v-if="user" class="row justify-center" q-ma-md>
        <follow
          v-if="following"
          :status="following.status"
          @unFollow="unFollow"
          @sendFollowRequest="sendFollowRequest"
        />
        <follow
          v-else
          :status="-1"
          @unFollow="unFollow"
          @sendFollowRequest="sendFollowRequest"
        />
        <follower
          v-if="follower"
          :status="follower.status"
          @block="block"
          @unBlock="unBlock"
          @acceptFollower="acceptFollower"
          @declineFollower="declineFollower"
        />
      </div>
      <userView v-if="user" :user="user" />
    </div>
  </div>
</template>
<script>
import {
  SEND_FOLLOW_MUTATION,
  UPDATE_FOLLOWER_MUTATION,
  REMOVE_FOLLOW_MUTATION,
  REMOVE_FOLLOWER_MUTATION,
  GET_FOLLOWER_QUERY,
  GET_FOLLOW_QUERY
} from 'src/graphql/queries/followerQueries'
import userView from 'src/components/social/users/userView'
import follow from 'src/components/social/menu/follow'
import follower from 'src/components/social/menu/follower'
export default {
  props: {
    user: Object
  },
  components: {
    follow,
    follower,
    userView
  },
  data () {
    return {
    }
  },
  apollo: {
    following: {
      query: GET_FOLLOW_QUERY,
      variables () {
        return {
          userName: this.user ? this.user.userName : ''
        }
      },
      update: data => data.follow
    },
    follower: {
      query: GET_FOLLOWER_QUERY,
      variables () {
        return {
          userName: this.user ? this.user.userName : ''
        }
      },
      update: data => data.follower
    }
  },
  methods: {
    sendFollowRequest () {
      this.$apollo.mutate({
        mutation: SEND_FOLLOW_MUTATION,
        variables: { userName: this.user.userName }
      })
    },
    unFollow () {
      this.$apollo.mutate({
        mutation: REMOVE_FOLLOW_MUTATION,
        variables: {
          id: this.following.id
        }
      })
    },
    block () {
      this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          id: this.follower.id,
          status: 'blocked'
        }
      })
    },
    unBlock () {
      this.$apollo.mutate({
        mutation: REMOVE_FOLLOWER_MUTATION,
        variables: {
          id: this.follower.id
        }
      })
    },
    acceptFollower () {
      this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          id: this.follower.id,
          status: 'accepted'
        }
      })
    },
    declineFollower () {
      this.$apollo.mutate({
        mutation: REMOVE_FOLLOWER_MUTATION,
        variables: {
          id: this.follower.id
        }
      })
    }
  }
}
</script>
