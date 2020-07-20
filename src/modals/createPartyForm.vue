<template>
  <div class="row justify-center items-center">
    <q-dialog ref="dialog" @hide="cancel">
      <q-card class="screen" flat>
        <q-card-section>
          <form>
            <h5>Start a Party</h5>
            <div class="q-pa-md">
              <q-input
                label="Name (optional)"
                v-model="name"
              ></q-input>
            </div>
            <div class="q-gutter-md flex justify-start">
              <div class="q-pt-md">
                <q-toggle
                  v-model="limit"
                  label="limit requests?"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                />
              </div>
              <q-input
                v-if="limit"
                label="Initial"
                type="number"
                style="max-width:75px"
                v-model.number="requests"
              />
            </div>
          </form>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat @click="cancel" color="dark">cancel</q-btn>
          <q-btn flat class="mr-4" @click="submit" color="primary">submit</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QCardSection
  //  QSpinnerRadio
} from 'quasar'
export default {
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput
    //    QSpinnerRadio
  },
  data () {
    return {
      name: '',
      limit: true,
      requests: 5
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    submit () {
      this.$emit('ok', { name: this.name, limit: this.limit, requests: this.requests })
      this.hide()
    },
    cancel () {
      this.hide()
    }
  }
}
</script>
<style scoped>
h5 {
  margin: 0;
}
.loading {
  font-size: 25px;
}

.logo {
  margin: auto;
  display: block;
}

.authError {
  color: red;
}

.screen {
  padding: 1em;
  flex: 1;
  max-width: 500px;
}

.sep {
  margin: 1em;
}
</style>
