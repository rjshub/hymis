/*
 * 用户管理
 */
import layout from "@/views/layout/Layout";

// import SystemUserManage from "@/views/system/user";
const SystemUserManage = () => import(/* webpackChunkName: "system" */ '@/views/system/user')
// import SystemCustomerManage from "@/views/system/customer";
const SystemCustomerManage = () => import(/* webpackChunkName: "system" */ '@/views/system/customer')
// import SystemRuleManage from "@/views/system/rule";
const SystemRuleManage = () => import(/* webpackChunkName: "system" */ '@/views/system/rule')
// import SystemRoleManage from "@/views/system/role";
const SystemRoleManage = () => import(/* webpackChunkName: "system" */ '@/views/system/role')
// import SystemRuleCityManage from "@/views/system/rule/city";
const SystemRuleCityManage = () => import(/* webpackChunkName: "system" */ '@/views/system/rule/city')
// import SystemRuleMediaManage from "@/views/system/rule/media";
const SystemRuleMediaManage = () => import(/* webpackChunkName: "system" */ '@/views/system/rule/media')
// import SystemRuleBaseNumManage from "@/views/system/rule/base-num";
const SystemRuleBaseNumManage = () => import(/* webpackChunkName: "system" */ '@/views/system/rule/base-num')
// import SystemOperatelogManage from "@/views/system/operatelog";
const SystemOperatelogManage = () => import(/* webpackChunkName: "system" */ '@/views/system/operatelog')

// import SystemMediaManage from "@/views/system/media";
const SystemMediaManage = () => import(/* webpackChunkName: "system" */ '@/views/system/media')
// import SystemMediaList from "@/views/system/media/media";
const SystemMediaList = () => import(/* webpackChunkName: "system" */ '@/views/system/media/media')
// import SystemPointList from "@/views/system/media/point";
const SystemPointList = () => import(/* webpackChunkName: "system" */ '@/views/system/media/point')




const routes = [
  {
    path: "/system",
    component: layout,
    children: [
      {
        path: "",
        redirect: "role"
      },
      {
        path: "operatelog",
        meta: {
          title: "操作日志",
          nav: "/system",
          subNav: "/system/operatelog"
        },
        name: "SystemOperatelogManage",
        component: SystemOperatelogManage
      },
      {
        path: "user",
        meta: {
          title: "用户管理",
          nav: "/system",
          subNav: "/system/user"
        },
        name: "SystemUserManage",
        component: SystemUserManage
      },
      {
        path: "role",
        meta: {
          title: "角色管理",
          nav: "/system",
          subNav: "/system/role"
        },
        name: "SystemRoleManage",
        component: SystemRoleManage
      },
      {
        path: "customer",
        meta: {
          title: "客户管理",
          nav: "/system",
          subNav: "/system/customer"
        },
        name: "SystemCustomerManage",
        component: SystemCustomerManage
      },
      {
        path: "rule",
        // name: "SystemRuleManage",
        component: SystemRuleManage,
        children: [
          {
            path: "",
            redirect: "city"
          },
          {
            path: "city",
            meta: {
              title: "规则管理-城市列表",
              nav: "/system",
              subNav: "/system/rule/city"
            },
            name: "SystemRuleCityManage",
            component: SystemRuleCityManage
          },
          {
            path: "media",
            meta: {
              title: "规则管理-媒体列表",
              nav: "/system",
              subNav: "/system/rule/media"
            },
            name: "SystemRuleMediaManage",
            component: SystemRuleMediaManage
          },
          {
            path: "basenum",
            meta: {
              title: "规则管理-保底基数管理",
              nav: "/system",
              subNav: "/system/rule/basenum"
            },
            name: "SystemRuleBaseNumManage",
            component: SystemRuleBaseNumManage
          }
        ]
      },
      {
        path: "media-manage",
        // name: "SystemMediaManage",
        component: SystemMediaManage,
        children: [
          {
            path: "",
            redirect: "media-list"
          },
          {
            path: "media-list",
            meta: {
              title: "媒体管理-媒体列表",
              nav: "/system",
              subNav: "/system/media-manage/media-list"
            },
            name: "SystemMediaList",
            component: SystemMediaList
          },
          {
            path: "point-list",
            meta: {
              title: "媒体管理-点位列表",
              nav: "/system",
              subNav: "/system/media-manage/point-list"
            },
            name: "SystemPointList",
            component: SystemPointList
          }
        ]
      }
    ]
  }
];

export default routes;
