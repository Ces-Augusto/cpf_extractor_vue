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
  background-color: var(--light-medium);
  min-width: 100vw;
  min-height: calc(100vh - 44px);
  text-align: center;
}
</style>
