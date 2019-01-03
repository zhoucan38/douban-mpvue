<template>
  <div>
    <image v-if="movie.images" class="item-background" :src="movie.images.large" mode="aspectFill"/>
    <block v-if="movie.title">
      <view class="item-meta">
        <image class="item-poster" :src="movie.images.large" mode="aspectFit"/>
        <text class="item-title">{{ movie.title }}({{ movie.year }})</text>
        <text class="item-info">评分：{{ movie.rating.average }}</text>
        <text class="item-info">导演：<block v-for="director in movie.directors" :key="director.id"> {{ director.name }} </block></text>
        <text class="item-info">主演：<block v-for="cast in movie.casts" :key="cast.id"> {{ cast.name }} </block></text>
      </view>
      <view class="item-summary">
        <text class="item-label">摘要：</text>
        <text class="item-content">{{ movie.summary }}</text>
      </view>
    </block>
  </div>
</template>

<script>
import { getMovieData } from '../../utils/api.js';
export default {
  data () {
    return {
      id: null,
      movie: {}
    };
  },

  methods: {
    getMovie (id) {
      getMovieData(id).then((result) => {
        this.movie = result;
        wx.setNavigationBarTitle({ title: this.movie.title + ' « 电影 « 豆瓣' });
      });
    }
  },

  mounted () {
    const id = this.$root.$mp.query.id;
    console.log(id);
    if (!id) {
      return wx.navigateBack();
    }
    this.id = id;
    this.getMovie(id);
  }
};
</script>

<style>

  .item-background {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: -1000;
    opacity: .1;
  }

  .item-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50rpx 40rpx;
  }

  .item-poster {
    width: 100%;
    height: 800rpx;
    margin: 20rpx;
  }

  .item-title {
    font-style: 42rpx;
    color: #444;
  }

  .item-info {
    font-size: 24rpx;
    color: #888;
    margin-top: 20rpx;
    width: 80%;
  }

  .item-summary {
    width: 80%;
    margin: 30rpx auto;
  }

  .item-label {
    display: block;
    font-size: 30rpx;
    margin-bottom: 30rpx;
  }

  .item-content {
    color: #666;
    font-size: 22rpx;
    padding: 2em;
  }

</style>
