<template>
  <div id="app">
    <CreateCalendar></CreateCalendar>
    <TotalPayment></TotalPayment>
  </div>
</template>

<style scoped>
#app {
  height: 100%;
}
</style>

<script>
import CreateCalendar from './CreateCalendar';
import TotalPayment from './TotalPayment';

export default {
  components: {
    CreateCalendar,
    TotalPayment,
  },
}


</script>
