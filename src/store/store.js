import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

const today = new Date();

export default new Vuex.Store({
  state: {
    idToken: "",
    isAuthenticated: true,
    inputData: {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      date: today.getDate(),
      monthTotal: 0,
      number: 0,
      list: [],
      categoryPayments: {
        food: 0,
        daily: 0,
        cosme: 0,
        entertainment: 0,
        transportation: 0,
        others: 0,
      }
    },
    clickData: {
      dateList: [],
      dateTotal: 0,
      date: 1,
    }
  },
  getters,
  mutations,
  actions,
});

