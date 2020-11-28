<template>
  <div>
    <CreateCalendar></CreateCalendar>
    <TotalPayment></TotalPayment>
  </div>
</template>

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
