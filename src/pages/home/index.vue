<template>
  <div class="container home-container">
    <h1>HOME</h1>
    <PdfUpload />
  </div>
</template>

<script>
import PdfUpload from '@/components/upload/PdfUpload.vue'

export default {
  name: 'Home',
  components: {
    PdfUpload
  }
}

</script>

<style lang="scss" scoped>

</style>
