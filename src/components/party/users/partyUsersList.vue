<template>
  <div v-if="guests">
    <q-expansion-item
      expand-separator
      icon="remove_circle"
      label="Blocked"
      :caption="String(blocked.length)"
    >
      <q-item v-for="guest in blocked" :key="guest.id">
        <q-item-section avatar>
          <q-avatar>
            <q-img
              :src="guest.user.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="guest.user.userName" />
          <q-item-label caption>{{ guest.user.firstName }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="row">
            <div class="q-mx-md">
              <q-icon
                class="clickable"
                size="md"
                name="report_off"
                color="green"
                @click="allowInParty(guest.id)"
              >
                <q-tooltip>
                  Unblock
                </q-tooltip>
              </q-icon>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-expansion-item>
      <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Requesting"
      :caption="String(requested.length)"
    >
      <q-item v-for="guest in requested" :key="guest.id">
        <q-item-section avatar>
          <q-avatar>
            <q-img
              :src="guest.user.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="guest.user.userName" />
        </q-item-section>
        <q-item-section avatar>
          <div class="row">
            <div class="q-mx-md">
              <q-icon
                class="clickable"
                size="md"
                name="clear"
                color="red"
                @click="sendRemoveRequest(guest.id)"
              >
                <q-tooltip>
                  Decline
                </q-tooltip>
              </q-icon>
            </div>
            <div class="q-mx-md">
              <q-icon
                class="clickable"
                size="md"
                name="done"
                color="green"
                @click="allowInParty(guest.id)"
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
    <q-item v-for="guest in accepted" :key="guest.user.userName">
      <q-item-section avatar>
        <q-avatar>
          <q-img
            :src="guest.user.userImage || 'https://www.gravatar.com/avatar/'"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-html="guest.user.userName" />
      </q-item-section>
      <q-item-section avatar>
        <div class="text-subtitle2">
          {{ guest.amountRequested }}
          <q-tooltip>Songs Requested</q-tooltip>
        </div>
      </q-item-section>
      <q-item-section avatar>
        <div class="text-subtitle2 clickable">
          {{ guest.allowedRequests }}
          <q-tooltip>Allowed Requests</q-tooltip>
        </div>
        <q-popup-edit
          v-model.number="guest.allowedRequests"
          @save="updateRequests($event, guest.id)"
          buttons
        >
          <q-input
            :min="guest.amountRequested"
            type="number"
            v-model.number="guest.allowedRequests"
            dense
            autofocus
          />
        </q-popup-edit>
      </q-item-section>
      <q-item-section avatar>
        <q-icon
          class="clickable"
          size="sm"
          name="block"
          @click="kickUser(guest.user.userName, guest.id)"
          color="red"
        >
          <q-tooltip>
            Kick from party
          </q-tooltip>
        </q-icon>
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar, QTooltip, QPopupEdit, QInput, QExpansionItem } from 'quasar'
import {
  UPDATE_ALLOWED_REQUEST,
  REMOVE_FROM_PARTY_MUTATION,
  ALLOW_IN_PARTY_MUTATION
} from 'src/graphql/queries/partyQueries'
export default {
  components: {
    QImg,
    QAvatar,
    QTooltip,
    QPopupEdit,
    QInput,
    QExpansionItem
  },
  props: {
    users: Array,
    method: { type: Function }
  },
  data () {
    return {
      guests: []
    }
  },
  computed: {
    accepted () {
      return this.guests.filter(guest => guest.status === 1)
    },
    requested () {
      return this.guests.filter(guest => guest.status === 0)
    },
    blocked () {
      return this.guests.filter(guest => guest.status === 2)
    }
  },
  methods: {
    async updateRequests (value, id) {
      const updatedRequest = await this.$apollo.mutate({
        mutation: UPDATE_ALLOWED_REQUEST,
        variables: { id: id, amount: value }
      })
      if (!updatedRequest.data.updateAllowedRequests.ok) {
        this.$q.notify({
          color: 'negative',
          message: 'Error updating requests amount',
          icon: 'report_problem'
        })
      }
    },
    kickUser (username, id) {
      this.$q.notify({
        message:
          'Are you sure you want to kick ' + username + ' from your party?',
        actions: [
          { label: 'Nevermind', color: 'white', handler: () => {} },
          {
            label: 'Kick them out!',
            color: 'red',
            handler: () => {
              this.sendRemoveRequest(id)
            }
          }
        ]
      })
    },
    async sendRemoveRequest (id) {
      const removeFromParty = await this.$apollo.mutate({
        mutation: REMOVE_FROM_PARTY_MUTATION,
        variables: { id: id }
      })
      if (removeFromParty.data.removeFromParty.ok) {
        this.$set(this, 'guests', removeFromParty.data.removeFromParty.party.guests)
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Error removing user from party',
          icon: 'report_problem'
        })
      }
    },
    async allowInParty (id) {
      const allowInParty = await this.$apollo.mutate({
        mutation: ALLOW_IN_PARTY_MUTATION,
        variables: { id: id }
      })
      if (allowInParty.data.allowInParty.ok) {
        this.$set(this, 'guests', allowInParty.data.allowInParty.party.guests)
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Error accepting request',
          icon: 'report_problem'
        })
      }
    }
  },
  created () {
    this.guests = Array.from(this.users)
  }
}
</script>
<style lang="stylus">
.clickable {
  cursor pointer;
}
</style>
