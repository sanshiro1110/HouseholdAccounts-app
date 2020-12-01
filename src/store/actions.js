
import * as firebase from 'firebase';
const today = new Date();

export default {
  login(context, authData) {
    firebase.auth().signInWithEmailAndPassword(authData.email, authData.password)
    .then(() => {
      console.log('user login success');
    })
    .catch(() => {
      alert('メールアドレスとパスワードが合っていません。');
      console.log('user login failed');
    });
  },
  register(context, authData) {
    firebase.auth().createUserWithEmailAndPassword(authData.email, authData.password)
    .then(response => {
      context.commit('updateIdToken', response.user.uid);

      const db = firebase.firestore();
      db.collection('users').doc(response.user.uid).set({
        email: authData.email,
        password:authData.password
      })
      .then(() => {
        console.log('user register success');
      })
      .catch(() => {
        console.log('user register failed');
      });
    });
  },
  logout(context) {
    firebase.auth().signOut().then(() => {
      context.commit('updateIdToken', "");
      console.log('user logout success');
    }).catch(() => {
      console.log('user logout failed');
    });
  },
  updateIdToken(context, idToken) {
    context.commit('updateIdToken', idToken);
  },
  updateIsAuthenticated(context, boolean) {
    context.commit('updateIsAuthenticated', boolean);
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
    .doc(context.state.idToken)
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
      });
      context.commit('getInputData', newData);
      context.dispatch('renderCalendarPayment', newData.list);
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
            if (window.matchMedia('(max-width: 480px)').matches) {
              //スマホ処理
              span.style.fontSize = "10px";
            } else {
              span.style.fontSize = "12px";
            }
            span.style.right = "3px";
            span.style.display = "block";
            span.style.position = "absolute";
            span.style.bottom = "0px";
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

          if (window.matchMedia('(max-width: 480px)').matches) {
            //スマホ処理
            td.style.height = "35px";
            td.style.width = "40px";
          } else {
            td.style.height = "50px";
            td.style.width = "70px";
          }
          td.style.position = "relative";
          td.style.cursor = "pointer";
        })
      }

      renderWeeks();
      calendarBodyStyle();
    }
    createCalendar();
  },
  clearCalendar() {
    const tbody = document.querySelector('tbody');
    while(tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  },
  renderCalendarPayment(context, list) {
    const spanArry = document.querySelectorAll('.td span');
    spanArry.forEach(span => {
      let total = 0;
      list.forEach(ary => {
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
  getClickedData(context, date) {
    let dateList = [{
      date: 1,
      category: "食費",
      payment: 0,
      diary: "",
      diaryIndication: true,
    }];
    let dateTotal = 0;

    const db = firebase.firestore();
    db.collection('users')
    .doc(context.state.idToken)
    .collection('postData')
    .where("date", "==", date)
    .where("month", "==", context.state.inputData.month)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        if(doc.data().diary == "") {
          dateList.push({
          ...doc.data(),
          dateIndication: false,
          });
        } else {
          dateList.push({
            ...doc.data(),
            dateIndication: true,
          });
        }
        dateTotal += doc.data().payment;
      });
      dateList.shift();
      context.commit('updateDateList', dateList);
      context.commit('updateDateTotal', dateTotal);
      context.commit('updateDate', date);
    });
  },
  deleteList(context, index) {
    context.commit('deleteList', index);
    return context.state.inputData.list;
  },
  deleteData(context, index) {
    const db = firebase.firestore();
    db.collection('users')
    .doc(context.state.idToken)
    .collection('postData')
    .doc(context.state.inputData.list[index].id)
    .delete()
    .then(() => {
      async function deleteList() {
        const list = await context.dispatch('deleteList', index);
        context.dispatch('renderCalendarPayment', list);
      }
      deleteList();
    });
  },
  modalShow(context) {
    const tds = document.querySelectorAll('tbody tr td');
    tds.forEach(td => {
    td.addEventListener('click', () => {
      const number = parseInt(td.firstElementChild.textContent);
      context.dispatch('getClickedData', number);
      document.querySelector('.modal').classList.add('visible');
    });
  });
  },
  goToday(context, date) {
    context.commit('goToday', date);
  }
}
