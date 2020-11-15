<template>
  <div>
    <div class="modal">
      <div class="modal-date">
        <h3>
          {{ inputData.year }}年{{ inputData.month }}月{{ inputData.date }}日 {{ dateTotalGet }}円
        </h3>
        <div>
          (
            <span v-for="(list, index) in dateListGet" :key="index">
              {{ list.category }}: {{ list.payment }}円
            </span>
          )
        </div>
        <div>
          メモ
          <br>
          {{ inputData.diary }}
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
        <button class="save" @click="dataRequest">追加</button>
      </div>
    </div>
    <table class="calendar">
      <thead>
        <tr>
          <th class="prev" id="prev" @click="prevMonth">&laquo;</th>
          <th class="title" id="title" colspan="5"></th>
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
          <td id="today" colspan="7">Today</td>
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
  width: 500px;
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
  width: 600px;
  border: 2px solid #777;
  border-radius: 5px;
  box-shadow: 3px 3px 2px #777;
  background-color: #fff;
}

.modal.visible {
  transform: scale(1) translateX(-50%);
  opacity: 1;
}

.modal-changePaymentData button {
  margin-top: 20px;
}

.modal-date {
  margin: 0 50px 0;
  border-bottom: 1px solid #000;
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

</style>

<script>
import * as firebase from 'firebase';

const today = new Date();

export default {
  data() {
    return {
      inputData: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
        category: "食費",
        payment: 0,
        diary: "",
      },
      categories: ["食費", "日用品", "美容品", "交際費", "交通費", "その他"],
    }
  },
  computed: {
    yearGet() {
      return this.$store.state.inputData.year;
    },
    monthGet() {
      return this.$store.state.inputData.month;
    },
    dateGet() {
      return this.$store.state.inputData.date;
    },
    listGet() {
      return this.$store.state.inputData.list;
    },
    dateListGet() {
      return this.$store.state.changeData.dateList;
    },
    dateTotalGet() {
      return this.$store.state.changeData.dateTotal;
    },
  },
  mounted() {
    this.$store.dispatch('createCalendar');
    this.$store.dispatch('getInputData');
    // document.querySelector('#today').addEventListener('click', () => {
    //   this.$store.dispatch('createCalendar');
    //   this.$store.dispatch('getInputData');
    // });
    const tds = document.querySelectorAll('tbody tr td');
    tds.forEach(td => {
      td.addEventListener('click', () => {
        this.$store.dispatch('changeSavedData', parseInt(td.firstElementChild.textContent));
        this.inputData.year = this.$store.state.inputData.year;
        this.inputData.month = this.$store.state.inputData.month;
        this.inputData.date = td.firstElementChild.textContent;
        const n = this.$store.state.changeData.dateList.length;
        if(n > 0) {
          this.inputData.diary = this.$store.state.changeData.dateList[n - 1].diary;
        } else {
          this.inputData.diary = "";
        }
        const modal = document.querySelector('.modal');
        modal.classList.add('visible');
      });
    });
  },
  methods: {
    prevMonth() {
      this.$store.dispatch('prevMonth');
      const tds = document.querySelectorAll('tbody tr td');
      tds.forEach(td => {
        td.addEventListener('click', () => {
          this.$store.dispatch('changeSavedData', parseInt(td.firstElementChild.textContent));
          this.inputData.month = this.$store.state.month;
          this.inputData.date = td.firstElementChild.textContent;
          const modal = document.querySelector('.modal');
          modal.classList.add('visible');
        });
      });
    },
    nextMonth() {
      this.$store.dispatch('nextMonth');
      const tds = document.querySelectorAll('tbody tr td');
      tds.forEach(td => {
        td.addEventListener('click', () => {
          this.$store.dispatch('changeSavedData', parseInt(td.firstElementChild.textContent));
          this.inputData.month = this.$store.state.month;
          this.inputData.date = td.firstElementChild.textContent;
          const modal = document.querySelector('.modal');
          modal.classList.add('visible');
        });
      });
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
        //日付が同じだった場合は金額を追加して更新したい
        const db = firebase.firestore();
        db.collection('total').add({
          year: this.inputData.year,
          month: this.inputData.month,
          date: this.inputData.date,
          category: this.inputData.category,
          payment: parseInt(this.inputData.payment),
          diary: this.inputData.diary,
        }).then(() => {
          location.reload();
        });
      }
    }
  },
}
</script>
