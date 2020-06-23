<template>
  <div class="test">
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-white">
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
          <q-btn
            flat
            color="black"
            v-if="!$store.getters.isLinked && $store.getters.isLoggedIn"
            v-on:click="redirect()"
            >link spotify</q-btn
          >
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        content-class="bg-grey-2"
      >
        <q-list>
          <q-item-label header>Options</q-item-label>
          <div v-if="$store.getters.isLoggedIn">
            <q-item
              :active="link === 'home'"
              clickable
              v-on:click="$router.push('/'), (link = 'home')"
            >
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                <q-item-label>AuxQueue</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="person" />
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
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="share">
          <sharePlaylist />
        </q-dialog>
      </div>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import {
  openURL,
  QItemLabel,
  QItem,
  QItemSection,
  QIcon,
  QSeparator
} from 'quasar'
export default {
  name: 'AppBar',
  components: {
    QItemLabel,
    QItem,
    QItemSection,
    QIcon,
    QSeparator
  },
  data () {
    return {
      link: 'home',
      leftDrawerOpen: false,
      playlists: [],
      model: null,
      share: false
    }
  },

  methods: {
    openURL,
    async logout () {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    },
    redirect () {
      window.location = 'https://auxstack.herokuapp.com/spotify/'
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
