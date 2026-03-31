<template>
  <div id="app">
    <base-spinner/>
    <layouts-navigations/>
    <router-view/>
  </div>
</template>

<script>
import LayoutsNavigations from './components/layout/LayoutsNavigations.vue'

export default {
  name: 'App',
  components: {
    LayoutsNavigations
  }
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: var(--dark);
}
</style>
