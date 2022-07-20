<template lang="">
  <section class="group-list">
    <h2>this is group list</h2>
    <Container   @drop="onDrop">
      <Draggable class="group-conteiner">
        <group-preview v-for="group in groups" :group="group" :key="group.id" />
      </Draggable>
      </Container>
  </section>
</template>
<script>
import groupPreview from '../components/group-preview.vue'
import { Container, Draggable } from "vue3-smooth-dnd"

export default {
  name: "group-list",
  props: {
    groups: {
      type: Array,
    },
  },
    methods: {  
    onDrop(dropResult){
      console.log(dropResult);
      this.groups = this.applyDrag(this.groups, dropResult);
    },
    applyDrag(arr, dragResult){
      const { removedIndex, addedIndex, payload } = dragResult;

      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;
      
      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      console.log(result);
      return result;
    }
  },
  components: {
    groupPreview,
    Container,
    Draggable,
  },
}
</script>
