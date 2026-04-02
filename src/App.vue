<template>
  <div id="app">
    <layouts-navigations/>
    <keep-alive include="Home">
      <router-view/>
    </keep-alive>
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
  min-height: 100Vh;
  text-align: center;
}
</style>
