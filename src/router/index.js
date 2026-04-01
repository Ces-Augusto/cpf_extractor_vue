import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home/index.vue'
import ListaCpf from '../pages/listaCpf/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Enviar Pdf',
    component: Home
  },
  {
    path: '/listaCpf',
    name: 'Lista de CPFs',
    component: ListaCpf
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
