<template>
    <div>
        <div v-if="status === -1">
            <q-btn
              flat
              color="primary"
              label="Follow"
              @click="$emit('sendFollowRequest')"
            />
        </div>
        <div v-if="status === 0">
            <q-btn flat color="primary" label="Requested">
              <q-menu>
                <q-item
                  style="width: 110px"
                  @click="$emit('unFollow')"
                  clickable
                  v-close-popup
                >
                  <q-item-section>Cancel</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
        </div>
        <div v-if="status === 1">
            <q-btn flat color="primary" label="Following">
              <q-menu>
                <q-item
                  style="width: 110px"
                  @click="$emit('unFollow')"
                  clickable
                  v-close-popup
                >
                  <q-item-section>Unfollow</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    method: { type: Function },
    status: Number
  }
}
</script>
