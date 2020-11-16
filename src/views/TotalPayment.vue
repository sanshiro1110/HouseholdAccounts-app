<template>
  <div>
    <div class="monthTotal">
      <span class="prevMonth" @click="prevMonth">前の月</span>
      <h3>
        {{ monthGet }}月の支出合計<br>
        {{ monthTotalGet }}円
      </h3>
      <span class="nextMonth" @click="nextMonth">次の月</span>
    </div>
    <div class="category">
      <h3>
        内訳
      </h3>
      <ul>
        <li>食費: {{ foodPaymentGet }}円</li>
        <li>日用品: {{ dailyPaymentGet }}円</li>
        <li>美容品: {{ cosmePaymentGet }}円</li>
        <li>交際費: {{ entertainmentPaymentGet }}円</li>
        <li>交通費: {{ transportationPaymentGet }}円</li>
        <li>その他: {{ othersPaymentGet }}円</li>
      </ul>
    </div>
    <ul class="totalPayment">
      <li class="date">
        日付
      </li>
      <li class="dateTotal">
        支出
      </li>
    </ul>
    <hr>
    <div v-for="(ary, index) in listGet" :key="ary.id" class="datePaymentLists">
      <ul class="totalPayment datePaymentList">
        <li>{{ ary.month }}月{{ ary.date}}日</li>
        <li>{{ ary.category }}</li>
        <li>{{ ary.payment}}円</li>
      </ul>
      <span class="deleteList" @click="deleteList(index)">[ x ]</span>
      <hr>
    </div>
  </div>
</template>

<style scoped>
hr {
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
}

.totalPayment {
  width: 500px;
  margin: 0px auto;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.totalPayment li {
  width: 200px;
  text-align: center;
}

.monthTotal {
  margin-top: 30px;
  position: relative;
}

.category ul{
  display: flex;
  justify-content: space-around;
  width: 700px;
  margin: 10px auto 20px;
}

.prevMonth {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translate(50%, -50%);
}
.nextMonth {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translate(-50%, -50%);
}

.prevMonth,
.nextMonth {
  cursor: pointer;
  background-color: #eee;
  border-radius: 10px;
  padding: 10px;
}

.datePaymentLists {
  position: relative;
}

.deleteList {
  display: block;
  color: #66ccff;
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>

<script>
export default {
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
    numberGet() {
      return this.$store.state.inputData.number;
    },
    listGet() {
      return this.$store.state.inputData.list;
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
  },
  methods: {
    deleteList(index) {
      if(confirm("本当に削除しますか")) {
        this.$store.dispatch('deleteList', index);
        this.$store.dispatch('createCalendar');
        // this.$store.dispatch('getInputData');
      }
    },
    prevMonth() {
      this.$store.dispatch('prevMonth');
      const tds = document.querySelectorAll('tbody tr td');
      tds.forEach(td => {
        td.addEventListener('click', () => {
          this.$store.dispatch('changeSavedData', parseInt(td.firstElementChild.textContent));
          const modal = document.querySelector('.modal');
          modal.classList.add('visible');
        });
      });
    },
    nextMonth() {
      this.$store.dispatch('nextMonth');
      const tds = document.querySelectorAll('tbody tr td');
      tds.forEach(td => {
        td.addEventListener('click', () => {
          this.$store.dispatch('changeSavedData', parseInt(td.firstElementChild.textContent));
          const modal = document.querySelector('.modal');
          modal.classList.add('visible');
        });
      });
    },
  },
}
</script>
