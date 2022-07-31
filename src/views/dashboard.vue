<template lang="">
  <section class="dashboard">
    <div class="dashboardScreen"></div>
    <div class="main-dashbord">
      <span @click="closeDashboard" class="close-icon"></span>
      <h3>Board "{{currBoard.title}}" in numbers</h3>

      <div class="charts-container">
        
        <div class="doughnut-chart">
          <h4>Timeline overview</h4>
          <DoughnutChart :chartData="datesData"/>
        </div>
        <div class="doughnut-chart">
          <h4>Exacution status </h4>
          <DoughnutChart :chartData="checkedData" />
        </div>
        <div class="bar-chart">
          <h4>Cards per list</h4>
           <BarChart :chartData="tasksListLoad" :options="optionsY" />     
        </div>
         <div class="bar-chart">
          <h4>Load per team-member</h4>
           <BarChart :chartData="memberLoadData" :options="optionsX"/>     
        </div>
         <div class="bar-chart">
          <h4>Cards per label</h4>
           <BarChart :chartData="labelLoadData" :options="optionsX"/>       
        </div>
      </div>
   
    </div>

  </section>
</template>
<script>
import {  BarChart, PieChart, DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: 'dashboard',
  data(){
  
  },
  methods:{
    closeDashboard(){
      this.$router.push(`/board/${this.currBoard._id}`)
    }

  },
  computed:{
    currBoard(){
      return this.$store.getters.getCurrBoard
    },
    optionsX(){
      return {
        indexAxis: 'x',
        skipNull: true,
        plugins: {
          legend: {
            display: false,
            position: "top",
          }
        }
      }
    },
    optionsY(){
      return {
        indexAxis: 'y',
        skipNull: true,
        plugins: {
          legend: {
            display: false,
            position: "top",
          }
        }
      }
    },
    memberLoadData(){
      const board = this.currBoard
      let tasksPerMember = {'Unassigned': 0}
      board.groups.forEach((group, idx) =>{
        group.tasks.forEach((task) =>{
          if (!task.members.length) tasksPerMember['Unassigned']++
          else {
            task.members.forEach(
              (member) =>{
                if (Object.keys(tasksPerMember).includes(member.fullname)) tasksPerMember[member.fullname]++
                else (tasksPerMember[member.fullname] = 1)
              }
            )
          }
        })
      }
      ) 
      return {
      labels: Object.keys(tasksPerMember),
      datasets: [
        {
          data: Object.values(tasksPerMember),
          backgroundColor: ['#1C4E80',  '#DBAE58', '#A5D8DD', '#488A99', '#0091D5', '#6AB187', '#DBAE58' ],
        },
      ]
      }
    },
    labelLoadData(){
      const board = this.currBoard
      const labelsArray = board.boardLabels
      let tasksPerLabel = {'Unlabeled': 0}
      board.groups.forEach((group, idx) =>{
        group.tasks.forEach((task) =>{
          if (!task.labelIds.length) tasksPerLabel['Unlabeled']++
          else {
            task.labelIds.forEach(
              (label) =>{
                const key = labelsArray.find((l)=> l.id === label)
                if (Object.keys(tasksPerLabel).includes(label)) {
                  tasksPerLabel[key.txt]++
                }
                else (tasksPerLabel[key.txt] = 1)
              }
            )
          }
        })
      }
      ) 
      return {
      labels: Object.keys(tasksPerLabel),
      datasets: [
        {
          data: Object.values(tasksPerLabel),
          backgroundColor:['#1C4E80',  '#DBAE58', '#A5D8DD', '#488A99', '#0091D5', '#6AB187', '#DBAE58' ],
        },
      ]
      }
    },
    tasksListLoad(){
      const board = this.currBoard
      let tasksPerGroup = {}
      board.groups.forEach((group, idx) =>{
        tasksPerGroup[group.title] = group.tasks.length
        }
      ) 
      return {
      labels: Object.keys(tasksPerGroup),
      datasets: [
        {
          data: Object.values(tasksPerGroup),
          backgroundColor:['#1C4E80',  '#DBAE58', '#A5D8DD', '#488A99', '#0091D5', '#6AB187', '#DBAE58' ],
        },
      ],
      }
    },
    datesData(){
      const board = this.currBoard
      let tasksDue = {'Date unassigned': 0, 'Over due': 0, 'Due soon' :0, 'On track': 0}
      board.groups.forEach((group, idx) =>{
        group.tasks.forEach((task) =>{
          if (!task.dueDate) tasksDue['Date unassigned']++
          else{
            const due = Date.parse(task.dueDate)
            if (due > Date.now() ) tasksDue['Over due']++
            else if (due > Date.now() + 3*24*60*60*1000 ) tasksDue['Due soon']++
            else tasksDue ['On track']++
          }
        })
      }
      ) 
      return {
      labels: Object.keys(tasksDue),
      datasets: [
        {
          data: Object.values(tasksDue),
          backgroundColor: ['#7E909A',  '#e63946', '#EA6A47', '#70e000'],
        },
      ]
      }
    },
    checkedData(){
      const board = this.currBoard
      let checkedData = {'Complete': 0, 'Uncomplete' :0}
      board.groups.forEach((group, idx) =>{
        group.tasks.forEach((task) =>{
          if (!task.checklists.length) return
          else {
            task.checklists.forEach(
              (checklist) =>{
                checklist.todos.forEach(
                  (todo) => {
                    if (todo.isDone) checkedData['Complete']++
                    else checkedData['Uncomplete']++
                  }
                )
              }
            )
          }
        })
      }
      ) 
      return {
      labels: Object.keys(checkedData),
      datasets: [
        {
          data: Object.values(checkedData),
          backgroundColor: ['#70e000', '#7E909A'],
        },
      ],
      title: {
          display: true,
          text: 'Chart.js Doughnut Chart',
        },
     
      }

    }
  },
  components: {  BarChart, PieChart, DoughnutChart },
}
</script>
<style lang=""></style>
