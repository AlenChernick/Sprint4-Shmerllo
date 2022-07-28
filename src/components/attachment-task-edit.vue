<template lang="">
  <div>attacjments</div>
  <div class="attachments-conteiner flex clex column">
    <span class="attachment-icon"></span>
    <div class="flex">
      <img class="attachment-img" :src="attachment" alt="" />
      <div class="attachments-data flex flex-column">
        <div class="attachment-optinons flex">
          <a href="#" @click="onChangeCover()">Make cover</a>
          <a href="#" @click="onRemoveAtachment()">Delete</a>
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
  methods: {
    onChangeCover() {
      let style = {
        bgColor: "",
        bgImgUrl: this.attachment,
      }
      this.$emit("makeCover", style)
    },
    onRemoveAtachment() {
      let attachemntIdx = this.idx
      this.$emit("removeAttachemnt", attachemntIdx)
    },
  },
}
</script>
<style lang=""></style>
