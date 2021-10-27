<template>
  <div id="info_container">
    <h2 style="text-align: center">
      发布新课程
    </h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom:40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="实例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>
      <!-- 所属分类 -->
      <!-- <el-form-item label="所属分类">
        <el-cascader v-model="courseInfo.subjectId" :options="subjectData" />
      </el-form-item> -->

      <el-form-item label="课程分类">
        <el-select v-model="courseInfo.subjectParentId" placeholder="一级分类" @change="oneSubjectChange">
          <el-option v-for="one in oneSubjects" :key="one.id" :label="one.title" :value="one.id" />
        </el-select>

        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option v-for="two in twoSubjects" :key="two.id" :label="two.title" :value="two.id" />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" filterable placeholder="请选择">
          <el-option v-for="teacher in teachersList" :key="teacher.id" :label="teacher.name" :value="teacher.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum" :min="0" controls-position="right" />
      </el-form-item>

      <el-form-item label="价格">
        <el-input-number v-model="courseInfo.price" :min="0" controls-position="right" />
      </el-form-item>

      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>

      <el-form-item label="课程封面">
        <el-upload
          ref="upload"
          list-type="picture"
          :on-success="handleCoverSuccess"
          :on-error="handleCoverError"
          :before-upload="beforeCoverUpload"
          :auto-upload="false"
          :disabled="uploadBtnDisabled"
          :limit="1"
          :action="BASE_URL +'/eduoss/fileoss/uploadCover'"
          accept="image/jpeg,image/gif,image/png,image/bmp"
        >
          <el-button slot="trigger" size="small" icon="el-icon-search" type="primary">
            选取文件
          </el-button>
          <el-button :loading="loading" type="success" size="small" icon="el-icon-upload" style="margin-left:10px;" @click="submitUpload">
            {{ fileUploadBtnText }}
          </el-button>
          <div slot="tip" class="el-upload_tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">
          保存并下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSubjectList, getAllTeacher, addCourseInfo, getCourseInfoById, updateCourseInfo } from '@/api/course'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'CourseInfo',
  components: {
    Tinymce
  },
  data() {
    return {
      // subjectData: {},
      teachersList: [],
      oneSubjects: [],
      twoSubjects: [],
      loading: false,
      saveBtnDisabled: false, // 保存按钮是否禁用
      uploadBtnDisabled: false,
      fileUploadBtnText: '上传到服务器',
      courseId: '',
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: process.env.VUE_APP_OSS_PATH + '/cover/default.png',
        price: 0
      },
      OSS_PATH: process.env.VUE_APP_OSS_PATH,
      BASE_URL: process.env.VUE_APP_BASE_URL
    }
  },
  created() {
    // 获取路由 id 值
    if (this.$route.params && this.$route.params.id) {
      // 修改操作
      this.courseId = this.$route.params.id
      this.getCourseInfo()
    } else {
      // 添加操作
      this.getSubjectData()
      this.getTeacherData()
    }
  },
  methods: {
    next() {
      // 判断是添加操作还是修改操作
      if (!this.courseInfo.id) {
        this.saveCourseInfo()
      } else {
        this.updateCourseInfo()
      }
    },
    getCourseInfo() {
      getCourseInfoById(this.courseId)
        .then(res => {
          // 在 courseInfo 课程基本信息，包含一级分类 id 和二级分类 id
          this.courseInfo = res.data.course
          // 查询所有得分类，包含一级和二级
          getSubjectList()
            .then(res => {
              // 获取所有一级分类
              this.oneSubjects = res.data.list

              // 遍历所有一级分类数组
              for (let i = 0; i < this.oneSubjects.length; i++) {
                // 获取每个一级分类
                const oneSubject = this.oneSubjects[i]
                // 比较当前courseInfo里面一级分类id和所有一级分类 id
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  // 获取一级分类中所有得二级分类
                  this.twoSubjects = oneSubject.children
                }
              }
            })
        })
    },
    saveCourseInfo() {
      addCourseInfo(this.courseInfo)
        .then(res => {
          this.courseId = res.data.courseId
          this.$message({
            type: 'success',
            message: '添加课程信息成功'
          })
          this.$router.push({ path: '/addChapter/' + this.courseId })
        })
    },
    updateCourseInfo() {
      updateCourseInfo(this.courseInfo).then(res => {
        this.$message({
          type: 'success',
          message: '修改课程信息成功'
        })
        this.$router.push({ path: '/addChapter/' + this.courseId })
      })
    },
    getSubjectData() {
      getSubjectList().then(res => {
        this.oneSubjects = res.data.list
      })
    },
    getTeacherData() {
      getAllTeacher().then(res => {
        this.teachersList = res.data.item
      })
    },
    oneSubjectChange(value) {
      this.courseInfo.subjectId = ''
      this.oneSubjects.forEach(item => {
        if (item.id === value) {
          this.twoSubjects = item.children
        }
      })
    },
    handleCoverSuccess(res) {
      this.courseInfo.cover = res.data.url
      this.loading = false
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    handleCoverError() {
      this.loading = false
      this.$message({
        type: 'error',
        message: '上传文件失败'
      })
    },
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'

      const isfitSize = file.size / 1024 / 1024 < 2

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传封面图片只能是 JPG/GIF/PNG/BMP 格式！')
      }

      if (!isfitSize) {
        this.$message.error('上传封面图片大小不能超过 2MB!')
      }
      return (isJPG || isGIF || isPNG || isBMP) && isfitSize
    },
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.uploadBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit()
    }

  }
}
</script>

<style>
.el-upload_tip {
  font-size: 12px;
  color: #888;
}

.tinymce-container {
  line-height: 29px;
}
</style>
