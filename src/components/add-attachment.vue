<template lang="">

  

  <section class="actions-modal-container add-attachment">
    <h4>Attach from...</h4>
    <span  @click.stop="closeModal" class="close-icon"></span>
    
    <label> Computer
    <input type="file" @change="handleFile" hidden/>
    </label>
    
    <h4 class="attach-link-txt">Attach a link </h4>
    <input autofocus spellcheck="false" placeholder="Paste any link here..." v-model="attachment.url" type="text" />
    <button @click="addAttachment">Attach</button>
  
   
  </section>

    
</template>
<script>
import { uploadImg } from '../../services/img-upload.service'; 

export default {
  name: 'add-attachment',
  data() {
    return {
       attachment: '', 
    }
  },
  methods: {
    addAttachment(){
      if (!this.attachment) return
      console.log('attching', this.attachment)
      this.$emit('addAttachment', this.attachment)
    },
    closeModal(){
      this.$emit("closeModal")
    },
    handleFile(ev) {
      console.log(ev);
      var file
      file = ev.target.files[0]
      this.onUploadFile(file)
    },
    async onUploadFile(file) {
      const res = await uploadImg(file)
      console.log(res.url)
      this.$emit('addAttachment', res.url)
    }
 
   
  },
  created(){
    
  },
  computed: {
    
  },
}
</script>
<style lang=""></style>
