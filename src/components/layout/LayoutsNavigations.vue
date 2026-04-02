<template>
  <nav class="nav nav-pills">

    <li
      class="nav-item"
      v-for="(route, i) in routerLinks"
      :key="i"
    >
      <router-link
        class="nav-link"
        :to="route.path"
        exact-active-class="active"
        :exact="route.path === '/'"
      >
        <i class="fa" :class="`fa-${route.meta.icon}`"></i>
        {{ route.name }}
      </router-link>
    </li>

  </nav>
</template>

<script>
export default {
  computed: {
    routerLinks () {
      return this.$router.options.routes
        .filter(r => r.path && r.name) // evita rota inválida
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  background-color: var(--blood-dark);

  .nav-item {
    list-style: none;

    .nav-link {
      transition: .4s;
      color: var(--light);

      &.active {
        color: var(--blood);
        background-color: transparent;
        border: 1px solid var(--blood-dark);
        margin-bottom: 2px;
      }

      &:hover {
        background-color: var(--dark);
        border: 1px solid var(--blood-dark);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.nav {
  background-color: var(--blood-dark);

  .nav-item {
    .nav-link  {
      transition: .4s;
      color: var(--light);
      &.active {
        color: var(--blood);
        background-color: var(--dark);
        margin-bottom: 2px;
      }
      &:not(.active):hover {
        background-color: var(--blood);
        border-color: var(--blood-dark);
        border: 1px solid var(--blood-dark);
      }
    }
  }
}
</style>
