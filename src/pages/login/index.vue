<template>
    <form @submit.prevent="doLogin()" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0">CPF EXTRACTOR</h1>
      </div>
      <div class="card-body">
        <div class="form-group mb-3">
          <input
            required
            type="email"
            v-model="email"
            class="form-control"
            placeholder="E-mail"
          >
        </div>
        <div class="form-group mb-3">
          <input
            required
            type="password"
            v-model="password"
            class="form-control"
            placeholder="Senha"
          >
        </div>
        <button class="btn btn-login" :disabled="loading">
          <template v-if="loading">
            Entrando...
            <i class="fas fa-spinner fa-spin"></i>
          </template>
          <template v-else>
            Entrar
            <i class="fas fa-sign-in-alt"></i>
          </template>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Login',
  data: () => {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async doLogin () {
      this.loading = true
      this.$root.$emit('Spinner::show')
      const { email, password } = this

      try {
        const res = await this.$firebase.auth().signInWithEmailAndPassword(email, password)

        window.uid = res.user.uid

        this.$router.push({ name: 'Enviar Pdf' })
        console.log(res)
      } catch (err) {
        console.log(err)
        let message = 'Ocorreu um erro ao fazer login. Tente novamente.'

        if (err.code === 'auth/internal-error') {
          message = 'E-mail ou senha inválidos'
        } else if (err.code === 'auth/too-many-requests') {
          message = 'Muitas tentativas falhas. Tente novamente mais tarde.'
        }
        this.$root.$emit('notification::show', {
          type: 'danger',
          message
        })
      } finally {
        this.loading = false
        this.$root.$emit('Spinner::hide')
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (window.uid) {
        vm.$router.push({ name: 'Enviar Pdf' })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.form-login {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  height:  100vh;
  .card {
    margin-left: 50px;
    width: 30%;
    background-color: var(--dark);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
    .card-header {
      background-color: var(--blood-dark);
      color: var(--light);
    }
    .btn-login {
      color: var(--light);
      border: none;
      width: 25%;
    }
  }
}
</style>
