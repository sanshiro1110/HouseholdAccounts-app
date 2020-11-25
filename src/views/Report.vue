<template>
  <div id="app">
    <div class="monthTotal">
      <h3>
        {{ monthGet }}月の支出合計<br>
        {{ monthTotalGet }}円
      </h3>
    </div>
    <div class="chart">
      <pie-chart
        :data="[
          ['食費', foodPaymentGet],
          ['日用品', dailyPaymentGet],
          ['美容品', cosmePaymentGet],
          ['交際費', entertainmentPaymentGet],
          ['交通費', transportationPaymentGet],
          ['その他', othersPaymentGet]
        ]"
        :colors='["#ffc7af","#ffabce","#d0b0ff","#ffffaa","#8eb8ff","#aeffbd",]'
      ></pie-chart>
    </div>
    <div>
      <hr>
      <ul class="categoryPercentage">
        <li>食費</li>
        <li>{{ foodPaymentGet }}円</li>
        <li>{{ foodPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>日用品</li>
        <li>{{ dailyPaymentGet }}円</li>
        <li>{{ dailyPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>美容品</li>
        <li>{{ cosmePaymentGet }}円</li>
        <li>{{ cosmePercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>交際費</li>
        <li>{{ entertainmentPaymentGet }}円</li>
        <li>{{ entertainmentPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>交通費</li>
        <li>{{ transportationPaymentGet }}円</li>
        <li>{{ transportationPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>その他</li>
        <li>{{ othersPaymentGet }}円</li>
        <li>{{ othersPercentage }}%</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.categoryPercentage {
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  padding: 5px 0;
  list-style: none;
}

.chart {
  margin-bottom: 30px;
}

</style>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    yearGet() {
      return this.$store.state.inputData.year;
    },
    monthGet() {
      return this.$store.state.inputData.month;
    },
    dateGet() {
      return this.$store.state.inputData.date;
    },
    monthTotalGet() {
      return this.$store.state.inputData.monthTotal;
    },
    foodPaymentGet() {
      return this.$store.state.inputData.categoryPayments.food;
    },
    dailyPaymentGet() {
      return this.$store.state.inputData.categoryPayments.daily;
    },
    cosmePaymentGet() {
      return this.$store.state.inputData.categoryPayments.cosme;
    },
    entertainmentPaymentGet() {
      return this.$store.state.inputData.categoryPayments.entertainment;
    },
    transportationPaymentGet() {
      return this.$store.state.inputData.categoryPayments.transportation;
    },
    othersPaymentGet() {
      return this.$store.state.inputData.categoryPayments.others;
    },

    foodPercentage() {
      const percentage = ((this.$store.state.inputData.categoryPayments.food / this.$store.state.inputData.monthTotal) * 100).toFixed(1);
      if(percentage != isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    dailyPercentage() {
      const percentage = ((this.$store.state.inputData.categoryPayments.daily / this.$store.state.inputData.monthTotal) * 100).toFixed(1);
      if(percentage != isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    cosmePercentage() {
      const percentage = ((this.$store.state.inputData.categoryPayments.cosme / this.$store.state.inputData.monthTotal) * 100).toFixed(1);
      if(percentage != isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    entertainmentPercentage() {
      const percentage = ((this.$store.state.inputData.categoryPayments.entertainment / this.$store.state.inputData.monthTotal) * 100).toFixed(1);
      if(percentage != isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    transportationPercentage() {
      const percentage = ((this.$store.state.inputData.categoryPayments.transportation / this.$store.state.inputData.monthTotal) * 100).toFixed(1);
      if(percentage != isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    othersPercentage() {
      const percentage = ((this.$store.state.inputData.categoryPayments.others / this.$store.state.inputData.monthTotal) * 100).toFixed(1);
      if(percentage != isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
  },
  created() {
    // this.$store.dispatch('createCalendar');
    this.$store.dispatch('getInputData');
  }
}
</script>
