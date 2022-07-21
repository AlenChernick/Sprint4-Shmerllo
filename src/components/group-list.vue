<template>
  <section class="group-list ">
    <h2>this is group list</h2>
    <Container class="group-container" 
          orientation="horizontal"  
          v-if="groups"        
          group-name="cols" 
          @drop="onDrop($event)">
      <Draggable @mousedown.prevent  v-if="cols"  v-for="col in cols" :key="col.id">
        <group-preview class="group-preview"  :group="col"  />
      </Draggable>
    </Container>
  </section>
</template>
<script>
import groupPreview from "../components/group-preview.vue"
import { Container, Draggable } from "vue3-smooth-dnd"
import { applyDrag } from "../../services/dnd-service.js"

export default {
  name: "group-list",
  props: {
    groups: {
      type: Array,
    },
  },
  data() {
    return {
      cols: [],
    }
  },
  created() {
    this.cols = JSON.parse(JSON.stringify(this.groups))
  },
  methods: {
    onDrop(dropRes) {
      this.cols = applyDrag(this.cols, dropRes)
      this.$store.dispatch({ type: "saveGroups", groups: this.cols })
      console.log("cols", this.cols)
    },
    getChildPayload(idx) {
      return this.cols[idx]
    },
  },
  components: {
    groupPreview,
    Container,
    Draggable,
  },
}
</script>
