<template>
  <div class="import-container">
    <el-dialog
      title="上传课程"
      :visible.sync="isShowExportDialog"
      width="45%"
      :before-close="handleClose"
    >
      <el-form label-width="120px">
        <el-form-item label="信息描述">
          <el-tag type="info">
            excel模板说明
          </el-tag>
          <el-tag>
            <i class="el-icon-download" />
            <a :href="'./01.xlsx'" download="分析模板.xlsx">点击下载模板</a>
          </el-tag>
        </el-form-item>

        <el-form-item label="选取Excel">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :disabled="importBtnDisabled"
            :limit="1"
            :action="BASE_API + '/eduservice/subject/addSubject'"
            name="file"
            accept="application/vnd.ms-excel"
          >
            <el-button slot="trigger" size="small" type="primary">
              选取文件
            </el-button>
            <el-button
              :loading="loading"
              style="margin-left:10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >
              {{ fileUploadBtnText }}
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Import',
  data() {
    return {
      BASE_API: 'http://localhost:9001/api',
      OSS_PATH: 'https://oss.console.aliyun.com/bucket/oss-cn-beijing/education-1997/',
      fileUploadBtnText: '上传到服务器', // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false,
      isShowExportDialog: true
    }
  },
  methods: {
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.importBtnDisabled = true
      this.loading = true
      // js原生代码写法：document.getElementById("upload").submit()
      this.$refs.upload.submit()
    },
    fileUploadSuccess(res) {
      // 提示信息
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程成功'
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('cancel')
          done()
        })
        .catch(_ => {})
    },

    fileUploadError(res) {
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加课程失败'
      })
    }
  }
}
</script>

<style>

</style>
