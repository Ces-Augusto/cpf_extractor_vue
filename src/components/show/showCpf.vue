 <template>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-dark text-white py-3">
            <h1 class="mb-0">
              <i class="bi bi-file-earmark-pdf me-2"></i>
              Lista de CPFs Extraídos
            </h1>
          </div>
          <div class="card-body p-4">
            <p class="text-secondary mb-4">
              Aqui estão os CPFs extraídos do seu documento PDF
            </p>
          </div>
          <div class="card-footer bg-light text-center py-3">
            <small class="text-muted">
            </small>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'showCpf'
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
