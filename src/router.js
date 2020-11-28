import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Calendar from './views/Calendar.vue';
import Report from './views/Report.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import store from './store/store';
import * as firebase from 'firebase';

function loginAuth(to, from, next) {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      store.dispatch('updateIdToken', user.uid);
      store.dispatch('updateIsAuthenticated', true);
      next();
    } else {
      store.dispatch('updateIsAuthenticated', false);
      console.log('nobody logging in');
      next('/login');
    }
  });
}

function notLoginAuth(to, from, next) {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      store.dispatch('updateIsAuthenticated', true);
      store.dispatch('updateIdToken', user.uid);
      next('/calendar');
    } else {
      store.dispatch('updateIsAuthenticated', false);
      console.log('nobody logging in');
      next();
    }
  });
}


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Home,
      beforeEnter(to, from, next) {
        loginAuth(to, from, next);
      }
    },
    {
      path: "/calendar",
      component: Calendar,
      beforeEnter(to, from, next) {
        loginAuth(to, from, next);
      }
    },
    {
      path: "/report",
      component: Report,
      beforeEnter(to, from, next) {
        loginAuth(to, from, next);
      }
    },
    {
      path: "/login",
      component: Login,
      beforeEnter(to, from, next) {
        notLoginAuth(to, from, next);
      }
    },
    {
      path: "/register",
      component: Register,
      beforeEnter(to, from, next) {
        notLoginAuth(to, from, next);
      }
    },
  ]
});
