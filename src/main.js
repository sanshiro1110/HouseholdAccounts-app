import Vue from 'vue'
import App from './App.vue'
import router from "./router.js"
import * as firebase from 'firebase';
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';
import store from './store/store';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

const firebaseConfig = {
  apiKey: "AIzaSyACFgmrS9I5TRnI1sPWY3ro00HwtQmbWhM",
  authDomain: "householdaccounts-vueapp.firebaseapp.com",
  databaseURL: "https://householdaccounts-vueapp.firebaseio.com",
  projectId: "householdaccounts-vueapp",
  storageBucket: "householdaccounts-vueapp.appspot.com",
  messagingSenderId: "437591636718",
  appId: "1:437591636718:web:1c2309a95e752066b391ff",
  measurementId: "G-T7WC04S8N3"
};

firebase.initializeApp(firebaseConfig);

Vue.use(Chartkick.use(Chart));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');





