import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
import * as firebase from 'firebase';
import router from '../router';


Vue.use(Vuex);

const today = new Date();

export default new Vuex.Store({
  state: {
    idToken: "",
    usersDocumentId: "",
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
        others: 0
      }
    },
    clickData: {
      dateList: [],
      dateTotal: 0,
      date: 1,
    }
  },
  getters: {
    idToken: state => state.idToken
  },
  mutations: {
    updateIdToken(state, idToken) {
      state.idToken = idToken;
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
    renderCalendarPayment(state) {
      const arry = state.inputData.list;
      const spanArry = document.querySelectorAll('.td span');
      spanArry.forEach(span => {
        let total = 0;
        arry.forEach(ary => {
          if(ary.date == span.className) {
            total+= ary.payment;
          }
        });
        if(total === 0) {
          span.textContent = "";
        } else{
          span.textContent = total;
        }
      });
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
      const db = firebase.firestore();
      db.collection('postData')
      .doc(state.inputData.list[index].id)
      .delete()
      .then(function() {
        console.log('deleteList action finish');
      });
    },
    monthTotalUpdate(state, index) {
      state.inputData.monthTotal -= state.inputData.list[index].payment;
    },
    categoryPaymentUpdate(state, index) {
      const hoge = state.inputData.list[index];
      if(hoge.category == "食費") {
        state.inputData.categoryPayments.food -= hoge.payment;
      }
      if(hoge.category == "日用品") {
        state.inputData.categoryPayments.daily -= hoge.payment;
      }
      if(hoge.category == "美容品") {
        state.inputData.categoryPayments.cosme -= hoge.payment;
      }
      if(hoge.category == "交際費") {
        state.inputData.categoryPayments.entertainment -= hoge.payment;
      }
      if(hoge.category == "交通費") {
        state.inputData.categoryPayments.transportation -= hoge.payment;
      }
      if(hoge.category == "その他") {
        state.inputData.categoryPayments.others -= hoge.payment;
      }
    },
    updateUsersDocumentId(state, id) {
      state.usersDocumentId = id;
    }
  },
  actions: {
    login(context, authData) {
      firebase.auth().signInWithEmailAndPassword(authData.email, authData.password)
      .then(response => {
        console.log('user login', response.user.uid);
        // context.commit('updateUsersDocumentId', localStorage.getItem('usersDocumentId'));
      });
    },
    register(context, authData) {
      firebase.auth().createUserWithEmailAndPassword(authData.email, authData.password)
      .then(response => {
        context.commit('updateIdToken', response.user.uid);
        console.log('user register', response);

        const db = firebase.firestore();
        db.collection('users').add({
          email: authData.email,
          password:authData.password
        })
        .then(response => {
          this.commit('updateUsersDocumentId', response.id);
          localStorage.setItem('usersDocumentId', response.id);
        });

      });
    },
    logout(context) {
      firebase.auth().signOut().then(() => {
        context.commit('updateIdToken', "");
        router.push('/login');
        console.log('signout success');
        // localStorage.removeItem('usersDocumentId');
      });
    },
    clearData(context) {
      const initializedData = {
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
          others: 0
        }
      }
      context.commit('clearData', initializedData);
    },
    getInputData(context) {
      const newData = {
        year: context.state.inputData.year,
        month: context.state.inputData.month,
        date: context.state.inputData.date,
        monthTotal: 0,
        list: [],
        categoryPayments: {
          food: 0,
          daily: 0,
          cosme: 0,
          entertainment: 0,
          transportation: 0,
          others: 0,
        }
      }

      const db = firebase.firestore();
      db.collection('users')
      .doc(context.state.usersDocumentId)
      .collection('postData')
      .where("month", "==", context.state.inputData.month)
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          newData.list.push({
            ...doc.data()
          });
          newData.monthTotal += doc.data().payment;
          if(doc.data().category == "食費") {
            newData.categoryPayments.food += doc.data().payment;
          } else if(doc.data().category == "日用品") {
            newData.categoryPayments.daily += doc.data().payment;
          } else if(doc.data().category == "美容品") {
            newData.categoryPayments.cosme += doc.data().payment;
          } else if(doc.data().category == "交際費") {
            newData.categoryPayments.entertainment += doc.data().payment;
          } else if(doc.data().category == "交通費") {
            newData.categoryPayments.transportation += doc.data().payment;
          } else if(doc.data().category == "その他") {
            newData.categoryPayments.others += doc.data().payment;
          }
          // console.log('docのid', doc.id);
        });
        context.commit('getInputData', newData);
        context.dispatch('renderCalendarPayment');
      });
    },
    prevMonth(context, number) {
      context.commit('prevMonth', number);
      context.dispatch('clearCalendar');
    },
    nextMonth(context, number) {
      context.commit('nextMonth', number);
      context.dispatch('clearCalendar');
    },
    createCalendar(context) {
      let year = context.state.inputData.year;
      let month = context.state.inputData.month - 1;
      function createCalendar() {
        const today = new Date();
        function getCalendarHead() {
          const dates = [];
          const d = new Date(year, month, 0).getDate();
          const n = new Date(year, month, 1).getDay();
          for(let i = 0; i < n; i ++) {
            dates.unshift({
              date: d - i,
              isToday: false,
              isDisable: true,
            });

          }
          return dates;
        }

        function getCalendarBody() {
          const dates = [];
          const lastDate = new Date(year, month + 1, 0).getDate();
          for(let i = 1; i <= lastDate; i ++) {
            dates.push({
              date: i,
              isToday: false,
              isDisable: false,
            });
          }
          if(year === today.getFullYear() && month === today.getMonth()) {
            dates[today.getDate() - 1].isToday = true;
          }
          return dates;
        }

        function getCalendarTail() {
          const dates = [];
          const lastDay = new Date(year, month + 1, 0).getDay();
          for(let i = 1; i < 7 - lastDay; i ++) {
            dates.push({
              date: i,
              isToday: false,
              isDisable: true,

            });
          }
          return dates;
        }
        //weeks作成
        function renderWeeks() {
          const dates = [
            ...getCalendarHead(),
            ...getCalendarBody(),
            ...getCalendarTail(),
          ]
          const weeks = [];
          const weeksCount = dates.length / 7;
          for(let i = 0; i < weeksCount; i ++) {
            weeks.push(dates.splice(0, 7));
          }

          weeks.forEach(week => {
            const tr = document.createElement('tr');
            week.forEach(date => {
              const td = document.createElement('td');
              td.classList.add('td');
              const div = document.createElement('div');
              td.appendChild(div);
              div.textContent = date.date;
              div.style.position = "absolute";
              div.style.top = "3px";
              div.style.left = "3px";
              if(date.isToday) {
                td.classList.add('today');
              }
              if(date.isDisable){
                td.classList.add('disabled');
              }
              const span = document.createElement('span');
              span.style.color = "#ff9966";
              span.style.fontSize = "12px";
              span.style.display = "block";
              span.style.position = "absolute";
              span.style.bottom = "0px";
              span.style.right = "3px";
              if(!date.isDisable) {
                span.classList.add(date.date);
              }
              td.appendChild(span);
              tr.appendChild(td);
            });
            document.querySelector('tbody').appendChild(tr);
          });
        }

        function calendarBodyStyle() {
          const sundayList = document.querySelectorAll('tbody tr td:first-child');
          const saturdayList = document.querySelectorAll('tbody tr td:last-child');
          for(let i = 0; i < sundayList.length; i ++) {
            sundayList[i].style.color = "red";
            saturdayList[i].style.color = "blue";
          }
          const calendarList = document.querySelectorAll('tbody tr td');
          calendarList.forEach(td => {
            if(td.classList.contains('today')) {
              td.style.fontWeight = 'bold';
              td.style.backgroundColor = '#eee';
            }
            if(td.classList.contains('disabled')) {
              td.style.opacity = '0.5';
            }
            td.style.border = "1px solid black";
            td.style.width = "calc(500px / 7)";
            td.style.height = "50px";
            td.style.position = "relative";
            td.style.cursor = "pointer";
          })
        }

        renderWeeks();
        calendarBodyStyle();
      }
      createCalendar();
      console.log('createCalendar mutation finish');
    },
    renderCalendarPayment(context) {
      context.commit('renderCalendarPayment');
    },
    getClickedData(context, date) {
      let dateList = [{
        date: 1,
        category: "食費",
        payment: 0,
        diary: "",
      }];
      let dateTotal = 0;

      const db = firebase.firestore();
      db.collection('postData')
      .where("date", "==", date)
      .where("month", "==", context.state.inputData.month)
      // .orderBy("payment", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          dateList.push({
            ...doc.data()
          });
          dateTotal += doc.data().payment;
        });
        dateList.shift();
        context.commit('getDateList', dateList);
        context.commit('getDateTotal', dateTotal);
        context.commit('getDate', date);
      })
      .catch(error => {
        console.log("getClickedData error", error);
      });
    },
    deleteList(context, index) {
      const db = firebase.firestore();
      db.collection('users')
      .doc(context.state.usersDocumentId)
      .collection('postData')
      .doc(context.state.inputData.list[index].id)
      .delete()
      .then(function() {
        context.state.inputData.list.splice(index, 1);
      });
    },
    modalShow(context) {
      const tds = document.querySelectorAll('tbody tr td');
      tds.forEach(td => {
      td.addEventListener('click', () => {
        const number = parseInt(td.firstElementChild.textContent);
        context.dispatch('getClickedData', number);
        const modal = document.querySelector('.modal');
        modal.classList.add('visible');
      });
    });
    },
    clearCalendar() {
      const tbody = document.querySelector('tbody');
      while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
    },
  },
  // plugins: [createPersistedState({storage: window.localStorage})],
});

