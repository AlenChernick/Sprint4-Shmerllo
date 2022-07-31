<template>
  <home-page-header />
  <div class="home-page-background"></div>
  <section class="home-page">
    <div class="home-page-main">
      <div class="home-page-info">
        <h1>Shmerllo helps teams work in flow.</h1>
        <h3>
          Collaborate, manage projects, and reach new productivity peaks. <br />
          From high rises to the home office, the way your team works is <br />
          unique—accomplish it all with Shmerllo.
        </h3>
        <router-link to="/board"><button>Start demo</button></router-link>
      </div>
      <img
        src="https://images.ctfassets.net/rz1oowkt5gyp/5QIzYxue6b7raOnVFtMyQs/113acb8633ee8f0c9cb305d3a228823c/hero.png?w=1200&fm=webp"
      />
    </div>
  </section>
</template>
<script>
import homePageHeader from '../views/home-page-header.vue'

export default {
  name: 'home-page',
  components: {
    homePageHeader,
  },
}
</script>
