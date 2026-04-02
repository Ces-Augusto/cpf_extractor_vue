<template>
  <div class="base-spinner">
    <h1>Carregando.. </h1>
    <i class="fas fa-circle-notch fa-spin"></i>
  </div>
</template>

<script>
export default {
  name: 'BaseSpinner'
}
</script>

<style lang="scss" scoped>
.base-spinner {
  background-color: var(--translucent-dark);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(90vh - 600px);
  color: var(--blood);
  font-size: 2rem;
}
</style>
