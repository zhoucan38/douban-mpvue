<script>
import { corsHttp } from './utils/http.js';
import { urls } from './utils/url-def.js';
import { app } from './utils/common-def';
import WXP from 'minapp-api-promise';

export default {
  created () {
    console.log('created');
    var lxTicket = wx.getStorageSync('lx-ticket');
    if (lxTicket) {
      this.globalData.ticket = lxTicket;
    } else {
      WXP.login().then(res => {
        corsHttp.request(urls.proxy_identify, {
          params: {
            appId: app.appid,
            secret: app.appSecret,
            jsCode: res.code
          }
        }).then(data => {
          this.globalData.openId = data.openid;
          if (data.ticket) {
            corsHttp.setTicketStorage(data.ticket);
            this.globalData.ticket = data.ticket;
          }

          if (this.openIdCallback) {
            this.openIdCallback(data.openid);
          }
        });
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}

* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
