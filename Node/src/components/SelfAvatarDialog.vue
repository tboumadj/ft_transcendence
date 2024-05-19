<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 500px" class="q-dialog-plugin">
    <q-card style="min-width: 500px">

        <q-card-section>
          <div class="text-h6">Modify Message</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
           <input type="text"  style="width: 100%" v-model="data.modifyMessage" autofocus @keyup.enter="onOKClick" class="input">
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Delete Message</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn color="red" label="Delete Message" @click="onDelete" v-close-popup />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="onCancelClick" v-close-popup />
          <q-btn flat @click="onOKClick" label="Confirm" v-close-popup />
        </q-card-actions>
      </q-card>

    </q-card>
    </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'

const data = {
  delete: false,
  modifyMessage: '',
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

function onOKClick() {
  onDialogOK(data)
}

function onCancelClick() {
  onDialogCancel()
}

function onDelete() {
	data.delete = true;
  	onDialogOK(data)
}
</script>

<style>
.input{
  border: none;
  border-bottom: 2px solid grey;
}
</style>
