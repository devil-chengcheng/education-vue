<template>
  <div id="publish_container">
    <h2 style="text-align:center">
      发布新课程
    </h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <div class="publishClass">
      <img :src="publishInfo.cover">
      <div class="main">
        <h2>{{ publishInfo.title }}</h2>
        <p class="gray">
          <span>共{{ publishInfo.lessonNum }}课时</span>
        </p>
        <p>
          <span>所属分类：{{ publishInfo.oneSubject }} - {{ publishInfo.twoSubject }}</span>
        </p>
        <p>课程讲师：{{ publishInfo.teacherName }}</p>
        <h3 class="red">
          ￥{{ publishInfo.price }}
        </h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">
        返回修改
      </el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">
        发布课程
      </el-button>
    </div>

    <!-- <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">
          返回修改
        </el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">
          发布课程
        </el-button>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>
import { getCoursePublishInfo, publishCourse } from '@/api/course'
export default {
  name: 'Publish',
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '',
      publishInfo: {}
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCoursePublishInfo()
    }
  },
  methods: {
    previous() {
      this.$router.push({ path: '/addChapter/' + this.courseId })
    },
    publish() {
      console.log('publish')
      publishCourse(this.courseId).then(res => {
        this.$message({
          type: 'success',
          message: '课程发布成功'
        })
        this.$router.push({ path: '/courseList' })
      })
    },
    getCoursePublishInfo() {
      getCoursePublishInfo(this.courseId).then(res => {
        this.publishInfo = res.data.courseInfo
        console.log(this.publishInfo, 'publishInfo')
      })
    }
  }
}
</script>

<style scoped>
.publishClass {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
  width: 90%;
}

.publishClass img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.publishClass .main {
  margin-left: 520px;
}

.publishClass .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.publishClass .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.publishClass .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>
