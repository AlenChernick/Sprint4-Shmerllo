<template lang="">
  <div class="attachments-conteiner flex clex column">
<!-- <template>
  <div class="main-editor-attachments"> -->
    <span class="attachment-icon"></span>
    <h4 class="main-editor-attachments-title">Attachments</h4>
  </div>
  <div class="main-edtior-attacment-info">
    <img class="attachment-img" :src="attachment" alt="" />
    <div class="attachments-data">
      <div class="main-edtior-img-name">{{ attachment }}</div>
      <div class="attachment-options">
        <span class="attachment-cover-icon"></span>
        <a class="attachment-option-cover" href="#" @click="onChangeCover()">Make cover</a>
        <a href="#" @click="onRemoveAtachment()">Delete</a>
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
      console.log(attachemntIdx);
      this.$emit("removeAttachemnt", attachemntIdx)
    },
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
