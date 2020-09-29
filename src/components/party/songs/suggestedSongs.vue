<template>
  <div>
    <q-intersection
      v-for="suggested in sortedSongs"
      :key="suggested.id"
      once
      transition="scale"
    >
      <q-item>
        <q-item-section avatar>
          <q-img
            :src="suggested.song.coverUri"
            v-on:click="playPreview(suggested.song.preview_url)"
          >
            <q-btn
              v-if="audio && audio.src === suggested.song.preview_url"
              round
              color="transparent"
              icon="pause"
            />
            <q-btn v-else round color="transparent" icon="play_arrow" />
          </q-img>
        </q-item-section>
        <q-item-section
          >{{ suggested.song.title }} -
          {{ suggested.song.artist }}</q-item-section
        >
        <q-item-section v-if="!host" top side>
          <div class="q-gutter-sm flex">
            <q-icon
              class="clickable"
              :color="liked(suggested) ? 'blue' : ''"
              @click="$emit('likeAction', suggested, liked(suggested))"
              name="arrow_upward"
              size="md"
            >
            </q-icon>
            <span class='text-h6 votes'>{{ score(suggested) }}<q-tooltip>rating</q-tooltip></span>
            <q-icon
              class="clickable"
              :color="disliked(suggested) ? 'red' : ''"
              @click="$emit('dislikeAction', suggested, disliked(suggested))"
              name="arrow_downward"
              size="md"
            >
            </q-icon>
          </div>
        </q-item-section>
        <q-item-section v-else top side>
          <div class="q-gutter-sm flex">
          <span class='text-h6 votes'>{{ score(suggested) }}<q-tooltip>rating</q-tooltip></span>
          <q-icon
            class="clickable"
            @click="$emit('removeAction', suggested)"
            name="delete"
            color="red"
            size="md"
          >
          <q-tooltip>Remove</q-tooltip>
          </q-icon>
          <q-icon
            class="clickable"
            @click="$emit('playAction', suggested)"
            name="play_arrow"
            color="blue"
            size="md"
          >
            <q-tooltip>Play Now</q-tooltip>
          </q-icon>
          </div>
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>
<script>
import {
  QIntersection,
  QItem,
  QImg,
  QItemSection,
  QBtn,
  QIcon,
  QTooltip
} from 'quasar'

export default {
  name: 'suggestedSongs',
  props: {
    host: Boolean,
    songs: Array,
    method: { type: Function }
  },
  components: {
    QItem,
    QImg,
    QItemSection,
    QBtn,
    QIcon,
    QIntersection,
    QTooltip
  },

  data () {
    return {
      audio: null
    }
  },
  computed: {
    sortedSongs: function () {
      const suggested = Array.from(this.songs)
      return suggested.sort((a, b) => this.score(b) - this.score(a))
    }
  },
  methods: {
    playPreview (url) {
      if (this.audio) {
        const current = this.audio
        this.audio.pause()
        this.audio = null
        if (current.src !== url) {
          this.playPreview(url)
        }
      } else {
        this.audio = new Audio(url)
        this.audio.play()
      }
    },
    score (song) {
      return (
        song.rating.filter(r => r.like).length -
        song.rating.filter(r => !r.like).length
      )
    },
    liked (suggested) {
      return suggested.rating.find(
        r => r.user.userName === this.$store.getters.user.userName && r.like
      )
    },
    disliked (suggested) {
      return suggested.rating.find(
        r => r.user.userName === this.$store.getters.user.userName && !r.like
      )
    }
  },
  created () {}
}
</script>
<style scoped>
.votes {
  width: 25px;
  text-align: center;
}
</style>
