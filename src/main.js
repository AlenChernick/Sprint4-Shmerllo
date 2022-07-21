import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'


import './assets/styles/styles.scss'

library.add(fas, far, fab)
const app = createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
