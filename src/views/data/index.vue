<template>
  <div>
    <div style="margin: 20px 20px 0 20px;">
      <el-row :gutter="40">
        <el-col v-for="(item,index) in cardData" :span="6" :key="index">
          <div :class="item.class + ' c-card-box'" style="">
            <el-row type="flex" class="c-box-main">
              <el-col :span="12">
                <i :class="item.icon" style="font-size: 80px;color: #fff;"></i>
                <p style="margin-left: 6px;">{{item.text}}</p>
              </el-col>
              <el-col :span="12">
                <p style="font-size: 40px;margin: 0;">
                  <countTo :startVal='0' :endVal='item.num' :duration='3000'></countTo>
                </p>
              </el-col>
            </el-row>
            <img src="@/assets/images/circle.svg" class="box-bg">
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container" style="margin-top: 0;">
      <el-row :gutter="50">
        <el-col :span="16">
          <p>一周记录统计</p>
          <ve-line :data="dateData" :settings="chartSettings"></ve-line>
        </el-col>
        <el-col :span="8">
          <p>记录分析</p>
          <ve-pie :data="pieData"></ve-pie>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import countTo from 'vue-count-to';
  import {
    getCount
  } from '@/api/data.js'
  export default {
    components: {
      countTo
    },
    data() {
      this.chartSettings = {
        area: true
      }
      return {
        cardData: [],
        dateData: {
          columns: ['日期', '全部记录', '来电记录', '去电记录', '未接记录'],
          rows: [{
              '日期': '2021-05-22',
              '来电记录': 991,
              '去电记录': 8
            }
          ]
        },
        pieData: {
          columns: ['title', 'num'],
          rows: []
        }
      }
    },
    created() {
      getCount().then(res => {
        if (res.code == 200) {
          this.dateData.rows = res.data.date_count
          this.handleCallData(res.data.call_count)
        }
      })
    },
    methods: {
      handleCallData(data) {
        this.pieData.rows = [{
            'title': '来电记录',
            'num': data[0].laidian
          },
          {
            'title': '去电记录',
            'num': data[0].qudian
          },
          {
            'title': '未接记录',
            'num': data[0].weijie
          },
          {
            'title': '现场录音',
            'num': data[0].scene
          }
        ]
        this.cardData=[{
            'text': '全部记录',
            'icon': 'el-icon-data-analysis',
            'num': parseInt(data[0].call_total),
            'class': 'bg1',
          },
          {
            'text': '来电记录',
            'icon': 'el-icon-phone-outline',
            'num': parseInt(data[0].laidian),
            'class': 'bg2',
          },
          {
            'text': '去电记录',
            'icon': 'el-icon-phone-outline',
            'num': parseInt(data[0].qudian),
            'class': 'bg3',
          },
          {
            'text': '未接记录',
            'icon': 'el-icon-phone',
            'num': parseInt(data[0].weijie),
            'class': 'bg4',
          }]
      }
    }
  }
</script>

<style>
  .c-card-box {
    padding: 30px;
    border-radius: 5px;
    position: relative;
    color: #fff;
    margin-bottom: 20px;
  }

  .c-box-main {
    margin-bottom: 0;
    align-items: center;
  }

  .box-bg {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
  }

  .bg1 {
    background: linear-gradient(to right, #90caf9, #047edf 99%);
  }

  .bg2 {
    background: linear-gradient(to right, #ffbf96, #fe7096);
  }

  .bg3 {
    background: linear-gradient(to right, #84d9d2, #07cdae);
  }

  .bg4 {
    background: linear-gradient(to right, rgb(217, 132, 191), rgb(205, 199, 7));
  }
</style>
