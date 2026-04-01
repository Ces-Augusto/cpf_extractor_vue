<template>
<ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Enviar PDF</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Consulta de CPFs</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
</ul>
</template>

<script>
export default {

}
</script>

<style  scoped>
.nav {
  background-color: var(--blood-dark);

  .nav-item {
    .nav-link {
      color: var(--light);
      &.active {
        background-color: var(--dark);
        color: var(--light);
        border: 1px solid var(--blood-dark);
        margin-bottom: 2px;
      }
      &:hover {
        background-color: var(--dark);
        border-color: var(--blood-dark);
        border: 1px solid var(--blood-dark);
      }
    }
  }
}
</style>
