<template>
  <section class="group-list">
    <Container
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :drop-placeholder="dropPlaceholderOptions"
      class="group-container"
      orientation="horizontal"
      v-if="groups"
      group-name="cols"
      @drop="onDrop($event)"
    >
      <Draggable v-if="cols" v-for="col in cols" :key="col.id">
        <group-preview class="group-preview" @updateGroup="updateGroups" :group="col" :key="col.id" />
      </Draggable>
      <div class="add-new-group-btn-warp">
        <div
          v-if="!addGroupModal"
          :style="{ color: getTxtColor, getAvgColor, transition: 'color 0.4s' }"
          class="add-new-group-btn flex"
          @click="addGroupModal = !addGroupModal"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="task-adding-btn" />
          <div :style="{ color: getTxtColor, getAvgColor, transition: 'color 0.4s' }" class="add-new-group-list">
            Add another list
          </div>
        </div>
        <div v-else class="new-group-add-modal">
          <textarea
            cols="30"
            rows="1"
            class="new-group-text-area"
            placeholder="Enter list title..."
            v-model="newGroupSubject"
          ></textarea>
          <div class="new-task-add-remove-conteiner flex">
            <el-button class="confirm-btn" type="primary" @click="oneNewGroup()">Add List</el-button>
            <span class="cancel-add-group" @click="addGroupModal = !addGroupModal"></span>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
<script>
import groupPreview from '../components/group-preview.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/dnd-service.js'
import { FastAverageColor } from 'fast-average-color'

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
      addGroupModal: false,
      newGroupSubject: '',
      groupsStack: [],
      txtColor: '',
    }
  },
  async created() {
    this.cols = JSON.parse(JSON.stringify(this.groups))
    this.currBoard = this.$store.getters.getCurrBoard
  },
  methods: {
    onDrop(dropRes) {
      this.cols = applyDrag(this.cols, dropRes)
      this.$store.dispatch({
        type: 'saveGroups',
        groups: this.cols,
        currBoard: this.currBoard,
      })
    },
    getChildPayload(idx) {
      return this.cols[idx]
    },
    oneNewGroup() {
      if (!this.newGroupSubject) return
      this.addGroupModal = !this.addGroupModal
      this.$store.dispatch({
        type: 'saveGroup',
        board: this.currBoard._id,
        subject: this.newGroupSubject,
      })
    },
    updateGroups({ info }) {
      info.group.tasks = info.tasks
      this.groupsStack.push(info.group)

      if (this.groupsStack.length === this.currBoard.groups.length) {
        let boardToUpdate = JSON.parse(JSON.stringify(this.currBoard))
        boardToUpdate.groups = this.groupsStack

        this.$store.dispatch({
          type: 'saveBoard',
          board: boardToUpdate,
        })

        this.groupsStack = []
      }
    },
  },
  computed: {
    dropPlaceholderOptions() {
      return {
        className: 'group-drag',
        animationDuration: '150',
        showOnTop: false,
      }
    },
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
    async getAvgColor() {
      try {
        const imgUrl = await this.getCurrBoard.style.bgImgUrl
        const fac = new FastAverageColor()
        const color = await fac.getColorAsync(imgUrl)
        if (color.isLight) this.txtColor = '#000000'
        else this.txtColor = '#fff'
      } catch (err) {
        console.log('Cannot load avg color', err)
        throw err
      }
    },
    getTxtColor() {
      return this.txtColor
    },
  },
  components: {
    groupPreview,
    Container,
    Draggable,
  },
}
</script>
