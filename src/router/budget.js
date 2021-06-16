/*
 * 预算分配
 */
import _ from "lodash";
import Layout from "@/views/layout/Layout";

import BudgetManage from "@/views/budget/manage/index";
const BudgetInput = () => import(/* webpackChunkName: "budget" */ '@/views/budget/create/index')
// import ProjectCreate from "@/views/project/create";

const routes = [
  {
    path: "/budget",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "manage",
      },
      {
        path: "manage",
        meta: {
          title: "预算分配",
          nav: "/project"
        },
        name: "BudgetManage",
        component: BudgetManage
      },
      {
        path: "create",
        meta: {
          title: "预算分配",
          nav: "/project"
        },
        name: "BudgetCreate",
        component: BudgetInput
      },
    ]
  }
];

export default routes
