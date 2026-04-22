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
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      icon: 'sign-in-alt',
      title: 'Login'
    },
    component: () => import(/* webpackChunkName: "login" */ '../pages/login/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Carregando'} - Expenses`

  if (!window.uid && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
