/*
 * 用户管理
 */
import layout from "@/views/layout/Layout";

import StrategyManage from "@/views/strategy/index";

// import MediumManage from "@/views/strategy/medium";
const MediumManage = () => import(/* webpackChunkName: "strategy" */ '@/views/strategy/medium')
// import MediaCoincide from "@/views/strategy/medium/media-coincide";
const MediaCoincide = () => import(/* webpackChunkName: "strategy" */ '@/views/strategy/medium/media-coincide')
// import MediaDetail from "@/views/strategy/medium/media-cover-rank/detail";
const MediaDetail = () => import(/* webpackChunkName: "strategy" */ '@/views/strategy/medium/media-cover-rank/detail')
// import MediaCoverRank from "@/views/strategy/medium/media-cover-rank";
const MediaCoverRank = () => import(/* webpackChunkName: "strategy" */ '@/views/strategy/medium/media-cover-rank')
// import MediaCphRank from "@/views/strategy/medium/media-cph-rank";
const MediaCphRank = () => import(/* webpackChunkName: "strategy" */ '@/views/strategy/medium/media-cph-rank')
// import PointCphRank from "@/views/strategy/medium/point-cph-rank";
const PointCphRank = () => import(/* webpackChunkName: "strategy" */ '@/views/strategy/medium/point-cph-rank')
// MediaCphRank
// PointCphRank
// MediaCoverRank
// MediaCoincide
// MediumManage
const routes = [
  {
    path: "/strategy",
    component: layout,
    children: [
      {
        path: "",
        redirect: "medium"
      },
      {
        path: "manage",
        meta: {
          title: "智能策略",
          nav: "/strategy",
          subNav: "/strategy/manage"
        },
        name: "StrategyManage",
        component: StrategyManage
      },
      {
        path: "medium",
        meta: {
          title: "媒介推介",
          nav: "/strategy",
          subNav: "/strategy/manage"
        },
        // name: "MediumManage", //不然会告警，所以要注释掉
        component: MediumManage,
        children: [
          {
            path: "",
            redirect: "media-cph-rank"
          },
          {
            path: "detail",
            meta: {
              title: "智能策略-媒介推介-媒体详情",
              nav: "/strategy",
              noSubNav:true,
            },
            name: "MediaDetail",
            component: MediaDetail
          },
          {
            path: "media-cph-rank",
            meta: {
              title: "智能策略-媒介推荐-媒体综合排名",
              nav: "/strategy",
              subNav: "/strategy/medium/media-cph-rank"
            },
            name: "MediaCphRank",
            component: MediaCphRank
          },
          {
            path: "point-cph-rank",
            meta: {
              title: "智能策略-媒介推荐-点位综合排名",
              nav: "/strategy",
              subNav: "/strategy/medium/point-cph-rank"
            },
            name: "PointCphRank",
            component: PointCphRank
          },
          {
            path: "media-cover-rank",
            meta: {
              keepAliveThree:true,
              title: "智能策略-媒介推介-媒体覆盖排名",
              nav: "/strategy",
              subNav: "/strategy/medium/media-cover-rank"
            },
            name: "MediaCoverRank",
            component: MediaCoverRank
          },

          {
            path: "media-coincide",
            meta: {
              title: "智能策略-媒介推荐-媒体重合度",
              nav: "/strategy",
              subNav: "/strategy/medium/media-coincide"
            },
            name: "MediaCoincide",
            component: MediaCoincide
          }
        ]
      }
    ]
  }
];

export default routes;
