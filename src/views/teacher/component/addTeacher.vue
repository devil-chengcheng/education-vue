<template>
  <div id="addTeacher" style="display: flex;">
    <el-dialog
      :title="formMsg"
      :visible.sync="isShowAddDialog"
      width="45%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="addTeacherData"
        label-width="70px"
        size="small"
      >
        <el-form-item
          label="姓名"
          style="width:45%"
        >
          <el-input v-model="addTeacherData.name" />
        </el-form-item>

        <el-form-item label="头衔" style="width:45%">
          <el-select v-model="addTeacherData.level" clearable placeholder="讲师头衔">
            <el-option label="高级讲师" :value="1" />
            <el-option label="首席讲师" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="资历" style="width:45%">
          <el-input v-model="addTeacherData.career" />
        </el-form-item>

        <el-form-item label="排序" style="width:45%">
          <el-input-number v-model="addTeacherData.sort" controls-position="right" :min="0" :max="100" />
        </el-form-item>

        <div class="intro_container">
          <el-form-item label="简介" style="width: 90%; display: block;">
            <el-input v-model="addTeacherData.intro" type="textarea" :rows="3" size="medium" placeholder="请输入内容" style="width:100%" />
          </el-form-item>
        </div>

        <!-- 讲师头像 -->
        <el-form-item label="头像">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="addTeacherData.avatar" />
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
            更换头像
          </el-button>
          <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 -->

          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            :url="BASE_API+'/eduoss/fileoss'"
            field="file"
            @close="closeImageCropper"
            @crop-upload-success="cropSuccess"
          />
        </el-form-item>

        <el-row style="text-align:center">
          <el-form-item>
            <el-button @click="handleCancel">
              取消
            </el-button>
            <el-button
              type="primary"
              :disabled="saveBtnDisabled"
              @click="saveOrUpdate"
            >
              提交
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'
import { addTeacher, getTeacherInfo, updateTeacher } from '@/api/teacher'
export default {
  name: 'AddTeacher',
  components: {
    PanThumb,
    ImageCropper
  },
  props: [
    'addOrEdit',
    'editId'
  ],
  data() {
    return {
      addTeacherData: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      saveBtnDisabled: false,
      isShowAddDialog: true,
      formMsg: '',
      // 上传弹框组件是否显示
      imagecropperShow: false,
      imagecropperKey: 0,
      BASE_API: 'http://localhost:9001/api'
    }
  },
  created() {
    this.isAddOrEdit()
  },
  methods: {
    // 判断使添加还是修改
    isAddOrEdit() {
      if (this.addOrEdit === 'add') {
        this.formMsg = '添加讲师'
      } else {
        this.formMsg = '修改讲师'
        this.getInfo(this.editId)
      }
    },
    // handleSortChange(value) {
    //   console.log(value)
    // },
    // 根据讲师 id 查询方法
    getInfo(id) {
      getTeacherInfo(id)
        .then(res => {
          console.log(res, 'getTeacherById')
          this.addTeacherData = res.data.item
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('cancelAdd')
          done()
        })
        .catch(_ => {})
    },
    handleCancel() {
      this.$emit('cancelAdd')
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (this.addOrEdit === 'add') {
        this.saveTeacher()
      } else {
        this.updateTeacher()
      }
    },
    saveTeacher() {
      addTeacher(this.addTeacherData)
        .then(res => {
          // 提示信息
          this.$message({
            type: 'success',
            showClose: true,
            center: true,
            message: '添加成功'
          })

          this.$emit('submit')
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        })
    },
    updateTeacher() {
      console.log('update')
      updateTeacher(this.editId, this.addTeacherData)
        .then(res => {
          this.$message({
            type: 'success',
            showClose: true,
            center: true,
            message: '修改成功'
          })
          this.$emit('submit')
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '修改失败'
          })
        })
    },
    // 关闭上传弹框的方法
    closeImageCropper() {
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },
    // 上传成功方法
    cropSuccess(data) {
      this.imagecropperShow = false
      // 上传成功后返回路径地址
      this.addTeacherData.avatar = data.url
    }
  }
}
</script>

<style>
.intro_container .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__labe {
	width: 85%;
}
</style>
