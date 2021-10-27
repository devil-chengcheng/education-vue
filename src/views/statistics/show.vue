<template>
  <div class="app-container">
    <el-form :inline="true" label-width="100px" size="small">
      <el-form-item label="统计类型">
        <el-select v-model="searchObj.type" placeholder="请选择">
          <el-option label="学员登录数统计" value="login_num" />
          <el-option label="学员注册数统计" value="register_num" />
          <el-option label="课程播放数统计" value="video_view_num" />
          <el-option label="每日课程数统计" value="course_num" />
        </el-select>
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-button
        v-model="searchObj.end"
        type="primary"
        icon="el-icon-search"
        @click="showChart"
      >
        查询
      </el-button>
    </el-form>

    <div class="chart-container">
      <el-card>
        <div id="chart" class="chart" style="height:500px;width:100%" />
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

import { getChartData } from '@/api/sta'

export default {
  data() {
    return {
      searchObj: {
        type: '',
        begin: '',
        end: ''
      },
      btnDisabled: false,
      chart: null,
      title: '',
      xData: [],
      yData: []
    }
  },
  methods: {
    showChart() {
      this.initChartData()
      this.renderChart()
    },
    initChartData() {
      getChartData(this.searchObj).then(res => {
        console.log(res, 'res')
        this.yData = res.data.dataList
        this.xData = res.data.dateList

        switch (this.searchObj.type) {
          case 'register_num':
            this.title = '学员注册数统计'
            break
          case 'login_num':
            this.title = '学员登录数统计'
            break
          case 'video_view_num':
            this.title = '课程播放数统计'
            break
          case 'course_num':
            this.title = '每日课程数统计'
            break
        }
        this.renderChart()
      })
      // 基于准备好的 dom ，初始化 echarts 实例
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(document.getElementById('chart'), 'macarons')
    },
    renderChart() {
      const option = {
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis'
        },
        // x 轴是类目轴（离散数据），必须通过 data 设置类目数据
        xAxis: {
          type: 'category',
          data: this.xData,
          axisLabel: {
            color: '#95a4bd'
          },
          axisLine: {
            lineStyle: {
              color: '#95a4bd'
            }
          }
        },
        // y 轴是数据轴（连续数据）
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            color: '#95a4bd'
          },
          axisLine: {
            lineStyle: {
              color: '#95a4bd'
            }
          }
        },
        // grid: {
        //   left: 10,
        //   right: 10,
        //   bottom: 10,
        //   top: 10
        // },
        // dataZoom 组件，默认控制 x 轴
        // dataZoom: [{
        //   type: 'slider'
        // }],
        // 系列列表。每个系列通过 type 决定自己的图表类型

        // 工具类
        toolbox: {
          show: true,
          top: 0,
          feature: {
            saveAsImage: {
              show: true
            },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {
              show: true
            },
            dataZoom: {
              show: true
            }
          }
        },
        series: [{
          // 系列中的数据内容数组
          data: this.yData,
          // 折线图
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#409EFF',
              lineStyle: {
                color: '#409EFF',
                width: 2
              }
            }
          }
        }]
      }
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
