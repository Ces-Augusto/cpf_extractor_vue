<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-dark text-white py-3">
          <h5 class="mb-0">
            Upload de Documento
          </h5>
        </div>
        <div class="card-body p-4">
          <input
            :key="inputKey"
            ref="fileInput"
            type="file"
            class="d-none"
            accept="application/pdf"
            @change="handleFile"
          />
          <div
            class="upload-area border-dashed rounded-3 p-5 text-center mb-4"
            @click="openFile"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <h4 class="fw-bold">Arraste seu PDF aqui</h4>
            <p class="text-secondary">
              {{ fileName || 'ou clique para selecionar o arquivo' }}
            </p>
          </div>
          <div class="d-grid">
            <button
              class="btn btn-lg shadow-sm"
              :disabled="!file"
              @click="uploadFile"
              style="background-color: var(--blood-dark); border: none; color: white;"
            >
              Extrair CPFs
            </button>
          </div>
        </div>
        <div class="card-footer bg-light text-center py-3">
          <small class="text-muted">
            Formatos aceitos: .pdf (Máx. 10MB)
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PdfUpload',
  data () {
    return {
      file: null,
      fileName: null,
      inputKey: Date.now() // 💣 evita bug do input file
    }
  },
  methods: {
    openFile () {
      this.$refs.fileInput.click()
    },
    handleFile (event) {
      const file = event.target.files[0]
      this.setFile(file)
    },
    handleDrop (event) {
      const file = event.dataTransfer.files[0]
      this.setFile(file)
    },
    setFile (file) {
      if (!file) return

      if (file.type !== 'application/pdf') {
        alert('Só PDF!')
        return
      }
      this.file = file
      this.fileName = file.name
    },
    async uploadFile () {
      if (!this.file) return
      try {
        console.log('Processando:', this.file.name)
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (e) {
        console.error(e)
      } finally {
        this.resetInput()
      }
    },
    resetInput () {
      this.file = null
      this.fileName = null
      this.inputKey = Date.now()
    }
  },
  beforeDestroy () {
    this.resetInput()
  }
}
</script>
<style lang="scss" scoped>
.card {
  margin-top: 100px;
  border-radius: 15px;
  max-width: 1500px;
  .card-body {
    color: var(--blood-dark);
  }
}
.upload-area {
  border: 2px dashed #999;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
    border-color: var(--blood-dark);
  }
}
</style>
