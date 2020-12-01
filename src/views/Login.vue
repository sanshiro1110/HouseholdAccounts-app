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
    <div class="test">
      <h3>テスト用ID</h3>
      <p>メールアドレス: test@test.com</p>
      <p>パスワード: test8000</p>
    </div>
  </div>
</template>

<style scoped>
  h2 {
    margin: 80px 0 30px 0;
    font-size: 20px;
  }

  #email {
    margin-bottom: 15px;
  }

  .test {
    margin-top: 70px;
    padding: 20px;
    border: 1px solid #000;
    background-color: #eee;
  }

  .test h3 {
    margin-bottom: 20px;
  }
</style>

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
