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
            <p class="text-secondary mb-0">
              {{ fileName || 'ou clique para selecionar o arquivo' }}
            </p>
          </div>
          <div class="d-grid">
            <button
              class="btn btn-lg shadow-sm"
              :disabled="!file || isProcessing"
              @click="processPdf"
              style="background-color: var(--blood-dark); border: none; color: white;"
            >
              {{ isProcessing ? 'Processando PDF...' : 'Extrair CPFs' }}
            </button>
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-4 mb-0">
            {{ errorMessage }}
          </div>
        </div>
        <div class="card-footer bg-light text-center py-3">
          <small class="text-muted">
            Formatos aceitos: .pdf (Máx. 10MB)
          </small>
        </div>
      </div>
      <div
        v-if="processedFileName"
        class="card shadow-sm border-0 mt-4"
      >
        <div class="card-header bg-dark text-white py-3">
          <h5 class="mb-0">Último arquivo processado</h5>
        </div>
        <div class="card-body p-4">
          <p class="mb-3">
            <strong>Nome do arquivo:</strong> {{ processedFileName }}
          </p>
          <p class="mb-3">
            <strong>Quantidade de CPFs encontrados:</strong> {{ cpfAnalysis.length }}
          </p>
          <div v-if="cpfAnalysis.length">
            <div
              v-for="(item, index) in cpfAnalysis"
              :key="`${item.cleanCpf}-${index}`"
              class="cpf-result-item d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2"
            >
              <span>{{ item.cpf }}</span>

              <span
                class="badge"
                :class="item.valid ? 'bg-success' : 'bg-danger'"
              >
                {{ item.message }}
              </span>
            </div>
          </div>
          <div v-else class="alert alert-warning mb-0">
            Nenhum CPF foi encontrado neste arquivo.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { extractTextFromPdf } from '@/services/pdf/pdfService'
import { normalizeText, getCpfAnalysis } from '@/services/cpf/cpfService'
import { processPdfUpload } from '@/services/upload/uploadHistoryService'

export default {
  name: 'PdfUpload',
  data () {
    return {
      file: null,
      fileName: null,
      inputKey: Date.now(),
      isProcessing: false,
      errorMessage: '',
      extractedText: '',
      processedFileName: '',
      cpfAnalysis: []
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

      this.errorMessage = ''

      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Apenas arquivos PDF são permitidos.'
        return
      }

      const maxSizeInBytes = 10 * 1024 * 1024

      if (file.size > maxSizeInBytes) {
        this.errorMessage = 'O arquivo excede o limite de 10MB.'
        return
      }

      this.file = file
      this.fileName = file.name
    },

    async processPdf () {
      if (!this.file) return

      this.isProcessing = true
      this.errorMessage = ''

      try {
        const text = await extractTextFromPdf(this.file)

        console.log('Texto original:', text)
        console.log('Texto normalizado:', normalizeText(text))

        this.extractedText = text
        this.cpfAnalysis = getCpfAnalysis(text)
        this.processedFileName = this.file.name

        const validCpfs = this.cpfAnalysis.filter(item => item.valid)

        await processPdfUpload({
          file: this.file,
          validCpfs
        })

        this.resetInput()
      } catch (error) {
        console.error('Erro ao processar PDF:', error)
        this.errorMessage = 'Não foi possível processar e salvar o PDF. Verifique se ele contém texto selecionável.'
      } finally {
        this.isProcessing = false
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
  margin-top: 50px;
  border-radius: 5px;
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
    background-color: rgba(0, 0, 0, 0.329);
    border-color: var(--blood-dark);
  }
}

.cpf-result-item {
  background-color: #fff;
}
</style>
