<template>
  <div class="row justify-content-center">
    <div class="col-md-10 col-lg-9">
      <div class="card">
        <div class="card-header mb-0">
          <h1 class="text mb-0">
            Lista de CPFs Extraídos
          </h1>
        </div>
        <div class="card-body p-4">
          <p class="text-secondary mb-4">
            Aqui estão todos os CPFs armazenados no banco
          </p>
          <div v-if="loading" class="spinner-wrapper">
            <base-spinner />
          </div>
          <div v-else-if="cpfHistory.length" class="table-responsive">
            <table class="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th>CPF</th>
                  <th>Arquivo</th>
                  <th>Data</th>
                  <th>Deletar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cpfHistory" :key="item.id">
                  <td>{{ item.cpf }}</td>
                  <td>{{ item.fileName || '-' }}</td>
                  <td>{{ formatDate(item.createdAt) }}</td>
                  <td><button class="btn btn-danger" @click="deleteCpf(item.id, item.uploadId)">
                    <i class="fas fa-trash">
                  </i></button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state">
            Nenhum CPF encontrado no banco.
          </div>
        </div>
        <div class="card-footer bg-light text-center py-3">
          <small class="text-muted">
            Total de registros: {{ cpfHistory.length }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getAllCpfHistory, deleteCpfHistory } from '@/services/cpf/cpfHistoryService'
import { deleteUploadHistory } from '@/services/upload/uploadHistoryService'

export default {
  name: 'showCpf',

  data () {
    return {
      loading: false,
      cpfHistory: []
    }
  },

  async created () {
    await this.loadCpfHistory()
  },

  methods: {
    async loadCpfHistory () {
      try {
        this.loading = true
        this.cpfHistory = await getAllCpfHistory()
      } catch (error) {
        console.error('Erro ao carregar CPFs:', error)
      } finally {
        this.loading = false
      }
    },

    formatDate (timestamp) {
      if (!timestamp) return '-'
      return new Date(timestamp).toLocaleDateString('pt-BR')
    },
    async deleteCpf (id, uploadId) {
      if (!confirm('Tem certeza que deseja excluir este CPF do histórico?')) return

      try {
        this.$root.$emit('Spinner::show')
        await deleteCpfHistory(id)

        if (uploadId) {
          await deleteUploadHistory(uploadId)
        }

        // Remove o item da lista localmente para não precisar buscar tudo do banco de novo
        this.cpfHistory = this.cpfHistory.filter(item => item.id !== id)
      } catch (error) {
        console.error('Erro ao excluir CPF:', error)
      } finally {
        this.$root.$emit('Spinner::hide')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-top: 100px;
  border-radius: 5px;
  max-width: 1500px;
  overflow: hidden;

  .card-header {
    background-color: var(--dark);
    color: var(--light);
  }
}

.custom-table {
  margin-bottom: 0;

  thead th {
    background-color: #f8f9fa;
    font-weight: 600;
    border-bottom: 1px solid #dee2e6;
  }

  td,
  th {
    padding: 14px 12px;
    vertical-align: middle;
  }

  tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
}

.empty-state {
  padding: 24px;
  border: 1px dashed #dcdcdc;
  border-radius: 10px;
  text-align: center;
  color: #6c757d;
  background-color: #fafafa;
}

.spinner-wrapper {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
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
