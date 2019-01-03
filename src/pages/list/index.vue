<template>
  <div>
    <movie-list :movies="movies" :has-more="hasMore" :type="type"></movie-list>
  </div>
</template>

<script>
import MovieList from '@/components/movie-list';
import { getBoardData } from '../../utils/api.js';

export default {
  components: {
    'movie-list': MovieList
  },

  data () {
    return {
      page: 1,
      hasMore: true,
      movies: [],
      type: ''
    };
  },

  methods: {
    load (type, refresh, search) {
      if (refresh) {
        this.page = 0;
        this.movies = [];
        this.hasMore = true;
      }
      if (!this.hasMore) return;
      getBoardData({ board: type, page: this.page++, search }).then((result) => {
        this.movies = this.movies.concat(result.subjects);
        this.hasMore = result.total > this.movies.length;
      });
    }
  },

  mounted () {
    const { title, type } = this.$root.$mp.query;
    wx.setNavigationBarTitle({ title: title + ' « 电影 « 豆瓣' });
    this.type = type;
    this.load(this.type);
  },

  onPullDownRefresh () {
    this.load(this.type, true);
    wx.stopPullDownRefresh();
  },

  onReachBottom () {
    this.load(this.type);
  }

};
</script>

<style>

</style>
