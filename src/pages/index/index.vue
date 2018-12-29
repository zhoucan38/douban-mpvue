<template>
  <div>
    <view>
      <swiper class="md-board__swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
        <swiper-item v-for="(movie, index) in movies" :key="index">
          <image class="md-board__slide-image" :src="movie.images.large" mode="aspectFill"/>
        </swiper-item>
      </swiper>
    </view>

    <view class="md-board__list" :scroll-y="true">
      <block v-for="(item, index) in boards" :key="item.key">
        <view class="md-board__item">
          <navigator :url="'../list/main?type=' + item.key + '&title=' + item.title" hover-class="none">
            <view class="md-board__title">
              <text class="md-board__title-text">{{ item.title }}</text>
              <!-- <image class="md-board__title-image" src="../../../static/images/arrowright.png" mode="aspectFill"/> -->
            </view>
          </navigator>
          <scroll-view class="md-board__content" :scroll-x="true">
            <view class="md-board__inner" v-if="item.key !== 'us_box'">
              <navigator v-for="(movie, i) in item.movies" :key="movie.id + index + i" :url="'../item/main?id=' + movie.id">
                <view class="md-board__movie">
                  <image class="md-board__movie-image" :src="movie.images.large" mode="aspectFill"/>
                  <text class="md-board__movie-text">{{ movie.title }}</text>
                </view>
              </navigator>
            </view>
            <view class="md-board__inner" v-else>
              <navigator v-for="(movie, i) in item.movies" :key="movie.rank + index + i" :url="'../item/main?id=' + movie.subject.id">
                <view class="md-borad__movie">
                  <image class="md-board__movie-image" :src="movie.subject.images.large" mode="aspectFill"/>
                  <text class="md-board__movie-text">{{ movie.subject.title }}</text>
                </view>
              </navigator>
            </view>
          </scroll-view>
        </view>
      </block>
    </view>
  </div>
</template>

<script>
import { getBoardData } from '../../utils/api.js';
import Vue from 'vue';
export default {
  data () {
    return {
      movies: [],
      boards: [
        { key: 'top250' },
        { key: 'us_box' },
        { key: 'in_theaters' },
        { key: 'coming_soon' }
      ]
    };
  },

  methods: {
    getMoviesData () {
      getBoardData({
        board: 'coming_soon',
        count: 8
      }).then((result) => {
        this.movies = result.subjects;
      });
    },
    getBoardsData () {
      const promises = [];
      this.boards.forEach(function (board) {
        promises.push(getBoardData({ board: board.key, page: 1, count: 8 }));
      });
      Promise.all(promises).then(results => {
        console.log(results);
        results.forEach((result, index) => {
          Vue.set(this.boards, index, {
            key: this.boards[index].key,
            title: result.title,
            movies: result.subjects
          });
        });
        console.log(this.boards);
      });
    }
  },

  mounted () {
    this.getMoviesData();
    this.getBoardsData();
  }
};
</script>

<style>

.md-board__swiper {
  height:480rpx;
}

.md-slide-image {
  height: 100%;
  width: 100%;
}

.md-board__list {
  box-sizing:border-box;
  background-color:#f8f9fb;
}

.md-board__item {
  display:flex;
  flex-direction:column;
  cursor:pointer;
  font-size:20rpx;
  margin:40rpx 0;
  padding:20rpx;
  background-color:#fff;
}

.md-board__title {
  display:flex;
  margin-bottom:10rpx;
  width:100%;
}

.md-board__title-text {
  flex:1;
}

.md-board__title-image {
  height:20rpx;
  width:20rpx;
}

.md-board__content {
  height:300rpx;
}

.md-board__inner {
  display:flex;
  flex-direction:row;
  height:300rpx;
  width:900rpx;
}

.md-board__movie {display:flex;
  flex-direction:column;
  width:180rpx;
  margin:10rpx;
}

.md-board__movie-image {
  width:180rpx;
  height:250rpx;
}

.md-board__movie-text {
  text-align:center;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

</style>
