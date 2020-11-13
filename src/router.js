import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Calendar from './views/Calendar.vue';
import Report from './views/Report.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import store from './store/store';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Home,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next();
        } else {
          next('/login');
        }
      }
    },
    {
      path: "/calendar",
      component: Calendar,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next();
        } else {
          next('/login');
        }
      }
    },
    {
      path: "/report",
      component: Report,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next();
        } else {
          next('/login');
        }
      }
    },
    {
      path: "/login",
      component: Login,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next(false);
        } else {
          next();
        }
      }
    },
    {
      path: "/register",
      component: Register,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next(false);
        } else {
          next();
        }
      }
    },
  ]
});
