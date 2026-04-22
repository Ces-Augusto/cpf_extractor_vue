<template>
  <button class="btn btn-logout" @click="logout()">
    <i class="fa fa-power-off"></i>
    Sair
  </button>
</template>

<script>
export default {
  methods: {
    async logout () {
      this.$root.$emit('Spinner::show')

      await this.$firebase.auth().signOut()

      window.uid = null

      this.$router.push({ name: 'login' })

      this.$root.$emit('Spinner::hide')
    }
  }
}
</script>

<style scoped lang="scss">
.btn-logout {
  width: 5%;
  margin-left: auto;
  &:hover {
    color: var(--white);
    background-color: var(--dark);
  }
}
</style>
