<template>
  <AIChatInterface />
</template>

<script>
import AIChatInterface from './components/AIChatInterface.vue'

export default {
  name: 'App',
  components: {
    AIChatInterface
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f8f9fa;
}

#app {
  height: 100vh;
}
</style>
