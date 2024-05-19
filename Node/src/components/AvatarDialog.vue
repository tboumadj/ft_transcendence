<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
    <q-card style="min-width: 350px, margin: 30px">
        <q-card-section class="q-mt-md q-mr-sm q-pt-none">
          <q-btn color="red" label="Block User" @click="onBlock" v-close-popup />
        </q-card-section>
        <q-card-section class="q-mt-md q-mr-sm q-pt-none" v-if="isPromote">
          <q-btn color="green" label="Promote User" @click="onPromote" v-close-popup />
        </q-card-section>
        <q-card-section class="q-mt-md q-mr-sm q-pt-none" v-if="isBan">
          <q-btn color="red" label="Ban User" @click="onBan" v-close-popup />
        </q-card-section>
        <q-card-section class="q-mt-md q-mr-sm q-pt-none" v-if="isUnPromote">
          <q-btn color="red" label="Unpromote User" @click="onUnPromote" v-close-popup />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="onCancelClick" v-close-popup />
        </q-card-actions>
      </q-card>

    </q-card>
    </q-dialog>
</template>

<style>
.input{
  border: none;
  border-bottom: 2px solid grey;
}
</style>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { computed } from 'vue';


const data = {}

const props = defineProps({
  // Prop to pass channel details
  selectedChannel: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  selectMessageContent: {
    type: Object,
    required: true
  },
})

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// Function to check if the user is admin or owner
const isBan = computed(() => {
			console.log("props", props.selectedChannel.owner, props.selectMessageContent.sender);
	if (props.selectedChannel.owner != props.selectMessageContent.sender){
		if (props.selectedChannel.admin.includes(props.user.value.id) || props.selectedChannel.owner  ==  props.user.value.id){
			return true;
		}
		else
			return false;
	} else {
		return false;
	}
});
const isPromote = computed(() => {
	if (props.selectedChannel.owner == props.user.value.id){
		if (!props.selectedChannel.admin.includes(props.selectMessageContent.sender))
			return true;
		else
			return false;
	} else {
		return false;
	}
});

const isUnPromote = computed(() => {
	if (props.selectedChannel.owner == props.user.value.id ){
		if (props.selectedChannel.admin.includes(props.selectMessageContent.sender))
			return true;
		else
			return false;
	} else {
		return false;
	}
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])



function onOKClick() {
  onDialogOK(data)
}

function onCancelClick() {
  onDialogCancel()
}

function onBan() {
	data.value = 'ban';
	onOKClick();
}
function onPromote() {
	data.value = 'promote';
	onOKClick();
}
function onUnPromote() {
	data.value = 'unpromote';
	onOKClick();
}

</script>


