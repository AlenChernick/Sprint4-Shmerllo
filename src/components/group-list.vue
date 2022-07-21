<template>
  <section class="group-list ">
    <h2>this is group list</h2>
    <Container class="group-container" orientation="horizontal"  v-if="groups" :get-child-payload="getChildPayload" group-name="1" @drop="onDrop($event)">
     <!-- <Draggable @mousedown.prevent class="group-preview" v-if="items"  v-for="item in items" :key="item.id"> -->
      <Draggable @mousedown.prevent  v-if="items"  v-for="item in items" :key="item.id">
        <group-preview class="group-preview"  :group="item"  />
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
  // props:['groups'],
  props: {
    groups: {
      type: Array,
    },
  },
  data() {
    return {
      items: [],
    }
  },
  created() {
    this.items = JSON.parse(JSON.stringify(this.groups))
  },
  methods: {
    onDrop(dropRes) {
      this.items = applyDrag(this.items, dropRes)
      this.$store.dispatch({ type: "saveGroups", groups: this.items })
      // console.log("items", this.items)
    },
    getChildPayload(idx) {
      return this.items[idx]
    },
  },
  components: {
    groupPreview,
    Container,
    Draggable,
  },
}
</script>
