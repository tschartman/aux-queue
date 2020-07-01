<template>
    <div>
        <div v-if="status === 1">
            <q-btn flat color="primary" label="Follows You">
                <q-menu>
                <q-item
                    style="width: 110px"
                    @click="$emit('block')"
                    clickable
                    v-close-popup
                >
                    <q-item-section>Block</q-item-section>
                </q-item>
                </q-menu>
            </q-btn>
        </div>
        <div v-if="status === 0">
            <q-btn flat color="primary" label="Requesting">
                <q-menu>
                <q-list>
                    <q-item
                    style="width: 110px"
                    @click="$emit('acceptFollower')"
                    clickable
                    v-close-popup
                    >
                    <q-item-section>Accept</q-item-section>
                    </q-item>
                    <q-item
                    style="width: 110px"
                    @click="$emit('declineFollower')"
                    clickable
                    v-close-popup
                    >
                    <q-item-section>Decline</q-item-section>
                    </q-item>
                </q-list>
                </q-menu>
            </q-btn>
        </div>
        <div v-if="status === 3">
            <q-btn flat color="primary" label="Blocked">
                <q-menu>
                <q-item
                    style="width: 110px"
                    @click="$emit('unBlock')"
                    clickable
                    v-close-popup
                >
                    <q-item-section>Unblock</q-item-section>
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
