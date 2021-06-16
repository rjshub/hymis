/*
 * 用户管理
 */
import _ from "lodash";
import Layout from "@/views/layout/Layout";

import ProjectManage from "@/views/project/manage";
// let ProjectManage = () => import(/* webpackChunkName: "project" */ '@/views/project/manage')
// import ProjectCreate from "@/views/project/create";
let ProjectCreate = () => import(/* webpackChunkName: "system" */ '@/views/project/create')

let ProjectArchive = _.cloneDeep(ProjectManage)
const routes = [
  {
    path: "/project",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "manage"
      },
      {
        path: "manage",
        meta: {
          title: "项目管理",
          nav: "/project"
        },
        name: "ProjectManage",
        component: ProjectManage
      },
      {
        path: "archive",
        meta: {
          title: "归档项目",
          nav: "/project"
        },
        name: "ProjectArchive",
        component: ProjectArchive
      },
      {
        path: "create",
        meta: {
          title: "项目创建",
          nav: "/project"
        },
        name: "ProjectCreate",
        component: ProjectCreate
      }
    ]
  }
];

export default routes
