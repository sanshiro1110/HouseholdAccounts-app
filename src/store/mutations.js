
export default {
  updateIdToken(state, idToken) {
    state.idToken = idToken;
  },
  updateIsAuthenticated(state, boolean) {
    state.isAuthenticated = boolean;
  },
  getInputData(state, newData) {
    state.inputData = newData;
  },
  prevMonth(state) {
    state.inputData.month -= 1;
    if(state.inputData.month < 1) {
      state.inputData.month = 12;
      state.inputData.year -= 1;
    }
  },
  nextMonth(state) {
    state.inputData.month += 1;
    if(state.inputData.month > 12) {
      state.inputData.month = 1;
      state.inputData.year += 1;
    }
  },
  getDateList(state, dateList) {
    state.clickData.dateList = dateList;
  },
  getDateTotal(state, dateTotal) {
    state.clickData.dateTotal = dateTotal;
  },
  getDate(state, date) {
    state.clickData.date = date;
  },
  clearData(state, initializedData) {
    state.inputData = initializedData;
  },
  deleteList(state, index) {
    state.inputData.list.splice(index, 1);
  },
  monthTotalUpdate(state, index) {
    state.inputData.monthTotal -= state.inputData.list[index].payment;
  },
  categoryPaymentUpdate(state, index) {
    const paymentData = state.inputData.list[index];
    if(paymentData.category == "食費") {
      state.inputData.categoryPayments.food -= paymentData.payment;
    } else if(paymentData.category == "日用品") {
      state.inputData.categoryPayments.daily -= paymentData.payment;
    } else if(paymentData.category == "美容品") {
      state.inputData.categoryPayments.cosme -= paymentData.payment;
    } else if(paymentData.category == "交際費") {
      state.inputData.categoryPayments.entertainment -= paymentData.payment;
    } else if(paymentData.category == "交通費") {
      state.inputData.categoryPayments.transportation -= paymentData.payment;
    } else if(paymentData.category == "その他") {
      state.inputData.categoryPayments.others -= paymentData.payment;
    }
  },
  goToday(state, date) {
    state.inputData.year = date.year;
    state.inputData.month = date.month;
  }
}
