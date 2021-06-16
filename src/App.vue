<template>
    <div id="app"
        :data-theme="nowThemeInfo">
        <router-view />
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import fetch from "@/services/fetch";
import $ from "jquery";
import theme from "./mixin/theme";

export default {
  name: "app",
  data() {
    return {
      cb_timer: null, //关闭浏览器的心跳时间句柄
      cb_heartBeatTime: 1000 * 3, //3秒发一次关闭浏览器的心跳
      heartBeatTime: 1000 * 60 * 10, //多长时间监测一次用户鼠标行为
      timer: null, //计时器的timer
      operateTime: new Date() - 0, //用户鼠标操作的时间ms
    };
  },
  mixins: [theme],
  computed: {
    ...mapState("user", ["token", "languageInfo"]),
  },
  watch: {
    token(n, o) {
      if (n) {
        this.init();
      } else {
        //如果退出登陆，则停止定时器
        clearInterval(this.timer);
        clearInterval(this.cb_timer);
      }
    },
  },
  mounted() {
    this.init();
    this.get_language_cookie();
  },
  methods: {
    ...mapActions("user", ["login", "update_system_language_info"]),

    init() {
      // this.cb_timer = null;
      // this.timer = null;
      if (this.token) {
        this.fetch_heartBeat();
        this.heartBeat();
        this.heartBeat_closeBrowser();
        $("*").off("mousemove");
        $("*").on("mousemove", () => {
          this.operateTime = +new Date();
        });
      }
    },
    heartBeat() {
      this.timer = window.setInterval(() => {
        if (new Date() - this.operateTime < this.heartBeatTime) {
          this.fetch_heartBeat();
        }
      }, this.heartBeatTime);
    },
    async fetch_heartBeat() {
      try {
        await fetch.post("/user/loginstatus");
      } catch (err) {
        console.error(err);
      }
    },
    heartBeat_closeBrowser() {
      this.cb_timer = window.setInterval(() => {
        this.fetch_heartBeat_closeBrowser();
      }, this.cb_heartBeatTime);
    },
    async fetch_heartBeat_closeBrowser() {
      try {
        await fetch.post("/user/screenstatus");
      } catch (err) {
        console.error(err);
      }
    },
    mousemove() {
      this.operateTime = +new Date();
    },
    // 切换语言
    get_language_cookie() {
      let param = "zh";
      var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
      if (document.cookie.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          if (arr2[0] === "language") {
            //判断查找相对应的值
            param = arr2[1];
            this.update_system_language_info(param);
            this.$i18n.locale = param;
          }
        }
      }
    },
  },
  beforeUpdate() {
    this.$i18n.locale = this.languageInfo;
  },
};
</script>

<style>
</style>
