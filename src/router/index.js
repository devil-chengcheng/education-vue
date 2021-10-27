import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'

Vue.use(Router)

// import Layout from '@/layout/index'

const routes = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/404',
    hidden: true,
    component: () => import('@/views/error-pages/404.vue')
  },
  {
    path: '/',
    component: () => import('@/views/home/Home.vue'),
    children: [
      {
        path: '/teacher',
        name: 'teacher',
        component: () => import('@/views/teacher/Teacher.vue')
      },
      {
        path: '/courseCateList',
        name: 'courseCateList',
        component: () => import('@/views/subject/CourseCateList.vue')
      },
      {
        path: '/courseList',
        name: 'courseList',
        component: () => import('@/views/course/CourseList.vue')
      },
      {
        path: '/addCourse',
        name: 'addCourse',
        component: () => import('@/views/course/component/Info.vue')
      },
      {
        path: '/addCourse/:id',
        name: 'addCourse',
        component: () => import('@/views/course/component/Info.vue')
      },
      {
        path: '/addChapter/:id',
        name: 'addChapter',
        component: () => import('@/views/course/component/Chapter.vue')
      },
      {
        path: '/publishCourse/:id',
        name: 'publishCourse',
        component: () => import('@/views/course/component/Publish')
      },
      {
        path: '/statistics/create',
        name: 'StatisticsDailyCreate',
        component: () => import('@/views/statistics/create')
      },
      {
        path: '/statistics/show',
        name: 'chartShow',
        component: () => import('@/views/statistics/show')
      }
      // {
      //   path: '/statistics/daily',
      //   redirect: '/statistics/daily/create',
      //   name: 'Statistics',
      //   children: [{
      //     path: 'create',
      //     name: 'StatisticsDailyCreate',
      //     component: () => import('@/views/statics/daily/create')
      //   }]
      // }
    ]
  }
  // {
  //   path: '/teacher',
  //   name: 'teacher',
  //   component: () => import('@/views/teacher/Teacher.vue')
  // }

]

export const menuRoutes = routes

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    }
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
