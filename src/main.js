import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../src/assets/scss/app.scss'
import BaseSpinner from './components/global/BaseSpinner.vue'

Vue.component('base-spinner', BaseSpinner)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
