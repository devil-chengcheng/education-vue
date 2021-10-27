<template>
  <div id="course-list-container">
    <el-form :inline="true" class="courseForm" size="small">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseQuery.subjectParentId"
          placeholder="请选择"
          @change="changeSubjectOne"
        >
          <el-option v-for="subject in subjectOneList" :key="subject.id" :label="subject.title" :value="subject.id" />
        </el-select>

        <el-select v-model="courseQuery.subjectId" placeholder="请选择">
          <el-option v-for="subject in subjectTwoList" :key="subject.id" :label="subject.title" :value="subject.id" />
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程标题" />
      </el-form-item>

      <!-- 讲师 -->
      <el-form-item>
        <el-select v-model="courseQuery.teacherId" placeholder="请选择讲师">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchList">
          查询
        </el-button>
        <el-button type="default" icon="el-icon-refresh" @click="resetData">
          清空
        </el-button>
        <el-button type="success" icon="el-icon-plus" @click="addCourse">
          新增
        </el-button>
      </el-form-item>

      <el-table
        v-loading="courseListLoading"
        :data="courseList"
        element-loading-text="数据加载中"
        size="small"
        border
        fit
        highlight-current-row
        style="width:90%"
        row-class-name="myClassList"
      >
        <el-table-column
          label="序号"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            {{ (current - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="课程信息" width="470" align="center">
          <template slot-scope="scope">
            <div class="info">
              <div class="pic">
                <img :src="scope.row.cover" alt="scope.row.title" width="150px">
              </div>
              <div class="title">
                <a href="">{{ scope.row.title }}</a>
                <p>{{ scope.row.lessonNum }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 10) }}
          </template>
        </el-table-column>

        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtModified.substr(0, 10) }}
          </template>
        </el-table-column>

        <el-table-column label="价格" width="100" align="center">
          <template slot-scope="scope">
            {{ Number(scope.row.price) == 0 ? '免费' : '￥' + scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column prop="buyCount" label="付费人数" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.buyCount }}人
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <router-link :to="'/addCourse/' + scope.row.id">
              <el-button type="text" size="mini" icon="el-icon-edit">
                编辑课程信息
              </el-button>
            </router-link>
            <router-link :to="'/addChapter/' + scope.row.id">
              <el-button type="text" size="mini" icon="el-icon-edit">
                编辑课程大纲
              </el-button>
            </router-link>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              style="color:red;"
              @click="handleDeleteCourse(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="padding: 30px 0;text-align:center;"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="current"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-form>
  </div>
</template>

<script>
import { getSubjectList, getAllTeacher, getCourseListPage, deleteCourse } from '@/api/course'
export default {
  name: 'CourseList',
  components: {},
  data() {
    return {
      courseQuery: {
        title: '',
        teacherId: '',
        subjectParentId: '',
        subjectId: ''
      },
      subjectOneList: [],
      subjectTwoList: [],
      teacherList: [],
      courseList: null,
      courseListLoading: true,
      current: 1,
      limit: 5,
      total: 0
    }
  },
  created() {
    this.getCourseData()
    this.getSubjectData()
    this.getTeacherData()
  },
  methods: {
    getCourseData() {
      this.courseListLoading = true
      getCourseListPage(this.current, this.limit, this.courseQuery).then(res => {
        this.courseList = res.data.rows
        this.total = res.data.total
        this.courseListLoading = false
        console.log(res, 'res')
      })
    },
    getSubjectData() {
      getSubjectList().then(res => {
        this.subjectOneList = res.data.list
      })
    },
    getTeacherData() {
      getAllTeacher().then(res => {
        this.teacherList = res.data.item
      })
    },
    changeSubjectOne(value) {
      this.courseQuery.subjectId = ''
      this.subjectOneList.forEach(item => {
        if (item.id === value) {
          this.subjectTwoList = item.children
        }
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getCourseData()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getCourseData()
    },
    searchList() {
      this.current = 1
      this.getCourseData()
    },
    resetData() {
      this.courseQuery = {}
      this.getCourseData()
    },
    addCourse() {
      this.$router.push({ path: '/addCourse' })
    },
    handleDeleteCourse(id) {
      this.$confirm('此操作将删除该课程及课程章节小节信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 删除
        deleteCourse(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除课程成功'
          })
          this.getCourseData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}

.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}

.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.myClassList .info .pic img {
  display: block;
  width: 100%;
}

.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}

.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}

.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>
