<template>
  <div>
    <view class="movie-item">
      <image class="movie-item-poster" :src="movie.images.small"/>
      <view class="movie-item-meta">
        <text class="movie-item-title">{{ movie.title }}</text>
        <text class="movie-item-sub-title">{{ movie.original_title }} ({{ movie.year }})</text>
        <view class="movie-item-artists">导演：<block v-for="(director, index) in movie.directors" :key="director.id"> {{ director.name }} </block></view>
      </view>
      <view class="movie-item-rating">
        <text class="movie-item-rating-text">{{ movie.rating.average }}</text>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  props: {
    movie: Object,
    default () {
      return {};
    }
  }
};
</script>

<style>
  .movie-item {
    display: flex;
    padding: 20rpx 40rpx;
    border-bottom: 1rpx solid #eee;
    cursor: pointer;
  }

  .movie-item-poster {
    width: 128rpx;
    height: 168rpx;
    margin-right: 20rpx;
  }

  .movie-item-meta {
    flex: 1;
  }

  .movie-item-title {
    display: block;
    margin-bottom: 15rpx;
    font-size: 32rpx;
  }

  .movie-item-sub-title {
    display: block;
    margin-bottom: 15rpx;
    font-size: 22rpx;
    color: #c0c0c0;
  }

  .movie-item-artists {
    font-size: 24rpx;
    color: #999;
  }

  .movie-item-rating-text {
    display: inline-block;
    width: 40rpx;
    font-size: 28rpx;
    font-weight: bold;
    text-align: center;
    background-color: rgba(247, 76, 49, 0.8);
    color: #fff;
    padding: 10rpx;
    border-radius: 20rpx;
  }

</style>
