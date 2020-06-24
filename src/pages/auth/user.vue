<template>
  <div>
  <div class="row justify-center">
        <userView :user="user" />
        <q-btn class="icon" color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
            <q-list>
                <q-item
                clickable
                v-on:click="(modal = 'info'), (edit = true)"
                >
                <q-item-section>Edit Info</q-item-section>
                </q-item>
                <q-item
                clickable
                v-on:click="(modal = 'userName'), (edit = true)"
                >
                <q-item-section>Cange Username</q-item-section>
                </q-item>
                <q-item
                clickable
                v-on:click="
                    edit = true;
                    modal = 'password';
                "
                >
                <q-item-section>Cange Password</q-item-section>
                </q-item>
                <q-item clickable>
                <q-item-section>Share</q-item-section>
                </q-item>
            </q-list>
            </q-menu>
        </q-btn>
    </div>
    <q-dialog v-model="edit">
        <editUser
        v-if="modal == 'info'"
        :user="user"
        @cancel="edit = false"
        @success="userUpdated"
        />
        <editUserName
        v-if="modal == 'userName'"
        @cancel="edit = false"
        @success="userNameUpdated"
        />
        <editPassword
        v-if="modal == 'password'"
        @cancel="edit = false"
        @success="passwordUpdated"
        />
    </q-dialog>
    <q-separator />
    <spotifyCarousel v-if="$store.getters.isLinked" />
    <notLinked v-else />
  </div>
</template>
<script>
import spotifyCarousel from 'src/components/social/users/spotifyCarousel'
import editUser from 'src/modals/editUser'
import editUserName from 'src/modals/editUserName'
import editPassword from 'src/modals/editPassword'
import userView from 'src/components/social/users/userView'
import notLinked from 'src/pages/auth/notLinked'
import {
  QSeparator,
  QBtn,
  QMenu,
  QDialog
} from 'quasar'

const alerts = {
  username: {
    color: 'positive',
    message: 'Username Updated Sucuessfully!',
    icon: 'thumb_up'
  },
  password: {
    color: 'positive',
    message: 'Password Updated Sucuessfully!',
    icon: 'thumb_up'
  },
  user: {
    color: 'positive',
    message: 'User Updated Sucuessfully!',
    icon: 'thumb_up'
  }
}
import { USER_DATA_QUERY } from 'src/graphql/queries/userQueries'
export default {
  components: {
    QSeparator,
    QBtn,
    QMenu,
    QDialog,
    editUser,
    editUserName,
    editPassword,
    spotifyCarousel,
    userView,
    notLinked
  },
  data () {
    return {
      modal: '',
      slide: 1,
      user: {},
      imageUrl: '',
      options: [],
      edit: false
    }
  },
  computed: {},
  methods: {
    userUpdated (user) {
      this.edit = false
      this.user = user
      this.$q.notify(alerts.user)
    },
    userNameUpdated (userName) {
      this.edit = false
      this.user.userName = userName
      this.$q.notify(alerts.username)
    },
    passwordUpdated () {
      this.edit = false
      this.$q.notify(alerts.password)
    }
  },
  async created () {
    const userData = await this.$apollo.query({
      query: USER_DATA_QUERY
    })
    this.user = userData.data.user
  }
}
</script>
<style>
.my-card {
  width: 100%;
  max-width: 350px;
}
.icon {
}
</style>
