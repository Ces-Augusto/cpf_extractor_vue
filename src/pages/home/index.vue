<template>
  <div class="container home-container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-dark text-white py-3">
            <h5 class="mb-0">
              <i class="bi bi-file-earmark-pdf me-2"></i>
              Upload de Documento
            </h5>
          </div>
          <div class="card-body p-4">
            <!-- INPUT ESCONDIDO -->
            <input
              ref="fileInput"
              type="file"
              class="d-none"
              accept="application/pdf"
              @change="handleFile"
            />
            <!-- ÁREA DE UPLOAD -->
            <div
              class="upload-area border-dashed rounded-3 p-5 text-center mb-4"
              @click="openFile"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <h4 class="fw-bold">Arraste seu PDF aqui</h4>
              <p class="text-secondary">
                {{ fileName || 'ou clique para selecionar o arquivo do seu computador' }}
              </p>
            </div>
            <!-- BOTÃO -->
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
  </div>
</template>

<script>
export default {
  name: 'HomePage',

  data () { // Variáveis para armazenar o arquivo e seu nome
    return {
      file: null,
      fileName: null
    }
  },

  methods: { // Função para abrir o seletor de arquivos
    openFile () {
      this.$refs.fileInput.click() // Acessa o input escondido para abrir o seletor de arquivos
    },
    handleFile (event) { // Função para lidar com a seleção de arquivos
      const file = event.target.files[0] // Pega o primeiro arquivo selecionado
      this.setFile(file) // Chama a função para validar e armazenar o arquivo
    },
    handleDrop (event) { // Função para lidar com o evento de arrastar e soltar
      event.preventDefault() // Previne o comportamento padrão de abrir o arquivo no navegador
      const file = event.dataTransfer.files[0]
      this.setFile(file)
    },
    setFile (file) { // Função para validar o arquivo e armazená-lo
      if (!file) return // Se nenhum arquivo for selecionado, sai da função

      if (file.type !== 'application/pdf') { // Verifica se o arquivo é um PDF
        alert('Só é permitido PDF!')
        return
      }
      this.file = file
      this.fileName = file.name
    },
    async uploadFile () {
      if (!this.file) return
      console.log('Iniciando processamento do arquivo:', this.file.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  background-color: var(--light-low);
  min-width: 100vw;
  min-height: calc(100vh - 44px);
  padding: 20px;
  text-align: center;

  .card {
    margin-top: 200px;
    border-radius: 15px;
    max-width: 1500px;
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
}
</style>
