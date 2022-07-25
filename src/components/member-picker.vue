<template lang="">


  <section class="actions-modal-container member-picker">
    <h4>Members</h4>
    <span  @click.stop="closeModal" class="close-icon"></span>
    <ul class="clean-list" v-for="member in membersToEdit">
        <li class="member-picker-list" @click.stop="toggleMember(member)" > 
        <img :src="member.imgUrl"/>
       <h5>{{member.fullname}}</h5>
        </li>
    </ul>
  </section>

    
</template>
<script>
export default {
  name: 'member-picker',
  data() {
    return {
      membersToEdit: null,
    }
  },
  methods: {
    toggleMember(member){
      console.log(member)
      this.$emit('toggleMember', member)
    },
    closeModal(){
      this.$emit("closeModal")
    }
   
  },
  created(){
    this.membersToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.members))
  },
  computed: {
    
  },
}
</script>
<style lang=""></style>
