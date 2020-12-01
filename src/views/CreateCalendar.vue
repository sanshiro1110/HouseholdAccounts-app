<template>
  <div>
    <div class="modal">
      <div class="modal-date">
        <h3>
          {{ dateGet.year }}年{{ dateGet.month }}月{{ dateGet.date }}日 {{ dateTotalGet }}円
        </h3>
        <div>
          (
            <span v-for="(list, index) in dateListGet" :key="index">
              {{ list.category }}: {{ list.payment }}円
            </span>
          )
        </div>
        <br>
        <div>
          メモ
          <br><br>
          <ul v-for="(diary, index) in dateListGet" :key="index">
            <li v-if="diary.dateIndication">{{ diary.diary }}</li>
          </ul>
        </div>
      </div>
      <div class="modal-changePaymentData">
        <h4>支出額の追加</h4>
        <font-awesome-icon class="modal-close" @click="modalClose" :icon="['fas', 'times-circle']"/>
        <select class="category" v-model="inputData.category">
          <option v-for="category in categories" :key="category">
            {{ category }}
          </option>
        </select>
        <input type="number" v-model="inputData.payment">円
        <br>
        <h3>メモ</h3>
        <textarea name="diary" id="" cols="30" rows="5" v-model="inputData.diary"></textarea>
        <br>
        <button class="save" @click="dataRequest">追加</button>
      </div>
    </div>
    <table class="calendar" id="calendar">
      <thead>
        <tr>
          <th class="prev" id="prev" @click="prevMonth">&laquo;</th>
          <th class="title" id="title" colspan="5">{{ dateGet.year }}/{{ String(dateGet.month).padStart(2, '0') }}</th>
          <th class="next" id="next" @click="nextMonth">&raquo;</th>
        </tr>
        <tr>
          <td>Sun</td>
          <td>Mon</td>
          <td>Tue</td>
          <td>Wed</td>
          <td>Thu</td>
          <td>Fri</td>
          <td>Sat</td>
        </tr>
      </thead>

      <tbody>
      </tbody>

      <tfoot>
        <tr>
          <td id="today" colspan="7" @click="goToday">Today</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
table {
  border: 1px solid #000;
  border-collapse: collapse;
}

thead {
  font-weight: bold;
  background-color: #eee;
}

.prev,
.next {
  cursor: pointer;
  user-select: none;
}

thead tr th,
thead tr td {
  padding: 10px;
}

tfoot {
  background-color: #fff;
  font-weight: bold;
  text-align: center;
}

tfoot tr td {
  padding: 10px 0;
  cursor: pointer;
}

.calendar {
  margin: 0 auto;
  position: relative;
  z-index: 10;
}


.modal {
  transition: all .3s ease;
  transform: scale(0) translateX(-50%);
  opacity: 0;
  position: absolute;
  top: 150px;
  left: 50%;
  z-index: 20;
  width: 55%;
  border: 2px solid #777;
  border-radius: 5px;
  box-shadow: 3px 3px 2px #777;
  background-color: #fff;
  padding: 10px;
}

.modal.visible {
  transform: scale(1) translate(-50%, -10%);
  opacity: 1;
}

.modal-changePaymentData h4 {
  margin-bottom: 10px;
}

.modal-changePaymentData h3 {
  margin: 10px 0;
}

.modal-changePaymentData button {
  margin: 20px 0 0 0;
}

.modal-date {
  margin: 0 50px 30px;
  border-bottom: 1px solid #000;
}

.modal-date h3 {
  margin-bottom: 10px;
}

.data-delete {
  margin-bottom: 20px;
}

.modal-close {
  font-size: 25px;
  color: #777;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

.modal-default {
  display: none;
}

.category {
  display: block;
  width: 50px;
  margin: 0 auto 15px;
}

.save {
  margin-bottom: 20px;
  cursor: pointer;
}

@media screen and (max-width: 480px) {
  .modal {
    width: 80%;
  }
}
</style>

<script>
import * as firebase from 'firebase';

export default {
  data() {
    return {
      inputData: {
        category: "食費",
        payment: 0,
        diary: "",
      },
      categories: ["食費", "日用品", "美容品", "交際費", "交通費", "その他"],
    }
  },
  computed: {
    dateListGet() {
      return this.$store.getters.clickData.dateList;
    },
    dateTotalGet() {
      return this.$store.getters.clickData.dateTotal;
    },
    dateGet() {
      return {
        year: this.$store.getters.inputData.year,
        month: this.$store.getters.inputData.month,
        date: this.$store.getters.clickData.date,
      }
    },
    getUsersDocumentId() {
      return this.$store.getters.idToken;
    },
    dateDiaryGet() {
      const n = this.dateListGet.length;
      if(n > 0) {
        return this.$store.getters.clickData.dateList[n - 1].diary;
      } else {
        return '';
      }
    },
  },
  methods: {
    prevMonth() {
      this.$store.dispatch('prevMonth');
      this.$store.dispatch('createCalendar');
      this.$store.dispatch('getInputData');
      this.$store.dispatch('modalShow');
    },
    nextMonth() {
      this.$store.dispatch('nextMonth');
      this.$store.dispatch('createCalendar');
      this.$store.dispatch('getInputData');
      this.$store.dispatch('modalShow');
    },
    modalClose() {
      const modal = document.querySelector('.modal');
      modal.classList.remove('visible');
    },
    dataRequest() {
      if(this.inputData.payment == 0) {
        alert('※支出額が0円です');
      }
      if(this.inputData.payment !== 0) {
        alert('保存されました');
        const db = firebase.firestore();
        db.collection('users')
        .doc(this.getUsersDocumentId)
        .collection('postData')
        .add({
          year: this.dateGet.year,
          month: this.dateGet.month,
          date: this.dateGet.date,
          category: this.inputData.category,
          payment: parseInt(this.inputData.payment),
          diary: this.inputData.diary,
        }).then(response => {
          db.collection('users')
          .doc(this.getUsersDocumentId)
          .collection('postData')
          .doc(response.id).set({
            id: response.id
          }, { merge: true });
          this.inputData.category = "食費";
          this.inputData.payment = 0;
          this.inputData.diary = "";
          location.reload();
        });
      }
    },
    goToday() {
      const today = new Date();
      const date = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      }
      this.$store.dispatch('goToday', date);
      this.$store.dispatch('clearCalendar');
      this.$store.dispatch('createCalendar');
      this.$store.dispatch('getInputData');
      this.$store.dispatch('modalShow');
    }
  },
}
</script>
