<template>
  <div>
    <view>
      <swiper class="board-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
        <swiper-item v-for="(movie, index) in movies" :key="index">
          <image class="board-slide-image" :src="movie.images.large" mode="aspectFill"/>
        </swiper-item>
      </swiper>
    </view>

    <view class="board-list" :scroll-y="true">
      <block v-for="(item, index) in boards" :key="item.key">
        <view class="board-item">
          <navigator :url="'../list/main?type=' + item.key + '&title=' + item.title" hover-class="none">
            <view class="board-title">
              <text class="board-title-text">{{ item.title }}</text>
              <image class="board-title-image" src="../../../../static/images/arrowright.png" mode="aspectFill"/>
            </view>
          </navigator>
          <scroll-view class="board-content" :scroll-x="true">
            <view class="board-inner" v-if="item.key !== 'us_box'">
              <navigator v-for="(movie, i) in item.movies" :key="movie.id + index + i" :url="'../item/main?id=' + movie.id">
                <view class="board-movie">
                  <image class="board-movie-image" :src="movie.images.large" mode="aspectFill"/>
                  <text class="board-movie-text">{{ movie.title }}</text>
                </view>
              </navigator>
            </view>
            <view class="board-inner" v-else>
              <navigator v-for="(movie, i) in item.movies" :key="movie.rank + index + i" :url="'../item/main?id=' + movie.subject.id">
                <view class="borad-movie">
                  <image class="board-movie-image" :src="movie.subject.images.large" mode="aspectFill"/>
                  <text class="board-movie-text">{{ movie.subject.title }}</text>
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
        results.forEach((result, index) => {
          Vue.set(this.boards, index, {
            key: this.boards[index].key,
            title: result.title,
            movies: result.subjects
          });
        });
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

.board-swiper {
  height:480rpx;
}

.board-slide-image {
  height: 100%;
  width: 100%;
}

.board-list {
  box-sizing:border-box;
  background-color:#f8f9fb;
}

.board-item {
  display:flex;
  flex-direction:column;
  cursor:pointer;
  font-size:20rpx;
  margin:40rpx 0;
  padding:20rpx;
  background-color:#fff;
}

.board-title {
  display:flex;
  margin-bottom:10rpx;
  width:100%;
}

.board-title-text {
  flex:1;
}

.board-title-image {
  height:20rpx;
  width:20rpx;
}

.board-content {
  height:300rpx;
}

.board-inner {
  display:flex;
  flex-direction:row;
  height:300rpx;
  width:900rpx;
}

.board-movie {
  display:flex;
  flex-direction:column;
  width:180rpx;
  margin:10rpx;
}

.board-movie-image {
  width:180rpx;
  height:250rpx;
}

.board-movie-text {
  text-align:center;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

</style>
