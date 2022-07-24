<template lang="">

  <!-- <div @click.stop="displayLabelPicker='block'" class="main-task-edit-btn">
     <span class="labels-icon"></span>
     Labels
  </div> -->

   <!-- <section class="label-picker" :style="{ display: displayModal }">
    <h4>Labels</h4>
    <span  @click.stop=closeModal()" class="close-icon"></span>
    <ul class="clean-list" v-for="label in labelsToEdit">
        <li  @click="toggleLabel(label.id)" :style="{ 'background-color': label.bgColor }"> 
        <input @input="editLabels" v-model="label.txt"/>
        </li>
    </ul>
  </section> -->
  
  <section class="label-picker" >
    <h4>Labels</h4>
    <span  @click.stop="closeModal" class="close-icon"></span>
    <ul class="clean-list" v-for="label in labelsToEdit">
        <li  @click="toggleLabel(label.id)" :style="{ 'background-color': label.bgColor }"> 
        <input @input="editLabels" v-model="label.txt"/> 
        </li>
    </ul>
  </section>

    
</template>
<script>
export default {
  name: 'label-picker',
 
  data() {
    return { 
      labelsToEdit: null,
  
    }
  },
  methods: {
    toggleLabel(labelId){
      console.log(labelId)
      this.$emit('toggleLabel', labelId)
    },
    editLabels(){
      console.log(this.labelsToEdit)
      this.$store.dispatch({type:'editLabels', labels: this.labelsToEdit})    
    },
    closeModal(){
      this.$emit("closeModal")
    }
  },
  created(){
    this.labelsToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.boardLabels))
  },
  computed: {
    labels(){
      return this.$store.getters.getCurrBoard.boardLabels
    }
    
  },
}
</script>
<style lang=""></style>
