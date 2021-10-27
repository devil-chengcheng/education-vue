<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-button :disabled="btnDisabled" type="primary" @click="handleCreate">
        生成
      </el-button>
    </el-form>

    <el-card>
      <line-chart />
    </el-card>
  </div>
</template>

<script>
import { createStatistics } from '@/api/sta'
import LineChart from './LineChart'
export default {
  components: {
    LineChart
  },
  data() {
    return {
      day: '',
      btnDisabled: false
    }
  },
  methods: {
    handleCreate() {
      this.btnDisabled = true
      createStatistics(this.day).then(res => {
        this.btnDisabled = false
        this.$message({
          type: 'success',
          message: '生成成功'
        })
      })
    }
  }
}
</script>

<style>

</style>

    LineChart
