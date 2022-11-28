import { createApp } from 'vue'
import App from './App.vue'
import './style/index.css'
import router from './router'
import store from './store'
import vClickOutside from "click-outside-vue3"
import { createMetaManager, plugin as vueMetaPlugin } from "vue-meta";

window.prerenderReady = false

const app = createApp(App)
const metaManager = createMetaManager()

// Register a global custom directive called `v-focus`
app.directive('autofocus', {
  // When the bound element is mounted into the DOM...
  mounted (el) {
    // Focus the element
    el.focus()
    // select the text
    el.select()
  }
})

// mount
app
  .use(store)
  .use(router)
  .use(vClickOutside)
  .use(metaManager)
  .use(vueMetaPlugin)
  .mount('#app')
