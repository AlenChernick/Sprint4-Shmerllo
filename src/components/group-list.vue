<template>
  <section class="group-list">
    <Container class="group-container" :drop-placeholder="dropPlaceholderOptions" orientation="horizontal" v-if="groups" group-name="cols" @drop="onDrop($event)">
      <!-- <Draggable @mousedown.prevent v-if="cols" v-for="col in cols" :key="col.id"> -->
            <Draggable  v-if="cols" v-for="col in cols" :key="col.id">
        <group-preview class="group-preview" :group="col" :key="col.id" />
      </Draggable>
    </Container>
  </section>
</template>
<script>
import groupPreview from '../components/group-preview.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/dnd-service.js'

export default {
  name: 'group-list',
  props: {
    groups: {
      type: Array,
    },
  },
  data() {
    return {
      cols: [],
      currBoard: {},
    }
  },
  async created() {
    this.cols = JSON.parse(JSON.stringify(this.groups))
    this.currBoard = this.$store.getters.getCurrBoard
  },
  methods: {
    onDrop(dropRes) {
      this.cols = applyDrag(this.cols, dropRes)
      this.$store.dispatch({ type: 'saveGroups', groups: this.cols ,currBoard:this.currBoard})
    },
    getChildPayload(idx) {
      return this.cols[idx]
    },
  },
  computed:{
    dropPlaceholderOptions(){
      return {
        className:"group-drag",
        animationDuration:"188",
        showOnTop:false,

      }
    }
  },
  components: {
    groupPreview,
    Container,
    Draggable,
  },
}
</script>
