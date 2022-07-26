<template lang="">
  <section class="actions-modal-container date-picker">
    <h4>Dates</h4>
    <span @click.stop="closeModal" class="close-icon"></span>
    <!-- <div class="main-task-edit-btn"> -->
    <div class="date-picker-container">
      <Datepicker class="date-picker-input" v-model="dateValue" inline autoApply />
      <!-- <el-date-picker v-model="dateValue" type="date" placeholder="Pick a day" /> -->
      <div class="date-picker-btn-container">
        <el-button class="save-btn confirm-btn" type="primary" @click="setDate" @click.stop="closeModal"
          >Save</el-button
        >
        <el-button class="btn outter-task-btn" type="info" @click="removeDate" @click.stop="closeModal"
          >Remove</el-button
        >
      </div>
    </div>
    <!-- </div> -->
  </section>
</template>
<script>
export default {
  name: 'date-picker',
  data() {
    return {
      dateValue: new Date(),
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    removeDate() {
      this.$emit('removeDate')
    },
    setDate() {
      this.$emit('setDate', this.dateValue)
    },
  },
  created() {},
  computed: {},
}
</script>
<style lang=""></style>
