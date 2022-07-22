import { createRouter, createWebHistory } from 'vue-router'
import homePage from '../views/home-page.vue'
import loginPage from '../views/login-page.vue'
import dashboard from '../views/dashboard.vue'
import boardApp from '../views/board-app.vue'
import boardDetails from '../views/board-details.vue'
import taskEdit from '../views/task-edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: homePage
    },
    {
      path: '/board',
      name: 'board-app',
      component: boardApp,
    },
    {
      path: '/login',
      name: 'login-page',
      component: loginPage,
    },
    {
      path: '/board/:boardId',
      name: 'board-details',
      component: boardDetails,
      children: [
        {
          // /board/YSroYIWD/g101/c102
          path: '/board/:boardId/:groupId/:taskId',
          name: 'task-edit',
          component: taskEdit
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: dashboard
        }
      ]
    },
    // {
    //   path: '/board/edit/:id',
    //   name: 'task-edit',
    //   component: taskEdit,
    // } 
    // {
    //   path: '/board/:boardId/:groupId/:taskId',
    //   name: 'task-edit',
    //   component: taskEdit
    // }
  ]
})

export default router
