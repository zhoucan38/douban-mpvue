import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
App.mpType = 'app';
Vue.prototype.globalData = {};

Vue.prototype.getOpenId = function () {
  return Vue.prototype.globalData.openId;
};
Vue.prototype.openIdCallback = function (openId, load) {
  if (openId && load) {
    load();
  }
};
console.log(getApp());
const app = new Vue(App);
app.$mount();
console.log(getApp());
