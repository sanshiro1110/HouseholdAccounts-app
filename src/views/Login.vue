<template>
  <div>
    <h2>ログイン</h2>
    <label for="email">Email： </label>
    <input type="email" id="email" v-model="email">
    <br><br>
    <label for="password">パスワード： </label>
    <input type="password" id="password" v-model="password">
    <br><br>
    <button @click="login">送信</button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      const userData = {
        email: this.email,
        password: this.password,
      }
      this.$store.dispatch('login', userData);
    }
  },
}
</script>

<style scoped>

  h2 {
    margin: 50px 0 30px 0;
    font-size: 20px;
  }

  #email {
    margin-bottom: 15px;
  }
</style>
