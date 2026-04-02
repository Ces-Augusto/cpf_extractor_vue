import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Enviar Pdf',
    meta: {
      icon: 'upload', title: 'Enviar Pdf'
    },
    component: () => import(/* webpackChunkName: *home* */ '../pages/home/index.vue')
  },
  {
    path: '/listaCpf',
    name: 'Lista de CPFs',
    meta: {
      icon: 'list-ul', title: 'Lista de CPFs'
    },
    component: () => import(/* webpackChunkName: *listaCpf* */'../pages/listaCpf/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title}`
    : 'CPF Extractor'
})

export default router
