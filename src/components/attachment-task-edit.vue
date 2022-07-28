<template lang="">
  <div>attacjments</div>
  <div class="attachments-conteiner flex clex column">
    <span class="attachment-icon"></span>
    <div class="flex">
      <img class="attachment-img" :src="attachment" alt="" />
      <div class="attachments-data flex flex-column">
        <div class="attachment-optinons flex">
<<<<<<< HEAD
          <a href="#" @click="onChangeCover()">Make cover</a>
          <a href="#" @click="onRemoveAtachment()">Delete</a>
=======
          <!-- <a href="#" @click="$emit('makeCover',style:{bgColor:'',bgImgurl:attachment})">Make cover</a>
          <a href="#" @click="$emit('removeAttachemnt',{obj:attachment,idx})">Delete</a> -->
>>>>>>> 63acac86ead05844d070871a4429b856f14b9045
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'attachment-task-edit',

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
  methods: {
    onChangeCover() {
      let style = {
        bgColor: '',
        bgImgUrl: this.attachment,
      }
      this.$emit('makeCover', style)
    },
    onRemoveAtachment() {
      let attachemntIdx = this.idx
      this.$emit('removeAttachemnt', attachemntIdx)
    },
  },
}
</script>
<style lang=""></style>
