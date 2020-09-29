<template>
  <div>
    <div>
      <div v-if="user" class="row justify-center q-ma-lg" q-ma-md>
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
          @block="updateFollower('blocked')"
          @unBlock="removeFollower"
          @acceptFollower="updateFollower('accepted')"
          @declineFollower="removeFollower"
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
  GET_FOLLOW_QUERY,
  RELATIONSHIP_UPDATED_SUBSCRIPTION,
  RELATIONSHIP_DELETED_SUBSCRIPTION,
  RELATIONSHIP_CREATED_SUBSCRIPTION
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
          userName: this.user.userName
        }
      },
      update: data => data.follow,
      subscribeToMore: [{
        document: RELATIONSHIP_UPDATED_SUBSCRIPTION,
        variables () {
          return { id: this.following ? this.following.id : 0 }
        }
      },
      {
        document: RELATIONSHIP_DELETED_SUBSCRIPTION,
        variables () {
          return { id: this.following ? this.following.id : 0 }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            following: null
          }
        }
      },
      {
        document: RELATIONSHIP_CREATED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: function (previousResult, { subscriptionData }) {
          if (subscriptionData.data.relationshipCreated.following.userName === this.user.userName && subscriptionData.data.relationshipCreated.follower.userName === this.$store.getters.user.userName) {
            return { follower: subscriptionData.data.relationshipCreated }
          }
        }
      }]
    },
    follower: {
      query: GET_FOLLOWER_QUERY,
      variables () {
        return {
          userName: this.user.userName
        }
      },
      update: data => data.follower,
      subscribeToMore: [{
        document: RELATIONSHIP_UPDATED_SUBSCRIPTION,
        variables () {
          return { id: this.follower ? this.follower.id : 0 }
        }
      },
      {
        document: RELATIONSHIP_DELETED_SUBSCRIPTION,
        variables () {
          return { id: this.follower ? this.follower.id : 0 }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            follower: null
          }
        }
      },
      {
        document: RELATIONSHIP_CREATED_SUBSCRIPTION,
        variables () {
          return { userName: this.$store.getters.user.userName }
        },
        updateQuery: function (previousResult, { subscriptionData }) {
          if (subscriptionData.data.relationshipCreated.follower.userName === this.user.userName && subscriptionData.data.relationshipCreated.following.userName === this.$store.getters.user.userName) {
            return { follower: subscriptionData.data.relationshipCreated }
          }
        }
      }]
    }
  },
  methods: {
    sendFollowRequest () {
      this.$apollo.mutate({
        mutation: SEND_FOLLOW_MUTATION,
        variables: { userName: this.user.userName },
        refetchQueries: [{
          query: GET_FOLLOW_QUERY,
          variables: { userName: this.user.userName }
        }]
      })
    },
    unFollow () {
      this.$apollo.mutate({
        mutation: REMOVE_FOLLOW_MUTATION,
        variables: {
          id: this.following.id
        },
        refetchQueries: [{
          query: GET_FOLLOW_QUERY,
          variables: { userName: this.user.userName }
        }]
      })
    },
    updateFollower (status) {
      this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          id: this.follower.id,
          status: status
        }
      })
    },
    removeFollower () {
      this.$apollo.mutate({
        mutation: REMOVE_FOLLOWER_MUTATION,
        variables: {
          id: this.follower.id
        },
        refetchQueries: [{
          query: GET_FOLLOWER_QUERY,
          variables: { userName: this.user.userName }
        }]
      })
    }
  }
}
</script>
