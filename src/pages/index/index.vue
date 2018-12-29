<template>
  <div>
    <van-swipe-cell
      v-for="(item, index) in pagination.items"
      :key="index"
      right-width="65"
    >
      <van-cell-group>
        <van-cell
          :title="item.mineralEnterprise.name"
          :label="item.mineralEnterprise.licenceNo"
        />
      </van-cell-group>
      <view
        slot="right"
        class="van-swipe-cell__right"
      >删除</view>
    </van-swipe-cell>

    <van-button
      size="large"
      type="primary"
      block
    >添加销售数据</van-button>
  </div>
</template>

<script>
import { urls } from '../../utils/url-def.js';
import { loadFun } from '../../utils/ext-page.js';

export default {
  data () {
    return {
      openId: this.getOpenId(),
      pagination: { currentPageNo: 0, items: [] }
    };
  },

  methods: {
    load () {
      loadFun({
        url: urls.yyh_mineral_price_enterprise_sale_manual_list,
        httpOptions: {
          params: {
            'q.createdBy': 'oE6MT5v0BRz77ntnky1xLAZpeLWo'
          }
          // maxCacheAge: 1,
          // cache: true
        }
      }, this.pagination);
    }
  },

  mounted () {
    var _this = this;
    setTimeout(function () {
      _this.load();
    }, 2000);
    /* this.openId = this.getOpenId();
    if (this.globalData.openId || this.globalData.ticket) {
      console.log(this.globalData);
      this.load();
    } else {
       console.log('else');
      console.log(this);
      console.log(this.openIdCallback);
      this.openIdCallback = function (openId, load) {
        console.log(openId);
        if (openId !== '') {
          this.load();
        }
      };
      this.openIdCallback();
      console.log(this.openIdCallback);
    } */
  }
};
</script>

<style scoped>
.van-swipe-cell__right {
  display: inline-block;
  width: 65px;
  height: 44px;
  font-size: 15px;
  line-height: 44px;
  color: #fff;
  text-align: center;
  background-color: #f44;
}
</style>
