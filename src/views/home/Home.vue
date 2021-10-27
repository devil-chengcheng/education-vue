<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <span>
          <h2 style="margin-left:10px;margin-bottom:25px">
            在线教育系统
          </h2>
          <!-- <img
            src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2263529577,4278992858&fm=26&gp=0.jpg"
            width="250px"
            style="margin-left: 10px; margin-top: 5px"
            height="100%"
            alt
            srcset
          > -->
        </span>
      </div>
      <el-dropdown>
        <div class="block">
          <el-avatar
            :size="50"
            src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2263529577,4278992858&fm=26&gp=0.jpg"
            style="cursor: pointer"
          />
        </div>
        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item>
            <span type="danger" @click="toWelcome">
              <span class="el-icon-house" />
              系统首页
            </span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span type="danger" @click="logout">
              <span class="el-icon-switch-button" />
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside :width="isOpen == true ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleMenu">
          |||
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isOpen"
          :router="true"
          :default-active="activePath"
          background-color="#272c33"
          :collapse-transition="false"
          text-color="rgba(255,255,255,0.7)"
          unique-opened
        >
          <Sidebar :menu-list="MenuList" />
        </el-menu>
      </el-aside>
      <el-main v-loading="loading">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from '@/views/sidebar/Sidebar'
export default {
  name: 'Home',
  components: {
    Sidebar
  },
  data() {
    return {
      loading: true,
      isOpen: false,
      activePath: '', // 激活的路径
      MenuList: {},
      userInfo: {}
    }
  },
  // computed() {},
  created() {
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    toWelcome() {},
    logout() {
      this.$store.dispatch('Logout').then(() => {
        location.reload()
      })
    }
  }

}
</script>

<style lang="less" scoped>
.home_container {
  width: 100%;
  height: 100% !important;
}
.el-header {
  background-color: #272c33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 19px;
  padding-left: 0px;
}

.el-aside {
  background-color: #272c33;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-btn {
  background-color: #2d3a4b;
  line-height: 24px;
  font-size: 10px;
  color: #fff;
  text-align: center;
}
</style>
