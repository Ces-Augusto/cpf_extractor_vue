<template>
  <div id="app">
    <div v-if="globalLoading" class="login-spinner">
      <base-spinner/>
    </div>
    <layouts-navigations v-if="isLogged"/>
    <div :class="{ 'container-fluid': isLogged }">
      <router-view/>
    </div>
  </div>
</template>

<script>
import LayoutsNavigations from './components/layout/LayoutsNavigations.vue'
import BaseSpinner from './components/global/BaseSpinner'

export default {
  name: 'App',
  components: {
    LayoutsNavigations,
    BaseSpinner
  },
  data: () => ({
    isLogged: false,
    globalLoading: true
  }),
  created () {
    this.$root.$on('Spinner::show', () => {
      this.globalLoading = true
    })
    this.$root.$on('Spinner::hide', () => {
      this.globalLoading = false
    })
  },
  mounted () {
    this.$firebase.auth().onAuthStateChanged(user => {
      window.uid = user ? user.uid : null
      this.isLogged = !!user

      this.$router.push({ name: user ? 'Enviar Pdf' : 'login' }).catch(() => {})

      setTimeout(() => {
        this.$root.$emit('Spinner::hide')
      }, 300)
    })
  }
}
</script>

<style lang="scss">
#app {
  background-color: var(--light-medium);
  min-width: 100vw;
  min-height: 100vh;
  text-align: center;
}

.login-spinner{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--light-medium);
  z-index: 9999;
}
</style>
