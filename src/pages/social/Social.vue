<template>
  <div>
    <Friends :user="user" :selectedFriend="selectedFriend" />
    <Following @selectUser="selectUser" />
  </div>
</template>
<script>
import Friends from 'src/pages/social/Friends'
import Following from 'src/pages/social/Following'
export default {
  components: {
    Friends,
    Following
  },
  data () {
    return {
      user: {},
      selectedFriend: {},
      updatedFriend: {},
      imageUrl: '',
      friend: null,
      options: [],
      tab: 'social',
      edit: false
    }
  },
  computed: {},
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
