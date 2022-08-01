<template lang="">
  <section class="dashboard">
    <div class="dashboardScreen"></div>
    <div class="main-dashbord">
      <span @click="closeDashboard" class="close-icon"></span>
      <h3>{{ currBoard.title }} Dashboard</h3>
      <div class="dashboard-numbers">
        <div class="task-data total">
          <h3>Total tasks </h3>
          <h4>{{datesData.toatlTasks}}</h4>
        </div>
        <div class="task-data complete">
          <h3 >Complete </h3>
          <h4>{{checkedData.complete}}</h4>         
        </div>
        <div class="task-data due-soon">
          <h3>Due soon </h3>
           <h4>{{datesData.dueSoon}}</h4>              
        </div>
        <div class="task-data over-due">
          <h3>Over due</h3>  
          <h4>{{datesData.overDue}}</h4>       
        </div>
      </div>
      <div class="charts-container">
        <!-- <div class="doughnut-chart">
          <h4>Timeline overview</h4>
          <DoughnutChart :chartData="datesData" />
        </div>
        <div class="doughnut-chart">
          <h4>Exacution status</h4>
          <DoughnutChart :chartData="checkedData" />
        </div> -->
        <div class="bar-chart">
          <h4>Tasks per list</h4>
          <BarChart :chartData="tasksListLoad" :options="optionsY" />
        </div>
        <div class="bar-chart">
          <h4>Load per team-member</h4>
          <BarChart :chartData="memberLoadData" :options="optionsX" />
        </div>
        <div class="pie-chart">
          <h4>Tasks per label</h4>
          <PieChart :chartData="labelLoadData" :options="optionsZ" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { BarChart, PieChart, DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
export default {
  name: 'dashboard',
  data() {},
  methods: {
    closeDashboard() {
      this.$router.push(`/board/${this.currBoard._id}`)
    },
  },
  computed: {
    currBoard() {
      return this.$store.getters.getCurrBoard
    },
    optionsX() {
      return {
        indexAxis: 'x',
        skipNull: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
        },
      }
    },
    optionsY() {
      return {
        indexAxis: 'y',
        skipNull: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
        },
      }
    },
    optionsZ() {
      return {
        indexAxis: 'y',
        skipNull: true,
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
        },
      }
    },
    memberLoadData() {
      const board = this.currBoard
      let tasksPerMember = { Unassigned: 0 }
      board.groups.forEach((group, idx) => {
        group.tasks.forEach((task) => {
          if (!task.members.length) tasksPerMember['Unassigned']++
          else {
            task.members.forEach((member) => {
              if (Object.keys(tasksPerMember).includes(member.fullname)) tasksPerMember[member.fullname]++
              else tasksPerMember[member.fullname] = 1
            })
          }
        })
      })
      return {
        labels: Object.keys(tasksPerMember),
        datasets: [
          {
            data: Object.values(tasksPerMember),
            backgroundColor: ['#264653', '#2a9d8f', '#e63946'],
          },
        ],
      }
    },
    labelLoadData() {
      const board = this.currBoard
      const labelsArray = board.boardLabels
      let tasksPerLabel = { Unlabeled: 0 }
      board.groups.forEach((group, idx) => {
        group.tasks.forEach((task) => {
          if (!task.labelIds.length) tasksPerLabel['Unlabeled']++
          else {
            task.labelIds.forEach((label) => {
              const key = labelsArray.find((l) => l.id === label)
              if (Object.keys(tasksPerLabel).includes(label)) {
                tasksPerLabel[key.txt]++
              } else tasksPerLabel[key.txt] = 1
            })
          }
        })
      })
      return {
        labels: Object.keys(tasksPerLabel),
        datasets: [
          {
            data: Object.values(tasksPerLabel),
            backgroundColor: [
              '#277da1',
              '#577590',
              '#4d908e',
              '#82CCDD',
              '#43aa8b',
              '#90be6d',
              '#f9c74f',
              '#f9844a',
              '#f8961e',
              '#f3722c',
              '#f94144',
            ],
          },
        ],
      }
    },
    tasksListLoad() {
      const board = this.currBoard
      let tasksPerGroup = {}
      board.groups.forEach((group, idx) => {
        tasksPerGroup[group.title] = group.tasks.length
      })
      return {
        labels: Object.keys(tasksPerGroup),
        datasets: [
          {
            data: Object.values(tasksPerGroup),
            backgroundColor: ['#264653', '#2a9d8f', '#e63946', "#84a59d", "#335c67"],
          },
        ],
      }
    },
    datesData() {
      const board = this.currBoard
      let tasksDue = { toatlTasks: 0, dueUnassigned: 0, overDue: 0, dueSoon: 0, onTrack: 0 }
      board.groups.forEach((group, idx) => {
        group.tasks.forEach((task) => {
          if (!task.dueDate) {
            tasksDue.dueUnassigned++
            tasksDue.toatlTasks++
          } 
          else {
            const due = Date.parse(task.dueDate)
            if (due > Date.now()) {
              tasksDue.overDue++
              tasksDue.toatlTasks++
            }  
            else if (due > Date.now() + 3 * 24 * 60 * 60 * 1000) {
              tasksDue.dueSoon++
              tasksDue.toatlTasks++
            }
            else {
              tasksDue.onTrack++
              tasksDue.toatlTasks++
            }  
          }
        })
      })
      return tasksDue

        // labels: Object.keys(tasksDue),
        // datasets: [
        //   {
        //     data: Object.values(tasksDue),
        //     backgroundColor: ['#264653', '#2a9d8f', '#e63946', "#84a59d", "#335c67"],
        //   },
        // ],
      // }
    },
    checkedData() {
      const board = this.currBoard
      let checkedData = { complete: 0, uncomplete: 0 }
      board.groups.forEach((group, idx) => {
        group.tasks.forEach((task) => {
          if (!task.checklists.length) return
          else {
            task.checklists.forEach((checklist) => {
              checklist.todos.forEach((todo) => {
                if (todo.isDone) checkedData['complete']++
                else checkedData['uncomplete']++
              })
            })
          }
        })
      })
      return checkedData
      // return {
      //   labels: Object.keys(checkedData),
      //   datasets: [
      //     {
      //       data: Object.values(checkedData),
      //       backgroundColor: ['#6AB187', '#7E909A'],
      //     },
      //   ],
      //   title: {
      //     display: true,
      //     text: 'Chart.js Doughnut Chart',
      //   },
      // }
    },
  },
  components: { BarChart, PieChart, DoughnutChart },
}
</script>
<style lang=""></style>