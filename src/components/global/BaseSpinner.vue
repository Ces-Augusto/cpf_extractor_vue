<template>
  <div class="base-spinner fa-2x" v-if="visible">
    Carregando...
    <i class="fas fa-sync fa-spin"></i>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  created () {
    this.$root.$on('Spinner::show', this.alternarSpinner)
    this.$root.$on('Spinner::hide', this.alternarSpinner)
  },
  methods: {
    alternarSpinner () {
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables.scss';

.base-spinner {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100000000;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $dark-medium;
  color: $blood;
  }
</style>
