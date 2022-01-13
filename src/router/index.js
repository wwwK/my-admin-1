import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/home/index'),
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/status',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Status',
    meta: {
      title: '设备状态',
      icon: 'el-icon-s-help'
    },
    children: [{
        path: 'device',
        name: 'Device',
        component: () => import('@/views/status/device'),
        meta: {
          title: '设备端',
          hidden: false,
          icon: 'el-icon-postcard'
        },
        children: [{
          path: 'line',
          component: () => import('@/views/status/line'),
          name: 'Line',
          hidden: true,
          // component: () => import('@/views/test/index'),
          meta: {
            title: '端口',
            activeMenu: '/status/device',
          }
        }]
      },
      {
        path: 'phone',
        name: 'Tree',
        component: () => import('@/views/test/index'),
        meta: {
          title: '手机端',
          icon: 'el-icon-mobile-phone'
        },
      }
    ]
  },
  {
    path: '/call',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Call',
    meta: {
      title: '通话记录',
      icon: 'el-icon-s-order'
    },
    children: [{
        path: 'device',
        name: 'Device',
        component: () => import('@/views/call/device'),
        meta: {
          title: '设备端',
          icon: 'el-icon-postcard'
        }
      },
      {
        path: 'phone',
        name: 'Phone',
        component: () => import('@/views/call/phone'),
        meta: {
          title: '手机端',
          icon: 'el-icon-mobile-phone'
        }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Example',
    meta: {
      title: '设备管理',
      icon: 'el-icon-s-platform'
    },
    children: [{
        path: 'device',
        name: 'Device',
        component: () => import('@/views/device/device/index'),
        meta: {
          title: '设备端',
          icon: 'el-icon-postcard'
        }
      },
      {
        path: 'phone',
        name: 'Tree',
        component: () => import('@/views/test/index'),
        meta: {
          title: '手机端',
          icon: 'el-icon-mobile-phone'
        }
      }
    ]
  },
  {
    path: '/form1',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Form',
      component: () => import('@/views/test/index'),
      meta: {
        title: '通讯录',
        icon: 'tree'
      }
    }]
  },
  {
    path: '/data',
    component: Layout,
    meta: {
      title: '数据统计',
      icon: 'el-icon-s-data'
    },
    children: [{
      path: 'device',
      name: 'Device',
      component: () => import('@/views/data/index'),
      meta: {
        title: '设备端',
        icon: 'el-icon-postcard'
      }
    },{
      path: 'phone',
      name: 'Phone',
      component: () => import('@/views/data/index'),
      meta: {
        title: '手机端',
        icon: 'el-icon-mobile-phone'
      }
    }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '账户管理',
      icon: 'el-icon-s-custom'
    },
    children: [{
      path: 'list',
      name: 'list',
      component: () => import('@/views/account/account'),
      meta: {
        title: '账号列表',
        icon: 'el-icon-s-grid'
      }
    },  {
      path: 'role',
      name: 'role',
      component: () => import('@/views/account/role'),
      meta: {
        title: '角色管理',
        icon: 'el-icon-s-check'
      }
    },{
      path: 'department',
      name: 'department',
      component: () => import('@/views/account/department'),
      meta: {
        title: '部门管理',
        icon: 'el-icon-s-flag'
      }
    }]
  },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     name: 'Form',
  //     component: () => import('@/views/test/index'),
  //     meta: {
  //       title: '数据统计',
  //       icon: 'el-icon-s-data'
  //     }
  //   }]
  // },
  {
    path: '/ds',
    component: Layout,
    redirect: '/dashboard1',
    children: [{
      path: 'dashboard1',
      name: 'Dashboard1',
      component: () => import('@/views/test/index'),
      meta: {
        title: '系统设置',
        icon: 'el-icon-setting'
      }
    }]
  },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
