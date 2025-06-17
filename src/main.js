import { createApp } from 'vue'
import { Quasar, ClosePopup } from 'quasar'
import App from './App.vue'
import './registerServiceWorker'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {},
  directives: {
    ClosePopup
  }
})

myApp.mount('#app')
