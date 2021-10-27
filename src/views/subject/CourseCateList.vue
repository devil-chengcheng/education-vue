<template>
  <div id="course_container">
    <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px">
      <el-breadcrumb-item :to="{ path: '/'}">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-form
        ref="form"
        :inline="true"
        label-width="60px"
        size="small"
      >
        <el-form-item>
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        </el-form-item>

        <el-form-item>
          <el-button type="success" icon="el-icon-plus" @click="isShowExportDialog = !isShowExportDialog">
            新增
          </el-button>
        </el-form-item>

        <div v-if="isShowExportDialog">
          <import @cancel="isShowExportDialog=!isShowExportDialog" />
        </div>

        <el-tree
          ref="tree"
          :data="subjectData"
          :props="defaultProps"
          :filter-node-method="filterNode"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getSubjectList } from '@/api/course'
import Import from '@/views/subject/component/Import'
export default {
  name: 'CourseList',
  components: {
    Import
  },
  data() {
    return {
      filterText: '',
      subjectData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      isShowExportDialog: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getSubjectData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    getSubjectData() {
      getSubjectList()
        .then(res => {
          this.subjectData = res.data.list
        })
    },
    cancel() {
      this.isShowExportDialog = false
    }
  }

}
</script>

<style>

</style>
