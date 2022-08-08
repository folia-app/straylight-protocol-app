import { createApp } from 'vue'
import App from './App.vue'
import './style/index.css'
import router from './router'
import store from './store'

const app = createApp(App)

// mount
app.use(store).use(router).mount('#app')
