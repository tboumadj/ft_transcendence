<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
  <!-- <q-dialog v-model="data" > -->
    <q-card style="min-width: 350px">

        <q-card-section>
          <div class="text-h6">New Channel</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
           <input type="text" v-model="data.nameChannel" autofocus @keyup.enter="onOKClick" class="input">
            <!-- <q-input dense v-model="data.mychannel" autofocus @keyup.enter="onOKClick" /> -->
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Password (optional)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- <q-input dense v-model="data.mypass" autofocus @keyup.enter="onOKClick" /> -->
          <input type="text" v-model="data.passChannel" autofocus @keyup.enter="onOKClick" class="input">
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="onCancelClick" v-close-popup />
          <q-btn flat @click="onOKClick" label="Confirm" v-close-popup />
        </q-card-actions>
      </q-card>
    <!-- </q-dialog> -->

    </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const data = {
  nameChannel: '',
  passChannel: null,
}

const props = defineProps({
  // ...your custom props
  // title: String,
  // message: String,
  // channel: String,
  // password: String,
  // prompt: Object,
  // cancel: Boolean,
  // persistent: Boolean
})


defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)

function onOKClick() {
  onDialogOK(data)
}

function onCancelClick() {
  onDialogCancel()
}

</script>

<style>
.input{
  border: none;
  border-bottom: 2px solid grey;
}
</style>
