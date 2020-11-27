<template>
  <div id="app">
    <template v-if="isAuthenticated">
      <div class="router-link">
        <router-link to="./" class="navLink">入力</router-link>
        <router-link to="./calendar" class="navLink">カレンダー</router-link>
        <router-link to="./report" class="navLink">レポート</router-link>
      </div>
    </template>
    <template v-else>
      <div class="router-link">
        <router-link to="./login" class="navLink">ログイン</router-link>
        <router-link to="./register" class="navLink">新規登録</router-link>
      </div>
    </template>
    <div class="logout-button" v-if="isAuthenticated">
      <button @click="logout" class="logout">ログアウト</button>
    </div>
    <router-view></router-view>
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  width: 600px;
  margin: 0 auto;
}

.container {

  border: solid 1px #2c3e50;
}

.navLink {
  padding: 5px;
  margin-right: 10px;
  text-decoration: none;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #ccc;
  color: #000;
  display: inline-block;
  margin-bottom: 10px;
}

*, *::after, *::before {
  box-sizing: border-box;
  font-size: 15px;
}

.router-link {
  margin-bottom: 15px;
  padding-top: 30px;
}

.logout-button {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-end;
}

.logout {
  font-size: 12px;
}
</style>

<script>
import * as firebase from 'firebase';
import store from './store/store';
import router from "./router.js"

export default {
  computed: {
    dateListGet() {
      return this.$store.state.changeData.dateList;
    },
    dateTotalGet() {
      return this.$store.state.changeData.dateTotal;
    },
    isAuthenticated() {
      return this.$store.getters.idToken;
    }
  },
  methods: {
    logout() {
      if(confirm('are you sure to logout?')) {
        this.$store.dispatch('logout');
      }
    }
  },
  mounted() {
    window.addEventListener('load', function() {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          store.commit('updateIdToken', user.uid);
          console.log('autoLogin', user);
          router.push('/calendar');
        } else {
          console.log('nobody login');
        }
      });
    });
  }
}

</script>

