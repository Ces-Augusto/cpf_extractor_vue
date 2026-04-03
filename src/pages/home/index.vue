<template>
  <div class="container home-container">
    <h1>CPF EXTRACTOR</h1>
    <p>Envie seus PDFs aqui. Os arquivos serão armazenados <br> e os CPFs serão extraídos automaticamente.</p>
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
  h1 {
    font-weight: bold;
    margin-top: 30px;
    font-size: xx-large;
    color: var(--blood-dark);
  }
  p {
    font-size: large;
    margin-top: 30px;
  }
</style>
