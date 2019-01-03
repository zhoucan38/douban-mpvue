<template>
  <div>
    <view class="movie-list">
      <template v-if="type !== 'us_box'">
        <navigator :url="'../item/main?id=' + item.id" v-for="(item, index) in movies" :key="item.id">
          <movie-item :movie="item"></movie-item>
        </navigator>
      </template>
      <template v-else>
        <navigator :url="'../item/main?id=' + item.subject.id" v-for="(item, index) in movies" :key="item.rank">
          <movie-item :movie="item.subject"></movie-item>
        </navigator>
      </template>
      <view class="movie-list-tips">
        <view v-if="hasMore">
          <image class="movie-list-tips-image"  src="/static/images/loading.gif" mode="aspectFill"/>
          <text class="movie-list-tips-text">正在加载...</text>
        </view>
        <view v-else>
          <text>--------------- 我也是有底线的 --------------</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import MovieItem from '@/components/movie-item';

export default {
  components: {
    'movie-item': MovieItem
  },

  props: {
    movies: {
      type: Array,
      default () {
        return [];
      }
    },
    hasMore: {
      type: Boolean,
      default: true
    },

    type: String
  }
};
</script>

<style>
  .movie-list {
    height: 100%;
  }

  .movie-list-tips {
    font-size: 28rpx;
    text-align: center;
    padding: 50rpx;
    color: #ccc;
  }

  .movie-list-tips-text {
    vertical-align: middle;
  }

  .movie-list-tips-image {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    vertical-align: middle;
  }
</style>
