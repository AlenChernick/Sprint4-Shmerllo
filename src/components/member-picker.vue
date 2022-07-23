<template lang="">

    <div  @click.stop="displayMemberPicker='block'" class="main-task-edit-btn">
          <span class="members-icon"></span>
          Members    

  <section class="member-picker" :style="{ display: displayMemberPicker }">
    <h4>Members</h4>
    <span  @click.stop="displayMemberPicker='none'" class="close-icon"></span>
    <ul class="clean-list" v-for="member in membersToEdit">
        <li  @click="toggleMember(member)" > 
        <img :src="member.imgUrl"/>
       <h5>{{member.fullname}}</h5>
        </li>
    </ul>
  </section>
  </div>

    
</template>
<script>
export default {
  name: 'label-picker',
  data() {
    return {
      displayMemberPicker: 'none',
      membersToEdit: null,
    
    }
  },
  methods: {
    toggleMember(member){
      console.log(member)
      this.$emit('toggleMember', member)
    },
   
  },
  created(){
    this.membersToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.members))
  },
  computed: {
    
  },
}
</script>
<style lang=""></style>
