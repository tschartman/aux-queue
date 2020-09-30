<template>
  <div>
    <Friends v-if="user" :user="user"/>
    <searchUsers class="q-ma-lg"  @selectUser="selectUser" />
    <FollowTabs @selectUser="selectUser" />
  </div>
</template>
<script>
import Friends from 'src/pages/social/Friends'
import FollowTabs from 'src/components/social/follow/FollowTabs'
import searchUsers from 'src/components/social/search/searchUsers'

export default {
  props: {
    passedUser: { type: Object }
  },
  components: {
    Friends,
    FollowTabs,
    searchUsers
  },
  data () {
    return {
      user: null
    }
  },
  methods: {
    selectUser (user) {
      this.$set(this, 'user', user)
    }
  },
  created () {
    if (this.passedUser) {
      this.user = this.passedUser
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
