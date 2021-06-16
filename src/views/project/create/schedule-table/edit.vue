<template>
  <hy-dialog :visible="true"
    custom-class='schedule-edit'
    v-loading='isLoading'
    title="排期设置"
    width="470px"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="box">

      <el-form size="mini"
        ref="form"
        :model="form"
        style="color:#979797"
        label-width="82px">

        <el-form-item label="广告名称："
          :rules="{
                      required: true, validator: validateName, trigger: 'blur'
                    }"
          prop="name">
          <el-input size="mini"
            placeholder="广告名称"
            v-model.trim="form.name">
          </el-input>
        </el-form-item>

        <div style="max-height: 65vh;overflow: auto;">
          <el-form-item :label="index==0?'排期周期：':''"
            v-for="(i,index) in form.times"
            class="time-form-item"
            :key='i.key'
            :rules="{
                          required: true, validator: validateTime, trigger: 'change'
                        }"
            :prop="'times.' + index + '.time'">
            <!-- <div class="time"> -->
            <el-date-picker v-model="i.time"
              type="daterange"
              size="mini"
              prefix-icon='el-icon-time'
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <i v-if="index!=0"
              style="cursor: pointer;font-size:16px"
              @click="onRemove(index)"
              class="el-icon-remove-outline"></i>
            <!-- </div> -->
          </el-form-item>
        </div>

        <div class="add"
          style="margin-top:6px;display: inline-block;margin-left: 10px;">
          <i class="el-icon-plus"
            @click="onAdd">继续添加</i>
        </div>

      </el-form>
    </div>
    <div slot="footer">
      <el-button plain
        @click="onClose">取消</el-button>
      <el-button @click="onSubmit">提交</el-button>
    </div>
  </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "schedule-edit",
  components: {},
  props: {
    isShow: {
      type: [Boolean],
      required: true
    }
  },
  data() {
    /* let validateName = (rule, val, callback) => {
      console.log(val);
      if (val.length == 0) {
        callback(new Error("请选择投放时间"));
      } else {
        callback();
      }
    };
    let validateTime = (rule, arr, callback) => {
      debugger;
      if (arr.length == 0) {
        callback(new Error("请选择投放时间"));
      } else {
        callback();
      }
      return;
      if (arr.length == 0) {
        callback(new Error("请选择投放时间"));
        return;
      } else {
        let stime = arr[0];
        let etime = arr[1];
        let diff = moment(etime).diff(moment(stime), "days");
        callback();
      }
    }; */
    return {
      value6: "",
      form: {
        name: "",
        times: [{ time: [] }]
      },

      isLoading: false
    };
  },

  computed: {
    ...mapState("project", ["projectID", "schedule_table_status"])
  },
  watch: {},

  created() {
    // this.update_project_id('2')
    // this.fetchGetData();
    if (this.schedule_table_status == "active") {
      this.fetchGetData();
    }
  },
  mounted() {
    //初始化，可以操作dom
    //this.refs
  },
  methods: {
    ...mapActions("project", [
      "updata_preview_log_step_status",
      "fetch_preview_data",
      "fetch_log_info",
      "update_schedule_table_status",
      "update_project_id"
    ]),
    validateName(rule, val, callback) {
      // console.log('val',val);
      if (val == "") {
        callback(new Error("请输入广告名称"));
      } else {
        if (this.$constReg.cnenName1.test(val)) {
          callback();
        } else {
          callback(new Error("广告名称只允许中文、英文、数字、下划线、中划线"));
        }
      }
    },
    validateTime(rule, arr, callback) {
      // debugger;
      if (arr.length == 0) {
        callback(new Error(" "));
      } else {
        callback();
      }
    },
    onRemove(index) {
      this.form.times.splice(index, 1);
    },
    onAdd() {
      this.addCore([]);
      // this.form.times.push({ time: [], key: Date.now() });
    },
    onClose() {
      // this.fetch_preview_data();
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
    },

    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.fetchSave();
        } else {
          return false;
        }
      });
    },
    // arr实例 ['2018-05-05','2018-05-25']
    addCore(arr) {
      this.form.times.push({ time: arr, key: Date.now() });
    },
    getTimeData() {
      return this.form.times.map(i => i.time);
    },
    setForm(data) {
      if (_.isPlainObject(data)) {
        this.form.name = data.ad_name;
        this.form.times = [];
        let arr = JSON.parse(data.datestr);
        for (const i of arr) {
          this.addCore(i);
        }
      }
    },
    async fetchGetData() {
      let project_id = this.projectID;
      let data = await this.fetchCore("/scheduling/scheduledetail", {
        project_id
      });
      this.setForm(data);
    },
    async fetchSave() {
      let param = {
        project_id: this.projectID,
        ad_name: this.form.name,
        date: this.getTimeData()
      };
      await this.fetchCore("/scheduling/modifyschedule", param);
      this.update_schedule_table_status("active");
      this.fetch_log_info();
      this.onClose();
    },
    async fetchCore(url, data, hasLoading = true) {
      hasLoading && (this.isLoading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        hasLoading && (this.isLoading = false);
      }
    }
  }
};
</script>
<style>
</style>

<style scoped>
/*本地部分*/
.box {
  padding-left: 28px;
  padding-top: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}
.add {
  color: #398d80;
  cursor: pointer;
  padding-left: 72px;
}
.time {
  margin-bottom: 6px;
}
</style>
<style>
.schedule-edit .el-form-item--mini.el-form-item.time-form-item {
  margin-bottom: 8px;
}
/*全局部分*/
</style>