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
        <li id="categoryType">
          <font-awesome-icon class="foodIcon" :icon="['fas', 'utensils']"/>
          食費: <span>{{ categoryPaymentsGet.food}}</span>円
        </li>
        <li id="categoryType">
          <font-awesome-icon class="dailyIcon" :icon="['fas', 'shopping-bag']"/>
          日用品: <span>{{ categoryPaymentsGet.daily}}</span>円
        </li>
        <li id="categoryType">
          <font-awesome-icon class="cosmeIcon" :icon="['fas', 'smile']"/>
          美容品: <span>{{ categoryPaymentsGet.cosme}}</span>円
        </li>
      </ul>
      <ul>
        <li id="categoryType">
          <font-awesome-icon class="entertainmentIcon" :icon="['fas', 'glass-cheers']"/>
          交際費: <span>{{ categoryPaymentsGet.entertainment}}</span>円
        </li>
        <li id="categoryType">
          <font-awesome-icon class="transportationIcon" :icon="['fas', 'bus']"/>
          交通費: <span>{{ categoryPaymentsGet.transportation}}</span>円
        </li>
        <li id="categoryType">
          <font-awesome-icon class="othersIcon" :icon="['fas', 'basketball-ball']"/>
          その他: <span>{{ categoryPaymentsGet.others}}</span>円
        </li>
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
    <div class="paymentList">
      <div v-for="(ary, index) in listGet" :key="ary.id">
        <ul class="totalPayment">
          <li>{{ ary.month }}月{{ ary.date}}日</li>
          <li>{{ ary.category }}</li>
          <li>{{ ary.payment}}円</li>
        </ul>
        <span class="deleteList" @click="deleteList(index)" v-if="widthGet">[ x ]</span>
        <span class="deleteList" @click="deleteList(index)" v-else>[x]</span>
        <hr>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paymentList {
  margin-bottom: 30px;
  height: 300px;
  overflow-y: scroll;
  border: 5px solid #aaa;
  border-radius: 5px;
}

hr {
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
}

.totalPayment {
  margin: 0px auto;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.totalPayment li {
  text-align: center;
  width: 33%;
}

.monthTotal {
  margin-top: 30px;
  position: relative;
}

.category h3 {
  margin-top: 25px;
}

.category ul{
  display: flex;
  justify-content: space-around;
}

.category ul li {
  font-size: 14px;
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
  user-select: none;
}

.paymentList > div {
  position: relative;
}

.deleteList {
  display: block;
  color: #66ccff;
  position: absolute;
  top: 50%;
  right: 1.5%;
  transform: translateY(-50%);
  cursor: pointer;
}

@media screen and (max-width: 480px) {
  .prevMonth {
    left: 3%;
  }
  .nextMonth {
    right: 3%;
  }

  .category ul li {
    font-size: 11px;
  }
}
</style>
<style>
.foodIcon {
  color: #FF82B2;
}
.dailyIcon {
  color: #C9FF2F;
}
.cosmeIcon {
  color: #30F9B2;
}
.entertainmentIcon {
  color: #4689FF;
}
.transportationIcon {
  color: #A16EFF;
}
.othersIcon {
  color: #FF773E;
}

</style>
<script>

export default {
  data() {
    return {
      categoryPayments: this.$store.getters.inputData.categoryPayments,
    }
  },
  computed: {
    widthGet() {
      const maxWidth = document.querySelector('#app').clientWidth;
      if(maxWidth > 480) {
        return true;
      } else {
        return false;
      }
    },
    yearGet() {
      return this.$store.getters.inputData.year;
    },
    monthGet() {
      return this.$store.getters.inputData.month;
    },
    dateGet() {
      return this.$store.getters.inputData.date;
    },
    monthTotalGet() {
      return this.$store.getters.inputData.monthTotal;
    },
    numberGet() {
      return this.$store.getters.inputData.number;
    },
    listGet() {
      return this.$store.getters.inputData.list;
    },
    categoryPaymentsGet() {
      return this.$store.getters.inputData.categoryPayments;
    },
  },
  methods: {
    deleteList(index) {
      if(confirm("本当に削除しますか")) {
        this.$store.commit('monthTotalUpdate', index);
        this.$store.commit('categoryPaymentUpdate', index);
        this.$store.dispatch('deleteData', index);
      }
    },
    prevMonth() {
      this.$store.dispatch('prevMonth');
      this.$store.dispatch('createCalendar');
      this.$store.dispatch('getInputData');
      this.$store.dispatch('modalShow');
    },
    nextMonth() {
      this.$store.dispatch('nextMonth');
      this.$store.dispatch('createCalendar');
      this.$store.dispatch('getInputData');
      this.$store.dispatch('modalShow');
    },
  },
}
</script>
