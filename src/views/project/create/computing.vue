<template>
  <div class="animate-area"
      v-loading.fullscreen.lock='isLoading'
      @click="clickBlock"
      :class="class_c">
    <div class="img-1"
        :class="computing_status">
      <div style="width: 75%; display: inline-block; text-align: center;">
        <img style="width: 100%;"
            v-if="0"
            src="~@/assets/image/menu/menu-bg-select.png" />
        <!-- <img style="width: 100%;"
            v-else
            src="~@/assets/image/project/step-basic-data.png" /> -->
            <i v-else class="iconfont icon-box"></i>
      </div>

      <el-button plain v-if="enableWriteCreateProject"
          size="mini"
          @click="onSubmitData">{{$t('lang.public_submit_data_label')}}</el-button>

      <el-button plain v-else style="cursor: not-allowed;"
          size="mini">{{$t('lang.public_submit_data_label')}}</el-button>
    </div>
    <div class="animate"
        :class="computing_status">
      <i class="iconfont icon-processing"></i>
    </div>
    <div class="img-2"
        :class="computing_status">
      <div style="width: 75%; display: inline-block; text-align: center;">
        <img style="width: 100%;"
            v-if="0"
            src="~@/assets/image/menu/menu-bg-select.png" />
        <!-- <img style="width: 100%;"
            v-else
            src="~@/assets/image/project/cloud.png" /> -->
            <i v-else class="iconfont icon-cloud" style="font-size:40px"></i>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "computing-chart",
  components: {},
  data() {
    return {
      isLoading: false,
      show_dialog: false,
      show_example: false,
      timer: ""
    };
  },
  watch: {
    computing_status(val, old) {
      if (val == "active") {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.fetch_step_status().then(res => {
            if (res.includes("cmp_compute_status")) {
              this.update_cmp_compute_status("active");
              this.fetch_log_info();
              clearInterval(this.timer);
            }
          }); //半分钟获取一次
        }, 1000 * 30);
      }

      if (val == "complete") {
        clearInterval(this.timer);
      }
    }
  },
  computed: {
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    ...mapState("project", ["computing_status", "projectID"]),
    class_c() {
      let classStr = this.computing_status;
      if (this.computing_status != "disabled") {
        classStr = classStr + " pointer-cursor";
      }
      return classStr;
    }
  },

  mounted() {
    if (this.computing_status == "active") {
      this.timer = setInterval(() => {
        this.fetch_step_status().then(res => {
          if (res.includes("cmp_compute_status")) {
            this.update_cmp_compute_status("active");
            clearInterval(this.timer);
          }
        }); //每分钟获取一次
      }, 1000 * 60);
    }
  },
  methods: {
    ...mapActions("project", [
      "fetch_step_status",
      "update_active_step",
      "update_computing_status",
      "update_cmp_compute_status",
      "fetch_log_info"
    ]),
    clickBlock() {
      if (this.computing_status != "disabled") {
        this.update_active_step(3);
      }
    },
    onHelp() {
      this.show_example = true;
    },
    async onSubmitData() {
      if (this.computing_status != "disabled") {
        this.isLoading = true;
        let project_id = this.projectID;
        this.update_active_step(3);
        try {
          let res = await fetch.post("/projects/costorigcompute", { project_id });
          await this.update_computing_status("active");
          this.fetch_log_info();

          await this.fetch_step_status();
        } catch (err) {
          this.$message.error(err.message);
          // console.log("内层catch:", err.message);
          throw err;
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
};
</script>
<style scoped>
.pointer-cursor {
  cursor: pointer;
}
.animate-area {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 120px;
}

.animate-area .img-1,
.animate-area .animate,
.animate-area .img-2 {
  display: inline-block;
}

.animate-area .img-1 {
  width: 30%;
  position: relative;
  z-index: 5;
  margin-right: -8px;
}
.animate-area,
.animate-area.disabled {
  opacity: 0.4;
}
.animate-area.enable {
  opacity: 0.8;
}

.animate-area.disabled,
.animate-area.enable {
  background-image: url("~@/assets/image/project/lines.png");
  border: 1px solid #fbfbfb1c;
}

.animate-area.active,
.animate-area.complete {
  opacity: 1;
  background-image: url("~@/assets/image/project/lines-active.png");
  background-size: cover;
  background-repeat: no-repeat;
  border: 1px solid #fbfbfb1c;
}

.animate-area .img-1 .title {
  color: #fff;
  margin-top: 5px;
}
.animate-area .img-1.active .title,
.animate-area .img-1.complete .title {
  color: #42a996;
}

.animate-area .animate {
  width: 35%;
  overflow: hidden;
}

.animate-area .animate i {
  display: inline-block;
  font-size: 45px;
}

.animate-area .animate.disabled i {
  animation: none;
  color: #585f69;
}
.animate-area .animate.enable i {
  animation: none;
  color: #bbbbbb;
}
.animate-area .animate.active i {
  animation: processing-animation 1s ease-in infinite;
  color: #42a996;
}

.animate-area .animate.complete i {
  animation: none;
  color: #42a996;
}

.animate-area .img-2 {
  width: 30%;
  position: relative;
  z-index: 5;
  margin-left: -8px;
}

@keyframes processing-animation {
  from {
    transform: translate(-200%);
  }
  to {
    transform: translate(200%);
  }
}
.animate-area .animate img {
  width: 30%;
}
</style>
<style>
</style>
