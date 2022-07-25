<template lang="">
 

  <section class="actions-modal-container date-picker">
    <h4>date-picker</h4>
    <span  @click.stop="closeModal" class="close-icon"></span>
    <!-- <ul class="clean-list" v-for="member in membersToEdit">
        <li  @click="toggleMember(member)" > 
        <img :src="member.imgUrl"/>
       <h5>{{member.fullname}}</h5>
        </li>
    </ul> -->
  </section>

    
</template>
<script>
export default {
  name: 'date-picker',
  data() {
    return {
    //   membersToEdit: null,
    }
  },
  methods: {
    // toggleMember(member){
    //   console.log(member)
    //   this.$emit('toggleMember', member)
    // },
    closeModal(){
      this.$emit("closeModal")
    }
   
  },
  created(){
    // this.membersToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.members))
  },
  computed: {
    
  },
}
</script>
<style lang=""></style>
