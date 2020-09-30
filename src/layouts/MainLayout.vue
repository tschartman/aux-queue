<template>
  <div class="test">
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar :class="this.$q.dark.mode ? 'bg-grey-9' : 'bg-grey-3'">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" color="black" />
          </q-btn>

          <q-toolbar-title>
            <img height="35px" width="140px" src='../statics/AuxQueue-logo.png' />
          </q-toolbar-title>
          <q-toggle v-model="value" />
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
            </q-list>
            </q-menu>
        </q-btn>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :content-class="this.$q.dark.mode ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-list>
          <q-item-label header>Options</q-item-label>
          <div v-if="$store.getters.isLoggedIn">
            <q-item
              :active="$store.getters.page === 'home'"
              clickable
              v-on:click="navigate('home')"
            >
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                <q-item-label>AuxQueue</q-item-label>
              </q-item-section>
            </q-item>
            <q-item :active="$store.getters.page === 'social'" clickable v-on:click="navigate('social')">
              <q-item-section avatar>
                <q-icon name="group_add" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Social</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-on:click="logout">
              <q-item-section avatar>
                <q-icon name="exit_to_app" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Log Out</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div v-else>
            <q-item clickable to="/register">
              <q-item-section avatar>
                <q-icon name="person_add" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Create Acccount</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-drawer>
      <q-dialog v-model="edit">
        <editUser
        v-if="modal == 'info'"
        :user="$store.getters.user"
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
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import editUser from 'src/modals/editUser'
import editUserName from 'src/modals/editUserName'
import editPassword from 'src/modals/editPassword'
import {
  openURL,
  QItemLabel,
  QItem,
  QItemSection,
  QIcon,
  QSeparator
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
export default {
  name: 'AppBar',
  components: {
    QItemLabel,
    QItem,
    QItemSection,
    QIcon,
    QSeparator,
    editUser,
    editUserName,
    editPassword
  },
  data () {
    return {
      leftDrawerOpen: false,
      playlists: [],
      model: null,
      share: false,
      value: false,
      modal: '',
      edit: false
    }
  },
  watch: { value: function () { this.$q.dark.toggle() } },
  methods: {
    openURL,
    async logout () {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    },
    navigate (page) {
      if (this.$store.getters.page === page) {
        this.leftDrawerOpen = false
      } else if (page === 'home') {
        this.$store.dispatch('navigate', 'home')
        this.$router.push('/')
      } else {
        this.$store.dispatch('navigate', page)
        this.$router.push(page)
      }
    },
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
  created () {}
}
</script>

<style scoped>
.router-link {
  display: block;
  color: white;
}
</style>
