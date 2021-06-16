<template>
    <hy-dialog :visible="true"
        custom-class='schedule-edit'
        v-loading='isLoading'
        :title="$t('lang.AS_detail_Spotplan_setting')"
        @close="onClose"
        :close-on-click-modal="false">
        <div class="box">

            <div class="left">
                <div class="title-wrap">
                    <div class="title">{{$t('lang.AS_detail_common_setting')}}</div>
                </div>
                <el-form size="mini"
                    ref="generalSetRef"
                    :model="generalSet"
                    class="left-form"
                    label-width="96px">

                    <el-form-item :label="`${$t('lang.AS_detail_schedule_table_edit_form.ad_name')}：`"
                        :rules="{
                      required: true, validator: validateName, trigger: 'blur'
                    }"
                        prop="name">
                        <el-input size="mini"
                            style="width:333px"
                            :placeholder="$t('lang.AS_detail_schedule_table_edit_form.ad_name')"
                            v-model.trim="generalSet.name">
                        </el-input>
                    </el-form-item>

                    <div class="left-time-form">
                        <el-form-item :label="index==0? `${$t('lang.AS_detail_schedule_table_edit_form.period_Proportion')}：`:''"
                            v-for="(i,index) in generalSet.times"
                            class="time-form-item"
                            :key='i.key'
                            :rules="{
                          required: true, validator: validateGeneralTime, trigger: 'blur'
                        }"
                            :prop="'times[' + index + ']'">
                            <el-date-picker v-model="i.time"
                                type="daterange"
                                class="date-input"
                                size="mini"
                                prefix-icon='el-icon-time'
                                :range-separator="$t('lang.public_DatePicker_between')"
                                value-format="yyyy-MM-dd"
                                :start-placeholder="$t('lang.public_DatePicker_start')"
                                :end-placeholder="$t('lang.public_DatePicker_end')">
                            </el-date-picker>
                            <el-input :placeholder="$t('lang.AS_detail_schedule_table_edit_form.percent')"
                                v-model="i.percent"
                                class="percent-input">
                                <template slot="append">%</template>
                            </el-input>
                            <!-- <i v-if="index!=0"
                style="cursor: pointer;font-size:16px"
                @click="onRemove(index)"
                class="el-icon-remove-outline"></i> -->
                            <i v-if="generalSet.times.length>1"
                                :title="$t('lang.public_tooltip_delete')"
                                class="el-icon-delete"
                                @click="onRemoveLeftTime(index)"></i>
                        </el-form-item>
                    </div>

                    <div class="add">
                        <i class="el-icon-plus"
                            @click="onAddLeftTime">{{$t('lang.public_add_one_more')}}</i>
                    </div>

                </el-form>
            </div>
            <div class="right">
                <div class="title-wrap">
                    <div class="title">{{$t('lang.AS_detail_advanced_setting')}}</div>
                    <span class="remark">{{$t('lang.AS_detail_schedule_table_Advanced_settings_error')}}</span>
                </div>
                <div class="form-box">

                    <el-form v-for="(setItem,index) in advancedSet"
                        :key='index'
                        size="mini"
                        :ref="'advancedSetRef'+index"
                        :model="setItem"
                        class="right-form"
                        style=""
                        label-width="96px">
                        <!-- 右上角删除按钮 -->
                        <div class="form-delete-btn"
                            v-if="advancedSet.length!=1">
                            <i :title="$t('lang.public_tooltip_delete')"
                                class="el-icon-delete"
                                @click="onRemoveCitySet(index)"></i>
                        </div>

                        <el-form-item :label="`${$t('lang.system_rule_city_label')}：`"
                            :rules="{
                      required: false, validator: validateCity(setItem), trigger: 'change'
                    }"
                            prop="city">
                            <el-select v-model="setItem.city"
                                style="width: 333px;"
                                :placeholder="$t('lang.public_city_placeholder')"
                                multiple
                                @change='onChange'
                                size="mini"
                                filterable>
                                <el-option v-for="item in setItem.cityList "
                                    :key="item"
                                    :title="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <div style="overflow: auto;max-height: calc(100% - 47px);">
                            <el-form-item :label="timeIndex==0? `${$t('lang.AS_detail_schedule_table_edit_form.period_Proportion')}：`:''"
                                v-for="(timeItem,timeIndex) in setItem.times"
                                class="time-form-item"
                                :key='timeIndex'
                                :rules="{
                          required: false, validator: validateAdvancedTime(setItem), trigger: 'blur'
                        }"
                                :prop="'times['+timeIndex+']'">
                                <el-date-picker v-model="timeItem.time"
                                    type="daterange"
                                    class="date-input"
                                    size="mini"
                                    prefix-icon='el-icon-time'
                                    :range-separator="$t('lang.public_DatePicker_between')"
                                    value-format="yyyy-MM-dd"
                                    :start-placeholder="$t('lang.public_DatePicker_start')"
                                    :end-placeholder="$t('lang.public_DatePicker_end')">
                                </el-date-picker>
                                <el-input :placeholder="$t('lang.AS_detail_schedule_table_edit_form.percent')"
                                    v-model.trim="timeItem.percent"
                                    class="percent-input">
                                    <template slot="append">%</template>
                                </el-input>
                                <i v-if="setItem.times.length>1"
                                    :title="$t('lang.public_tooltip_delete')"
                                    class="el-icon-delete"
                                    @click="onRemoveRightTime(index,timeIndex)"></i>
                            </el-form-item>
                        </div>

                        <div class="add">
                            <i class="el-icon-plus"
                                @click="onAddRightTime(index)">{{$t('lang.public_add_one_more')}}</i>
                        </div>

                    </el-form>
                </div>

                <!-- 右侧的添加按钮 -->
                <div class="add-wrap"
                    @click="onAddAdvancedSet"><i class="el-icon-plus"></i></div>
            </div>
        </div>
        <div slot="footer">
            <el-button plain
                @click="onClose('cancel')">{{$t('lang.public_button_cancel')}}</el-button>
            <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
        </div>
    </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import math from "mathjs";
import fetch from "@/services/fetch";

export default {
  name: "schedule-edit",
  components: {},
  props: {
    isShow: {
      type: [Boolean],
      required: true,
    },
  },
  data() {
    return {
      cityList: [
        { id: 1, name: "西安" },
        { id: 2, name: "上海" },
        { id: 3, name: "北京" },
      ],
      value6: "",
      generalSet: {
        name: "",
        times: [{ time: [], percent: "" }],
      },
      advancedSet: [
        // { city: [], times: [{ time: [], percent: "" }], cityList: [] }
      ],
      isLoading: false,
    };
  },

  computed: {
    ...mapState("project", ["projectID", "schedule_table_status"]),
  },
  watch: {},

  async created() {
    // this.update_project_id('2')
    // this.fetchGetData();
    if (this.schedule_table_status == "active") {
      this.fetchGetData();
    }
    await this.fetchGetCityList();
    this.onAddAdvancedSet();
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
      "update_project_id",
    ]),
    onChange(val) {
      this.setCityList();
    },
    setCityList() {
      let selected = _.flattenDeep(this.advancedSet.map((i) => i.city));
      for (let i = 0; i < this.advancedSet.length; i++) {
        let item = this.advancedSet[i];
        let removed = _.difference(selected, item.city);
        let list = item.cityList;
        item.cityList = _.difference(this.cityList, removed);
        this.$set(this.advancedSet, i, item);
      }
    },
    // 添加一条高级设置
    onAddAdvancedSet() {
      this.advancedSet.push({
        city: [],
        cityList: _.cloneDeep(this.cityList),
        times: [{ time: [], percent: "", key: _.uniqueId("advanced_") }],
      });
      this.setCityList();
    },
    // 删除一条高级设置
    onRemoveCitySet(index) {
      this.$confirm(this.$t("lang.AS_detail_schedule_table_delete_setting_confirm"), this.$t("lang.public_dialog_point"), {
        confirmButtonText: this.$t("lang.public_button_confirm"),
        cancelButtonText: this.$t("lang.public_button_cancel"),
        type: "warning",
      })
        .then(async () => {
          this.advancedSet.splice(index, 1);
          this.setCityList();
        })
        .catch(() => {});
    },
    advancedSetIsEmpty({ city, times }) {
      let cityEmpty = city.length == 0;
      let percentEmpty = true;
      let timeEmpty = true;
      for (let i of times) {
        percentEmpty = percentEmpty && i.percent == "";
        timeEmpty = timeEmpty && i.time.length == 0;
      }
      return cityEmpty && percentEmpty && timeEmpty;
    },
    //城市校验
    _validateCity(rule, val, callback) {
      if (val.length == 0) {
        callback(new Error(this.$t("lang.public_city_placeholder")));
      } else {
        callback();
      }
    },
    validateCity(obj) {
      return (rule, val, callback) => {
        if (this.advancedSetIsEmpty(obj)) {
          callback();
        } else {
          if (val.length == 0) {
            callback(new Error(this.$t("lang.public_city_placeholder")));
          } else {
            callback();
          }
        }
      };
    },
    // 广告名称校验
    validateName(rule, val, callback) {
      if (val == "") {
        callback(new Error(this.$t("lang.public_enter_adName_placeholder")));
      } else {
        if (this.$constReg.cnenName1.test(val)) {
          callback();
        } else {
          callback(new Error(this.$t("lang.reg_Ad_name_error")));
        }
      }
    },
    _validateTime(time) {
      let rs = { validate: true, msg: "" };
      if (!Array.isArray(time) || time.length == 0) {
        rs.validate = false;
        rs.msg = this.$t("lang.public_period_placeholder");
      }
      return rs;
    },
    _validatePercent(percent) {
      let rs = { validate: true, msg: "" };
      if (this.$constReg.positiveInt.test(percent)) {
        if (percent - 0 > 100) {
          rs.validate = false;
          rs.msg = this.$t("lang.reg_percents_min_max");
        }
      } else {
        rs.validate = false;
        rs.msg = this.$t("lang.reg_percents_error_msg");
      }
      return rs;
    },
    _validateTimeCore(time, percent, callback) {
      let timeValidate = this._validateTime(time);
      let percentValidate = this._validatePercent(percent);
      if (timeValidate.validate && percentValidate.validate) {
        callback();
      } else {
        callback(new Error(timeValidate.msg || percentValidate.msg));
      }
    },
    // 通过设置周期校验  时间和占比
    validateGeneralTime(rule, val, callback) {
      this._validateTimeCore(val.time, val.percent, callback);
    },
    // 高级设置周期校验  时间和占比
    validateAdvancedTime(obj) {
      return (rule, val, callback) => {
        let a = this.advancedSetIsEmpty(obj);
        if (this.advancedSetIsEmpty(obj)) {
          callback();
        } else {
          this._validateTimeCore(val.time, val.percent, callback);
        }
      };
    },
    // 删除右侧一条周期
    onRemoveRightTime(index, timeIndex) {
      this.advancedSet[index]["times"].splice(timeIndex, 1);
    },
    // 右侧添加一条周期
    onAddRightTime(index) {
      this.addRightTimeCore(index, [], "");
    },
    // 右侧添加一条周期核心
    addRightTimeCore(index, time, percent) {
      this.advancedSet[index]["times"].push({
        time,
        percent,
        key: _.uniqueId("advanced_"),
      });
    },
    // 删除左侧一条周期
    onRemoveLeftTime(index) {
      this.generalSet.times.splice(index, 1);
    },
    // 左侧添加一条周期
    onAddLeftTime() {
      this.addLeftTimeCore([], "");
      // this.form.times.push({ time: [], key: Date.now() });
    },
    // 左侧添加一条周期核心
    addLeftTimeCore(time, percent = "") {
      this.generalSet.times.push({
        time,
        percent,
        key: _.uniqueId("general_"),
      });
    },
    onClose(type = "close") {
      // this.fetch_preview_data();
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
      this.$dispatch("scheduleTableChart", "schedule-set-dialog", type);
    },
    generalSetValidate() {
      return new Promise((resolve, reject) => {
        this.$refs["generalSetRef"].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject("generalSetValidate reject");
            // return false;
          }
        });
      });
    },
    advancedSetValidate() {
      let len = this.advancedSet.length;
      let rs = [];
      for (let i = 0; i < len; i++) {
        let _promise = new Promise((resolve, reject) => {
          this.$refs["advancedSetRef" + i][0].validate((valid) => {
            if (valid) {
              resolve();
            } else {
              reject("advancedSetRef" + i + " reject");
            }
          });
        });
        rs.push(_promise);
      }
      return rs;
    },
    onSubmit() {
      let advancedValidate = this.advancedSetValidate();
      let generalValidate = this.generalSetValidate();
      Promise.all([...advancedValidate, generalValidate])
        .then((arr) => {
          if (this.percentIs100()) {
            this.fetchSave();
          }
        })
        .catch((e) => {});
    },
    percentIs100() {
      let msg = [];
      let gPercent = this.getGeneralPercentData();
      let gValidate = this._validatePercent100(gPercent);
      if (!gValidate) {
        msg.push(this.$t("lang.AS_detail_common_setting"));
      }
      let aPercents = this.getAdvancedPercentData();
      let aValidate = true;
      let invalidateIndex = [];
      for (let index = 0; index < aPercents.length; index++) {
        let isEmpty = this.advancedSetIsEmpty(this.advancedSet[index]);
        if (!isEmpty) {
          let TemValidate = this._validatePercent100(aPercents[index]);
          if (!TemValidate) {
            aValidate = aValidate && false;
            invalidateIndex.push(index + 1);
          }
        }
      }
      if (!aValidate) {
        let num = invalidateIndex.join();
        msg.push(this.$t("lang.AS_detail_schedule_table_Advanced_settings_ranking_number") + num + this.$t("lang.public_number_unit"));
      }
      if (msg.length) {
        /* this.$alert(msg.join()+':占比之和不等于100，请重新修改', '错误', {
          confirmButtonText: '确定',
          callback: action => {
          }
        }); */
        const h = this.$createElement;
        this.$msgbox({
          title: this.$t("lang.public_tooltip_error"),
          type: "error",
          message: h("p", null, [h("p", null, msg.join() + ":"), h("p", { style: "text-indent: 28px;" }, this.$t("lang.reg_percent_sum_not_100"))]),
          showCancelButton: false,
          confirmButtonText: this.$t("lang.public_button_confirm"),
        }).then((action) => {});
      }
      return gValidate && aValidate;
    },
    // 获取高级设置所有的周期
    getAdvancedTimeData() {
      return this._getAdvancedData("time");
    },
    // 获取高级设置所有的占比
    getAdvancedPercentData() {
      return this._getAdvancedData("percent");
    },
    _getAdvancedData(type) {
      let rs = [];
      for (let index = 0; index < this.advancedSet.length; index++) {
        let item = this.advancedSet[index];
        let tem = item.times.map((i) => i[type]);
        rs.push(tem);
      }
      return rs;
    },
    // 获取通用设置所有的周期
    // return  [["2019-03-13","2019-03-15"],["2019-04-13","2019-04-16"]]
    getGeneralTimeData() {
      return this._getGeneralData("time");
    },
    // 获取通用设置所有的占比 return  ['34','52','12']
    getGeneralPercentData() {
      return this._getGeneralData("percent");
    },
    _getGeneralData(type) {
      return this.generalSet.times.map((i) => i[type]);
    },

    //校验占比值是否等于100  arr ['34','52','12']
    _validatePercent100(arr) {
      let rs = "0";
      for (let i of arr) {
        rs = math.eval(rs + "+" + i) - 0;
      }
      return rs === 100;
    },
    //校验周期是否重叠 arr [["2019-03-13","2019-03-15"],["2019-04-13","2019-04-16"]]
    _validateTimeOverlap(arr) {
      let rs = 0;
      /* for (let i of arr) {
        rs = math.eval(rs + i) - 0;
      } */
      return rs === 100;
    },
    initGeneralSet(obj) {
      this.generalSet.name = obj.ad_name;
      this.generalSet.times = [];
      let temObj = JSON.parse(obj.datestr);

      // 通用设置
      let keys = Object.keys(temObj.default);
      for (let i of keys) {
        this.addLeftTimeCore(i.split(","), temObj.default[i]);
      }
    },
    initAdvancedSet(obj) {
      let rs = [];
      let area = JSON.parse(obj.datestr)["area"];
      for (let i of area) {
        let tem = {};
        tem.city = i.citys;
        tem.cityList = _.cloneDeep(this.cityList);
        tem.times = [];
        let keys = Object.keys(i.datelist);
        for (let j of keys) {
          let _obj = {};
          _obj.time = j.split(",");
          _obj.percent = i.datelist[j];
          _obj.key = _.uniqueId("advanced_");
          tem.times.push(_obj);
        }
        rs.push(tem);
      }
      this.advancedSet = rs;
    },
    setSetData(data) {
      if (_.isPlainObject(data)) {
        this.initGeneralSet(data);
        this.initAdvancedSet(data);
      } else {
        console.error("data should be a object");
      }
    },
    async fetchGetData() {
      let project_id = this.projectID;
      let data = await this.fetchCore("/scheduling/scheduledetail", {
        project_id,
      });
      this.setSetData(data);
    },
    async fetchGetCityList() {
      let project_id = this.projectID;
      let data = await this.fetchCore("/scheduling/arealist", {
        project_id,
      });
      this.cityList = data;
    },
    getGeneralTimeParam() {
      return this._getTimeParam(this.generalSet.times);
    },
    _getTimeParam(timeArr) {
      let obj = {};
      for (let time of timeArr) {
        let val = time.percent;
        let key = time.time.join();
        obj[key] = val - 0;
      }
      return obj;
    },
    getAdvancedParam() {
      let rs = [];
      for (let item of this.advancedSet) {
        if (!this.advancedSetIsEmpty(item)) {
          let obj = {};
          obj.citys = item.city;
          obj.datelist = this._getTimeParam(item.times);
          rs.push(obj);
        }
      }
      return rs;
    },
    async fetchSave() {
      let general = this.getGeneralTimeParam();
      let advanced = this.getAdvancedParam();
      let param = {
        default: general,
        area: advanced,
      };
      let params = {
        project_id: this.projectID,
        ad_name: this.generalSet.name,
        param,
      };
      // console.log('TCL: fetchSave -> params', params)
      await this.fetchCore("/scheduling/modifyschedule", params);
      this.update_schedule_table_status("active");
      await this.fetch_log_info();
      this.onClose("confirm");
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
    },
  },
};
</script>
<style>
</style>

<style scoped lang="scss">
/*本地部分*/
::-webkit-scrollbar {
  width: 4px;
}
.box {
  padding-left: 28px;
  padding-top: 24px;
  padding-right: 24px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
}
.add {
  color: #398d80;
  cursor: pointer;
  padding-left: 85px;
  margin-top: 6px;
  display: inline-block;
  margin-left: 10px;
  i {
    font-weight: bold;
  }
}
.time {
  margin-bottom: 6px;
}
.left {
  width: 470px;
  margin-right: 80px;
  .left-form {
    color: #979797;
    margin-top: 20px;
    height: calc(100% - 49px);
    .left-time-form {
      overflow: auto;
      max-height: calc(100% - 47px);
    }
  }
}
.right {
  width: 590px;
  .form-box {
    margin-top: 20px;
    max-height: calc(100% - 100px);
    overflow: auto;
    .right-form {
      color: #979797;
      background-color: #212936; /*(背景调换)新建项目排期表排期设置右侧高级设置背景*/
      border: 1px dashed #5a626d;
      padding: 20px;
      padding-right: 3px;
      position: relative;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
.form-delete-btn {
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
  background-color: #383e4a; /*(背景调换)新建项目排期表排期设置右侧高级设置右上角删除背景*/
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  i {
    font-size: 18px;
    color: #fff;
    opacity: 0.4;
  }
  &:hover {
    i {
      opacity: 0.6;
    }
  }
}
.add-wrap {
  text-align: center;
  background-color: #212936; 
  border: 1px dashed #5a626d;
  cursor: pointer;
  padding: 5px;
  margin-top: 15px;
  .el-icon-plus {
    font-size: 24px;
    color: #798088;
    font-weight: bold;
  }
}
.title-wrap {
  border-bottom: 1px solid #5a616b;
  display: flex;
  .remark {
    flex: 1;
    color: #8c939d;
    font-size: 12px;
    margin-left: 5px;
  }
  .title {
    // width: 80px;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    background: #424852; 
    text-align: center;
    color: #a6a9ae;
    cursor: pointer;
    font-size: 12px;
    display: inline-block;
  }
}
</style>
<style lang="scss">
.schedule-edit .el-form-item--mini.el-form-item {
  &.time-form-item {
    margin-bottom: 14px;
    .date-input {
      vertical-align: middle;
    }
    .percent-input {
      width: 100px;
      .el-input-group__append {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
  .el-form-item__label {
    word-break: keep-all;
  }
  .el-icon-delete {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
    margin-left: 5px;
    opacity: 0.4;
    color: #fff;
    &:hover {
      opacity: 0.6;
    }
  }
}

/*全局部分*/
</style>