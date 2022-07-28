<template lang="">
  <div>attacjments</div>
  <div class="attachments-conteiner flex clex column">
    <span class="attachment-icon"></span>
    <div class="flex">
      <img class="attachment-img" :src="attachment" alt="" />
      <div class="attachments-data flex flex-column">
        <div class="attachment-optinons flex">
          <a href="#" @click="$emit('makeCover',style:{bgColor:'',bgImgurl:attachment})">Make cover</a>
          <a href="#" @click="$emit('removeAttachemnt',{obj:attachment,idx})">Delete</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "attachment-task-edit",

  props: {
    attachment: {
      type: Object,
    },
      idx: {
      type: Number,
    },
  },
  created() {
    console.log(this.attachment)
  },
}
</script>
<style lang=""></style>
