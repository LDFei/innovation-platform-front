/**
 * 管理员审核中心路由
 * 整合空间预约、入驻申请、新闻、项目审核
 */
export default [
  {
    path: '/admin/review',
    name: 'AdminReview',
    component: () => import('@/views/admin/review.vue'),
    meta: {
      title: '审核中心',
      requiresAuth: true,
      roles: ['COLLEGE_ADMIN', 'SCHOOL_ADMIN']
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/Users.vue'),
    meta: {
      title: '用户管理',
      requiresAuth: true,
      roles: ['SCHOOL_ADMIN']
    }
  }
]
