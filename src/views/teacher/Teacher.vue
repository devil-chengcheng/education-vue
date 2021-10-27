<template>
  <div id="teachers">
    <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px">
      <el-breadcrumb-item :to="{ path: '/'}">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>讲师管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-form
        ref="form"
        :inline="true"
        :model="formData"
        label-width="60px"
        size="small"
      >
        <el-form-item>
          <el-input v-model="teacherQuery.name" placeholder="讲师名" />
        </el-form-item>

        <el-form-item>
          <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
            <el-option label="高级讲师" :value="1" />
            <el-option label="首席讲师" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            size="mini"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="选择截至时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="seachList">
            查询
          </el-button>

          <el-button type="default" icon="el-icon-refresh" @click="resetData">
            重置
          </el-button>

          <el-button type="success" icon="el-icon-plus" @click="handleAddTeacher">
            添加
          </el-button>
        </el-form-item>

        <!-- <el-dialog
          title="添加讲师"
          :visible.sync="isShowAddDialog"
          width="45%"
          :before-close="handleClose"
        >
          <add-teacher :showflag="isShowAddDialog" />
        </el-dialog> -->

        <div v-if="isShowAddDialog">
          <add-teacher
            :add-or-edit="addOrEdit"
            :edit-id="editId"
            @cancelAdd="handleAddTeacher"
            @submit="handleSubmit"
          />
        </div>

        <el-table :data="teachersList" size="small" border style="width: 90%">
          <el-table-column label="序号" width="50px" align="center">
            <template slot-scope="scope">
              {{ (current-1)*limit + scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="80px" align="center" />
          <el-table-column prop="level" label="头衔" width="100px" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === 1" type="success">
                {{ "高级讲师" }}
              </el-tag>
              <el-tag v-else type="primary">
                {{ "首席讲师" }}
              </el-tag>
              <!-- <el-tag type="success">
                {{
                  scope.row.level === "1" ? "高级讲师" : "首席讲师"
                }}
              </el-tag> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="intro" label="简介" align="center" /> -->
          <el-table-column prop="career" label="资历" align="center" />
          <el-table-column prop="sort" label="排序" width="50px" align="center" />
          <el-table-column prop="gmtCreate" label="添加时间" align="center" />

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                class="el-icon-edit"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                class="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="padding: 30px 0;text-align:center;"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="current"
          :page-sizes="[8, 10, 15, 20]"
          :page-size="limit"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getTeacherListPage, deleteTeacherById } from '@/api/teacher'
import addTeacher from '@/views/teacher/component/addTeacher'
export default {
  name: 'Teacher',
  components: {
    addTeacher
  },
  data() {
    return {
      formData: {},
      teachersList: null,
      current: 1,
      limit: 8,
      teacherQuery: {},
      total: 0,
      isShowAddDialog: false,
      addOrEdit: 'add',
      editId: ''
    }
  },
  created() {
    this.getTeacherList()
  },
  methods: {
    getTeacherList() {
      getTeacherListPage(this.current, this.limit, this.teacherQuery)
        .then(res => {
          this.teachersList = res.data.rows
          this.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    seachList() {
      this.current = 1
      this.getTeacherList()
    },
    resetData() {
      this.teacherQuery = {}
      this.getTeacherList()
    },
    handleSizeChange(val) {
      this.limit = val
      this.getTeacherList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getTeacherList()
    },
    handleEdit(row) {
      this.addOrEdit = 'edit'
      this.editId = row.id
      this.isShowAddDialog = true
      // this.$message({
      //   showClose: true,
      //   center: true,
      //   message: `选中修改 index: ${index}, row: ${row}`
      // })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该讲师，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTeacherById(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                showClose: true,
                center: true,
                message: '删除成功'
              })
              this.getTeacherList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleAddTeacher() {
      this.addOrEdit = 'add'
      this.editId = ''
      this.isShowAddDialog = !this.isShowAddDialog
    },
    handleSubmit() {
      this.isShowAddDialog = false
      this.getTeacherList()
    }
  }
}
</script>

<style>

</style>
