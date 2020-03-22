<template>
  <div id="app">
    <ChangesReport />
  </div>
</template>

<script>
import ChangesReport from './pages/ChangesReport.vue'

export default {
  name: 'App',
  components: {
      ChangesReport
  },
  watch: {
      $route: {
          immediate: true,
          handler (to) {
              document.title = to.meta.title || 'یکتانت';
          },
      },
  }
}
</script>

<style lang="scss">
@import 'assets/styles/main.scss';
@import 'assets/styles/fonts.scss';

#app {
  text-align: center;
  margin: 60px auto;
  direction: rtl;

  @media (max-width: 767px) {
    width: auto;
  }

  @media (min-width: 768px) {
    width: 750px;
  }

  @media (min-width: 992px) {
    width: 970px;
  }

  @media (min-width: 1200px) {
    width: 1170px;
  }
}
</style>
