<template lang="">
  <section class="actions-modal-container date-picker">
    <h4>Dates</h4>
    <span @click.stop="closeModal" class="close-icon"></span>
    <!-- <div class="main-task-edit-btn"> -->
    <div class="date-picker-container">
      <Datepicker v-model="dateValue" inline autoApply />
      <!-- <el-date-picker v-model="dateValue" type="date" placeholder="Pick a day" /> -->
      <el-button @click="setDate" @click.stop="closeModal">Save</el-button>
      <el-button @click="closeModal">Remove</el-button>
    </div>
    <!-- </div> -->
  </section>
</template>
<script>
export default {
  name: 'date-picker',
  data() {
    return {
      dateValue: new Date().toLocaleDateString(),
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    setDate() {
      console.log('dateValue', this.dateValue)

      this.$emit('setDate', this.dateValue)
    },
  },
  created() {},
  computed: {},
}
</script>
<style lang=""></style>
