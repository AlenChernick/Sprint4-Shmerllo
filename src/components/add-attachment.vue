<template lang="">

  

  <section class="actions-modal-container add-attachment">
    <h4>Attach from...</h4>
    <span  @click.stop="closeModal" class="close-icon"></span>
    <h4 class="attach-from"> Computer</h4>
    
  
    <!-- <input type="file" name="filename" class="file-input btn"   @change="uploadAttachment"> -->
    
    <h4 class="attach-link-txt">Attach a link </h4>
    <input autofocus spellcheck="false" placeholder="Paste any link here..." v-model="attachment.url" type="text" />
    <button @click="addAttachment">Attach</button>
  
   
  </section>

    
</template>
<script>
export default {
  name: 'add-attachment',
  data() {
    return {
       attachment: {
        url:'',
        fileData:{},

       }, 
    }
  },
  methods: {
    addAttachment(){
      console.log('attching', this.attachment)
      this.$emit('addAttachment', this.attachment)
    },
    closeModal(){
      this.$emit("closeModal")
    },
    // uploadAttachment(ev){
    //   console.log(ev.target.files[0])
    //   this.attachment.fileData = ev.target.files[0]
    //   console.log(this.attachment)
    //   this.$emit('addAttachment', this.attachment)
    // }

   
  },
  created(){
    // this.membersToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.members))
  },
  computed: {
    
  },
}
</script>
<style lang=""></style>
