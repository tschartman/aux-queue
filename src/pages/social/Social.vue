<template>
  <div>
    <Friends :selectedFriend="selectedFriend" />
    <FollowTabs @selectUser="selectUser" />
  </div>
</template>
<script>
import Friends from 'src/pages/social/Friends'
import FollowTabs from 'src/components/social/follow/FollowTabs'
export default {
  components: {
    Friends,
    FollowTabs
  },
  data () {
    return {
      selectedFriend: {}
    }
  },
  methods: {
    selectUser (user) {
      this.$set(this.selectedFriend, 'friend', user)
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
