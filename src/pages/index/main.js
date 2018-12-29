import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
app.$watch('openId', function (newVal, oldVal) {
  console.log(newVal);
  console.log(oldVal);
  app.load();
});
