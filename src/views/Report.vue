<template>
  <div>
    <div class="monthTotal">
      <h3>
        {{ inputDataGet.month }}月の支出合計<br>
        {{ inputDataGet.monthTotal }}円
      </h3>
    </div>
    <div class="chart">
      <pie-chart
        :data="[
          ['食費', inputDataGet.categoryPayments.food ],
          ['日用品', inputDataGet.categoryPayments.daily],
          ['美容品', inputDataGet.categoryPayments.cosme],
          ['交際費', inputDataGet.categoryPayments.entertainment],
          ['交通費', inputDataGet.categoryPayments.transportation],
          ['その他', inputDataGet.categoryPayments.others]
        ]"
        :colors='["#ffc7af","#ffabce","#d0b0ff","#ffffaa","#8eb8ff","#aeffbd",]'
      ></pie-chart>
    </div>
    <div>
      <hr>
      <ul class="categoryPercentage">
        <li>食費</li>
        <li>{{ inputDataGet.categoryPayments.food }}円</li>
        <li>{{ foodPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>日用品</li>
        <li>{{ inputDataGet.categoryPayments.daily }}円</li>
        <li>{{ dailyPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>美容品</li>
        <li>{{ inputDataGet.categoryPayments.cosme }}円</li>
        <li>{{ cosmePercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>交際費</li>
        <li>{{ inputDataGet.categoryPayments.entertainment }}円</li>
        <li>{{ entertainmentPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>交通費</li>
        <li>{{ inputDataGet.categoryPayments.transportation }}円</li>
        <li>{{ transportationPercentage }}%</li>
      </ul>
      <hr>
      <ul class="categoryPercentage">
        <li>その他</li>
        <li>{{ inputDataGet.categoryPayments.others }}円</li>
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
    inputDataGet() {
      return this.$store.getters.inputData;
    },

    foodPercentage() {
      let percentage = ((this.$store.getters.inputData.categoryPayments.food / this.$store.getters.inputData.monthTotal) * 100).toFixed(1);
      if(percentage == isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    dailyPercentage() {
      let percentage = ((this.$store.getters.inputData.categoryPayments.daily / this.$store.getters.inputData.monthTotal) * 100).toFixed(1);
      if(percentage == isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    cosmePercentage() {
      let percentage = ((this.$store.getters.inputData.categoryPayments.cosme / this.$store.getters.inputData.monthTotal) * 100).toFixed(1);
      if(percentage == isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    entertainmentPercentage() {
      let percentage = ((this.$store.getters.inputData.categoryPayments.entertainment / this.$store.getters.inputData.monthTotal) * 100).toFixed(1);
      if(percentage == isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    transportationPercentage() {
      let percentage = ((this.$store.getters.inputData.categoryPayments.transportation / this.$store.getters.inputData.monthTotal) * 100).toFixed(1);
      if(percentage == isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
    othersPercentage() {
      let percentage = ((this.$store.getters.inputData.categoryPayments.others / this.$store.getters.inputData.monthTotal) * 100).toFixed(1);
      if(percentage == isNaN) {
        return '0';
      } else {
        return percentage;
      }
    },
  },
  created() {
    this.$store.dispatch('getInputData');
  }
}
</script>
