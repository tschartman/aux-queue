<template>
  <div>
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Requested"
      :caption="String(requested.length)"
      default-opened
    >
      <q-item v-for="follower in requested" :key="follower.id" clickable>
        <q-item-section @click="$emit('selectUser', follower)" avatar>
          <q-avatar>
            <q-img
              :src="follower.follower.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section @click="$emit('selectUser', user)">
          <q-item-label v-html="follower.follower.userName" />
          <q-item-label caption>{{ follower.follower.firstName }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="row">
            <div class="q-mx-md">
              <q-icon
                size="md"
                name="clear"
                @click="$emit('updateFollower', 'declined', follower.id)"
              >
                <q-tooltip>
                  Decline
                </q-tooltip>
              </q-icon>
            </div>
            <div class="q-mx-md">
              <q-icon
                size="md"
                name="done"
                @click="$emit('updateFollower', 'accepted', follower.id)"
              >
                <q-tooltip>
                  Accept
                </q-tooltip>
              </q-icon>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-item
      v-for="follower in accepted"
      :key="follower.id"
      @click="$emit('selectUser', follower)"
      clickable
    >
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="follower.follower.userImage || 'https://www.gravatar.com/avatar/'" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-html="follower.follower.userName" />
        <q-item-label caption
          >{{ follower.follower.firstName }} {{ follower.follower.lastName }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar, QTooltip, QExpansionItem } from 'quasar'

export default {
  components: {
    QImg,
    QAvatar,
    QTooltip,
    QExpansionItem
  },
  props: {
    followers: Array,
    method: { type: Function }
  },
  data () {
    return {}
  },
  computed: {
    requested () {
      return this.followers.filter(f => f.status === 0)
    },
    accepted () {
      return this.followers.filter(f => f.status === 1)
    }
  }
}
</script>
