<template>
  <div>
    <el-menu-item index="home">
      <i class="el-icon-s-home" />
      <span>首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-setting" />
        <span>系统管理</span>
      </template>
      <el-menu-item index="2-1">
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="2-2">
        <span>角色管理</span>
      </el-menu-item>
      <el-menu-item index="2-1">
        <span>权限管理</span>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="teacher" route="/teacher">
      <i class="el-icon-user" />
      <span>讲师管理</span>
    </el-menu-item>
    <el-menu-item index="courseCateList" route="/courseCateList">
      <i class="el-icon-folder" />
      <span>课程分类管理</span>
    </el-menu-item>
    <el-submenu index="course">
      <template slot="title">
        <i class="el-icon-wallet" />
        <span>课程管理</span>
      </template>
      <el-menu-item index="courseList" route="/courseList">
        <span>课程列表</span>
      </el-menu-item>
      <el-menu-item index="addCourse" route="/addCourse">
        <span>添加课程</span>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="statistics">
      <template slot="title">
        <i class="el-icon-s-data" />
        <span>统计分析</span>
      </template>
      <el-menu-item index="create" route="/statistics/create">
        <span>生成统计</span>
      </el-menu-item>
      <el-menu-item index="show" route="/statistics/show">
        <span>图表展示</span>
      </el-menu-item>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: ['menuList'],
  data() {
    return {}
  },
  created() {},
  methods: {
    savePath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style>
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>
