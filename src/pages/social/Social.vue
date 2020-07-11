<template>
  <div>
    <searchUsers @selectUser="selectUser" />
    <Friends v-if="user" :user="user" />
    <FollowTabs @selectUser="selectUser" />
  </div>
</template>
<script>
import Friends from 'src/pages/social/Friends'
import FollowTabs from 'src/components/social/follow/FollowTabs'
import searchUsers from 'src/components/social/search/searchUsers'

export default {
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
