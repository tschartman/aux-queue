<template>
  <div class="justify-center items-center">
    <q-card class="screen">
      <q-card-section>
        <form>
          <div class="row">
            <div>
              <h5>New Username</h5>
            </div>
            <div>
              <q-spinner-radio v-if="loading" color="cyan" class="loading" />
            </div>
          </div>
          <q-input
            @keyup.enter="submit"
            v-model="userName"
            :error-message="userNameErrors[0]"
            :error="userNameErrors.length > 0"
            label="Username"
            required
            @input="$v.userName.$touch()"
            @blur="$v.userName.$touch()"
          ></q-input>
        </form>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat @click="$emit('cancel')" color="red">cancel</q-btn>
        <q-btn flat class="mr-4" @click="submit" color="primary">submit</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import {
  CHECK_USER_MUTATION,
  UPDATE_USER_NAME_MUTATION
} from 'src/graphql/queries/userQueries'
import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QCardSection,
  QSpinnerRadio
} from 'quasar'
export default {
  mixins: [validationMixin],
  validations: {
    userName: { required }
  },
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput,
    QSpinnerRadio
  },

  data () {
    return {
      userName: '',
      loading: false,
      unique: true
    }
  },
  watch: {
    userName: async function (val) {
      const userNameStatus = await this.$apollo.mutate({
        mutation: CHECK_USER_MUTATION,
        variables: { userName: val }
      })
      this.unique = userNameStatus.data.checkUserName.ok
    }
  },
  computed: {
    userNameErrors () {
      const errors = []
      if (!this.$v.userName.$dirty) return errors
      !this.$v.userName.required && errors.push('First Name is required.')
      !this.unique && errors.push('Username already taken')
      return errors
    }
  },
  methods: {
    async submit () {
      if (!this.$v.$invalid) {
        const data = {
          userName: this.userName
        }
        const updateUserName = await this.$apollo.mutate({
          mutation: UPDATE_USER_NAME_MUTATION,
          variables: data
        })
        if (updateUserName.data.updateUserName.ok) {
          this.$emit('success', updateUserName.data.updateUserName.userName)
        }
      }
    }
  },
  created () {}
}
</script>
<style scoped>
h5 {
  margin: 0.5rem;
}
.screen {
  min-width: 300px;
}
.loading {
  font-size: 20px;
  margin: 0.75rem;
}
</style>
