<template lang="pug">
  div.statistics-view
    .column
      .card
        h3.title 摘要
        .content
          table(v-if="data.PVUV")
            tbody 
              tr 
                th 时间段
                th 访客
                th 点击
              tr
                td 今天
                td.center {{ data.PVUV.today.uniqueview }}
                td.center {{ data.PVUV.today.pageview }}
              tr
                td 昨天
                td.center {{ data.PVUV.yesterday.uniqueview }}
                td.center {{ data.PVUV.yesterday.pageview }}
              tr
                td 过去七天
                td.center {{ data.PVUV.last7Days.uniqueview }}
                td.center {{ data.PVUV.last7Days.pageview }}
              tr
                td 过去三十天
                td.center {{ data.PVUV.last30Days.uniqueview }}
                td.center {{ data.PVUV.last30Days.pageview }}
              tr
                td 过去一年
                td.center {{ data.PVUV.last365Days.uniqueview }}
                td.center {{ data.PVUV.last365Days.pageview }}
      .card
        h3.title 浏览器
        .content
          table(v-if="data.browser")
            tr
              th 名称
              th 访问量
            tr(v-for="row in data.browser")
              td {{ row.name || 'unknown browser' }}
              td.center {{ row.count }}
              
      .card
        h3.title 页面排名
        .content
          table(v-if="data.pathRank")
            tr
              th(style="width: 70%") 路径
              th(style="width: 30%") 访问量
            tr(v-for="row in data.pathRank")
              td.ellipsis: span {{ row.name || 'unknwon' }}
              td.center {{ row.count }}
    .column
      .card
        h3.title 搜索引擎
        .content
          table(v-if="data.searchEngineRank")
            tr
              th 名称
              th 访问量
            tr(v-for="row in data.searchEngineRank")
              td.center {{ row.name }}
              td.center {{ row.count }}
      .card
        h3.title 国家/地区
        .content
          table(v-if="data.countryRank")
            tr
              th 代号
              th 访问量
            tr(v-for="row in data.countryRank")
              td.center {{ row.country || 'N/A' }}
              td.center {{ row.count }}
      .card
        h3.title 引用排名
        .content
          table(v-if="data.referrerRank")
            tr
              th 引用源
              th 访问量
            tr(v-for="row in data.referrerRank")
              td.center {{ row.origin || '未知源' }}
              td.center {{ row.count }}
</template>

<script>
import axios from 'axios';

export default {
  name: 'StatisticsView',
  data () {
    return {
      statistics: {},
    };
  },
  computed: {
    data () {
      return this.$store.state.statistics.data;
    }
  },
  mounted () {
  },
  created() {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
      return;
    }
    this.$store.dispatch('fetchStatistics');
  }
};
</script>

<style lang="scss">
div.statistics-view {
  display: flex;
  .column {
    width: 49%;
    margin-right: 1%;
  }
  .content {
    padding: 1em;

    table {
      width: 100%;
      
      .center {
        text-align: center;
      }

      .ellipsis {
        position: relative;
      }
      .ellipsis:before {
        content: '&nbsp;';
        visibility: hidden;
      }
      .ellipsis span {
        position: absolute;
        left: 0;
        right: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>