<template>
  <div id="chapter_container">
    <h2 style="text-align:center">
      创建课程大纲
    </h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <!-- 章节模态框 -->
    <el-dialog
      :title="chapterDialogTitle"
      :visible.sync="isShowChapterDialog"
      width="40%"
      :before-close="handleClose"
    >
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>

        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShowChapterDialog=false">
          取消
        </el-button>
        <el-button type="primary" @click="saveOrUpdate">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 小节模态框 -->
    <el-dialog
      :title="videoDialogTitle"
      :visible.sync="isShowVideoDialog"
      width="40%"
      :before-close="handleClose"
    >
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>

        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>

        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">
              免费
            </el-radio>
            <el-radio :label="false">
              默认
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="handleBeforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_URL + '/eduvod/video/uploadAlyVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">
              上传视频
            </el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" style="padding-left:10px" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShowVideoDialog=false">
          取消
        </el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px">
      <el-form-item>
        <el-row>
          <el-col :span="6">
            <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
          </el-col>
          <el-col :span="12" style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleShowDialog">
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="width:80%">
        <el-tree
          ref="tree"
          :data="chapterVideoList"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :filter-node-method="filterNode"
        >
          <span slot-scope="{node, data}" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span style="position:absolute;right:30px;">
              <el-button
                v-if="data.children"
                type="text"
                size="mini"
                @click="handleAddVideo(data)"
              >
                添加
              </el-button>
              <el-button
                type="text"
                size="mini"
                style="color:#67C23A;"
                @click="handleEdit(data)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                style="color: red;"
                @click="handleDelete(data)"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button @click="previous">
          上一步
        </el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getChapterVideo, addChapter, getChapterInfo, updateChapter, deleteChapter } from '@/api/chapter'
import { addVideo, updateVideo, getVideoInfo, deleteVideo, deleteAlyVideo } from '@/api/video'
export default {
  name: 'Chapter',
  data() {
    return {
      chapterDialogTitle: '',
      videoDialogTitle: '',
      filterText: '',
      saveBtnDisabled: false,
      courseId: '',
      chapterVideoList: [],
      isShowChapterDialog: false, // 章节弹框
      isShowVideoDialog: false, // 小节弹框
      chapter: {
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      fileList: [],
      BASE_URL: process.env.VUE_APP_BASE_URL
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapterVideoList()
    }
  },
  methods: {
    handleShowDialog() {
      this.isShowChapterDialog = true
      this.chapterDialogTitle = '新增章节'
      this.chapter.title = ''
      this.chapter.sort = 0
      this.chapter.id = ''
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('cancel')
          done()
        })
        .catch(_ => {})
    },
    handleEdit(data) {
      if (!data.children) {
        // 子节点修改
        this.videoDialogTitle = '修改小节'
        this.isShowVideoDialog = true
        getVideoInfo(data.id).then(res => {
          console.log(res, '修改小节信息')
          this.video = res.data.video
          this.fileList = [{ 'name': this.video.videoOriginalName }]
        })
      } else {
        // 章节修改
        this.chapterDialogTitle = '修改章节'
        this.isShowChapterDialog = true
        getChapterInfo(data.id).then(res => {
          this.chapter = res.data.chapter
        })
      }
    },
    handleDelete(data) {
      if (!data.children) {
        // 删除小节
        deleteVideo(data.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除小节信息成功'
          })
          this.getChapterVideoList()
        })
      } else if (data.children.length !== 0) {
        this.$message({
          type: 'warning',
          message: '该节点存在子节点，请先删除子节点'
        })
      } else {
        // 删除章节
        deleteChapter(data.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除章节信息成功'
          })
          this.getChapterVideoList()
        })
      }
    },
    handleAddVideo(data) {
      console.log(data)
      this.videoDialogTitle = '新增小节'
      this.isShowVideoDialog = true
      this.video = {}
      this.video.chapterId = data.id
      this.fileList = []
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    previous() {
      this.$router.push({ path: '/addCourse/' + this.courseId })
    },
    next() {
      this.$router.push({ path: '/publishCourse/' + this.courseId })
    },
    getChapterVideoList() {
      getChapterVideo(this.courseId)
        .then(res => {
          this.chapterVideoList = res.data.list
        })
    },
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },
    addChapter() {
      this.chapter.courseId = this.courseId
      addChapter(this.chapter).then(res => {
        this.isShowChapterDialog = false
        this.$message({
          type: 'success',
          message: '添加章节成功'
        })
        // 刷新页面
        this.getChapterVideoList()
      })
    },
    updateChapter() {
      updateChapter(this.chapter).then(res => {
        console.log(res, '修改成功')
        this.isShowChapterDialog = false
        this.$message({
          type: 'success',
          message: '修改章节信息成功'
        })
        // 刷新页面
        this.getChapterVideoList()
      })
    },

    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.editVideo()
      }
    },
    addVideo() {
      console.log(this.courseId, 'courseId')
      this.video.courseId = this.courseId
      addVideo(this.video).then(res => {
        this.isShowVideoDialog = false
        this.$message({
          type: 'success',
          message: '添加小节成功'
        })
        // 刷新页面
        this.getChapterVideoList()
      })
    },
    editVideo() {
      updateVideo(this.video).then(res => {
        this.isShowVideoDialog = false
        this.$message({
          type: 'success',
          message: '修改小节成功'
        })
        this.getChapterVideoList()
      })
    },
    // 视频上传成功回调
    handleVodUploadSuccess(res, file, fileList) {
      this.video.videoSourceId = res.data.videoId
      this.video.videoOriginalName = file.name
    },
    // 视频上传超出限制时
    handleUploadExceed(files, fileList) {
      this.$message({
        type: 'warning',
        message: '想要重新上传视频，请先删除已上传的视频'
      })
    },
    // 删除上传视频前的操作
    handleBeforeVodRemove(file) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    handleVodRemove() {
      // 调用接口的删除视频的方法
      deleteAlyVideo(this.video.videoSourceId).then(res => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '删除视频成功'
        })
        // 将文件列表清空
        this.fileList = []
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    }
  }
}
</script>

<style>

</style>
