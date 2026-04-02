<template>
  <div class="base-spinner">
    <h1>Carregando... </h1>
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
  color: var(--blood);
}

</style>
