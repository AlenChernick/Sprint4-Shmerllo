<template>
  <button class="notification-btn" @click="openNotifications">
    <font-awesome-icon icon="fa-solid fa-bell" />
    <span v-if="getNewNotifications !== 0" class="new-notification">{{ getNewNotifications }}</span>
  </button>
  <section :style="{ display: displayNotifications }" class="notifications">
    <span @click="displayNotifications = 'none'" class="close-icon"></span>
    <h4>Notifications</h4>
    <h5 v-if="getNewNotifications === 0">No new notifications...</h5>
    <div class="notification-details" v-for="notification in getUserNotifications"  @click="openTaskDetails(notification)">
      <img v-if="notification.style.bgImgUrl" :src="notification.style.bgImgUrl" />
      <div
        v-if="notification.style.bgColor && !notification.style.bgImgUrl"
        class="cover-color"
        :style="{ 'background-color': notification.style.bgColor }"
      ></div>
      <h5>{{ notification.mentionedBy }}</h5>
      <h4>{{ getUserAction(notification) }}</h4>
      <h3 @click="openTaskDetails(notification)">{{ notification.taskTitle }}</h3>
      <p>{{ timeFormat(notification.time) }}</p>
    </div>
  </section>
</template>
<script>
import moment from 'moment'
import { socketService, SOCKET_EVENT_MENTION } from '../../services/socket.service'
export default {
  name: 'notification',
  data() {
    return {
      displayNotifications: 'none',
    }
  },
  created() {
    socketService.on(SOCKET_EVENT_MENTION, this.addNotification)
  },
  methods: {
    addNotification(notification) {
      this.$store.commit({ type: 'addNotification', notification })
    },
    getUserAction(notification) {
      if (notification.userAction === 'Added member') return 'Added you to'
      if (notification.userAction === 'Removed member') return 'Removed you from'
    },
    timeFormat(time) {
      return moment(time).fromNow()
    },
    openNotifications() {
      this.displayNotifications = 'block'
      this.$store.commit({ type: 'cleanNotification' })
    },
    openTaskDetails(notification) {
      this.$router.push(`/board/${notification.boardId}/${notification.groupId}/${notification.taskId}`)
      this.displayNotifications = 'none'
    },
  },
  computed: {
    getUserNotifications() {
      return this.$store.getters.getUserNotifications
    },
    getNewNotifications() {
      return this.$store.getters.getNewNotifications
    },
  },
}
</script>
<style lang=""></style>
