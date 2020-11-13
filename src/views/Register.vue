<template>
  <div>
    <h2>新規登録</h2>
    <label for="email">Email： </label>
    <input type="email" id="email" v-model="email">
    <br><br>
    <label for="password">パスワード： </label>
    <input type="password" id="password" v-model="password">
    <br><br>
    <button @click="register">送信</button>
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
    register() {
      const userData = {
        email: this.email,
        password: this.password,
      }
      this.$store.dispatch('register', userData);
    }
  }
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
