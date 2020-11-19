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
  mounted() {
    this.$nextTick(function() {
    this.$store.dispatch('getInputData');
    this.$store.dispatch('createCalendar');
    this.$store.dispatch('modalShow');
    });
  },
}


</script>
