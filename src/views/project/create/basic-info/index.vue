<template>
  <hy-dialog :visible="true"
      custom-class='operate-guide'
      :title="$t('lang.AS_detail_project_info_title')"
      width="500px"
      :show-close="true"
      @close="onClose"
      :close-on-click-modal="false">
    <el-form v-loading="isLoading"
        class="project-create-form"
        size="mini"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="auto">
      <el-form-item :label="`${$t('lang.public_project_name')}:`" style="width: 425px;margin-bottom: 30px"
          prop="name">
        <el-input v-model="form.name"
            :placeholder="$t('lang.public_project_name_placeholder')"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('lang.public_period_label')}:`"
          prop="cycle">
        <el-date-picker size="mini"
            style="width: 202px;"
            v-model="form.cycle"
            prefix-icon="el-icon-time"
            type="daterange"
            align="right"
            :clearable="false"
            unlink-panels
            :range-separator="$t('lang.public_DatePicker_between')"
            :start-placeholder="$t('lang.public_DatePicker_start')"
            :end-placeholder="$t('lang.public_DatePicker_end')"
            value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="`${$t('lang.public_client_label')}:`"
          prop="customer_id">
        <el-select v-model="form.customer_id"
            style="width: 200px;"
            :placeholder="$t('lang.public_client_placeholder')"
            size="mini"
            filterable
            @change="changeCustomer">
          <el-option v-for="item in customer_list"
              :key="item.id"
              :label="item.customer_name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="`${$t('lang.public_brand_label')}:`"
          prop="brand_id">
        <el-select v-model="form.brand_id"
            style="width: 200px;"
            :disabled='brand_list.length==0'
            :placeholder="$t('lang.public_brand_placeholder')"
            size="mini"
            @change="changeBrand">
          <el-option v-for="item in brand_list"
              :key="item.id"
              :label="item.brand_name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="`${$t('lang.public_product_label')}:`"
          prop="product_id">
        <el-select v-model="form.product_id"
            style="width: 200px;"
            :disabled='product_list.length==0'
            :placeholder="$t('lang.public_product_placeholder')"
            size="mini"
            @change="changeProduct">
          <el-option v-for="item in product_list"
              :key="item.id"
              :label="item.product_name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('lang.public_port_label')}:`"
          prop="port"
          class="port-select-form">
        <el-select v-model="form.port"
            :placeholder="$t('lang.public_port_placeholder')"
            multiple>
          <el-option-group :key='item.label'
              v-for="item in portList"
              :label='item.label'>
            <el-option :key='i.value'
                v-for="i in item.options"
                :value='i.value'
                :label='i.label'></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('lang.public_audience_label')}:`"
          class="gender-form-item"
          prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="1">{{$t('lang.public_male')}}</el-radio>
          <el-radio label="0">{{$t('lang.public_female')}}</el-radio>
          <el-radio label="2">{{$t('lang.public_all')}}</el-radio>
        </el-radio-group>

      </el-form-item>
      <el-form-item v-for="(item,index) in form.ages"
          class="age-form-item"
          :key="item.id"
          :rules="{
                  required: true, validator: validateNum, trigger: 'blur'
                }"
          :prop="'ages.' + index">
        <div style="margin: 2px 0;">
          <span class="age-start">
            <el-input v-model.trim="item.start"></el-input>
          </span>
          <span style="width:20px;text-align:center">{{$t('lang.public_DatePicker_between')}}</span>
          <span class="age-end">
            <el-input v-model.trim="item.end"></el-input>
          </span>

          <span>{{$t('lang.reg_integer_greater_than_0')}}</span>
          <!-- 删除按钮 -->
          <span>
            <i v-if="index!=0"
                class="el-icon-remove-outline"
                style="font-size: 20px;cursor:pointer"
                @click="deleteCrowdAge(item.id)"></i>
          </span>
        </div>
      </el-form-item>
      <div class="age-error-msg">{{ageErrorMsg}}</div>
      <!-- 添加按钮 -->
      <div class="add-btn"
          @click="addCrowdAge">
        <i class="iconfont mis-add"
            style="font-size:12px"></i>{{$t('lang.public_add_one_more')}}
      </div>
    </el-form>

    <div class="clearfix"
        style="margin: 20px;">
      <div class="pull-right">
        <el-button @click="onCancel"
            plain>{{$t('lang.public_button_cancel')}}</el-button>
        <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
      </div>
    </div>
  </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "basic-info",
  components: {
    //子组件
  },
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  data() {
    const THIS = this
    let validatePort = (rule, value, callback) => {
      if (!this.isInit) {
        if (value.length == 0) {
          callback(new Error(THIS.$t('lang.public_port_placeholder')));
        } else {
          callback();
        }
      }
      this.isInit = false;
    };
    let validateName = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error(THIS.$t('lang.public_project_name_placeholder')));
      } else {
        if (!this.$constReg.name2.test(value)) {
          callback(new Error(THIS.$t('lang.reg_name_error_msg')));
        } else {
          callback();
        }
      }
    };
    return {
      isLoading: false,
      portList: [
        {
          label: "OTV",
          options: [
            {
              value: "1",
              label: "Phone"
            },
            {
              value: "2",
              label: "Pad"
            },
            {
              value: "3",
              label: "Pc"
            },
            {
              value: "4",
              label: "Mobile(Phone+Pad)"
            }
          ]
        },
        {
          label: "OTT",
          options: [
            {
              value: "5",
              label: "OTT"
            }
          ]
        }
      ],
      brand_list: [],
      product_list: [],
      isInit: true, //是否刚刚初始化进入  用来屏蔽端口页面一进入就校验必输
      form: {
        name: "",
        cycle: "",
        customer_id: "",
        brand_id: "",
        product_id: "",
        port: "",
        gender: "1",
        ages: [{ id: Date.now(), start: "", end: "" }]
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: "change" }],
        cycle: [{ required: true, message: THIS.$t('lang.public_project_period_placeholder'), trigger: "change" }],
        customer_id: [{ required: true, message: THIS.$t('lang.public_client_placeholder'), trigger: "change" }],
        brand_id: [{ required: true, message: THIS.$t('lang.public_brand_placeholder'), trigger: "change" }],
        product_id: [{ required: true, message: THIS.$t('lang.public_product_placeholder'), trigger: "change" }],
        port: [{ required: true, validator: validatePort, trigger: "change" }],
        gender: [{ required: true, message: THIS.$t('lang.public_audience_placeholder'), trigger: "change" }]
      },
      ageErrorMsg: ""
    };
  },

  computed: {
    ...mapState("project", [
      "basic_info_status",
      "customer_list",
      // "brand_list",
      // "product_list",
      "port_list",
      "projectID",
      "customerID",
      'customerName',
      "curVersion"
    ])
  },
  watch: {},
  async created() {
    this.form.customer_id = this.customerID;
    if (this.customerID) {
      this.setBrandList();
    }
    this.fetch_customer_port_list({ menu: 2 });
    if (this.basic_info_status == "active") {
      this.fetchGetData();
    }
  },
  mounted() {},
  methods: {
    ...mapActions("permissions", ["setMediaCpmPermission"]),
    ...mapActions("project", [
      "fetch_step_status",
      "update_project_id",
      "update_project_name",
      "update_basic_info_status",
      "fetch_customer_port_list",
      "fetch_brand_list",
      "fetch_product_list",
      "fetch_log_info",
      "fetch_preview_data",
      "update_active_step",
      "update_customer_id",
      "update_customer_name",
      "update_version_list",
    ]),

    // 检查年龄是否重叠
    checkAgeOverlap(obj) {
      let id = obj.id;
      let s = obj.start - 0;
      let e = obj.end - 0;

      for (let i of this.form.ages) {
        if (i.id != id) {
          let start = i.start - 0;
          let end = i.end - 0;
          if (start <= e && s <= end) {
            return true;
          }
        }
      }
      return false;
    },
    validateNum(rule, obj, callback) {
      var start = _.trim(obj.start);
      var end = _.trim(obj.end);
      let arr = [start, end];
      let rs = true;
      if (start == "" && end == "") {
        this.ageErrorMsg = "";
        callback();
      } else {
        for (const i of arr) {
          if (/^[1-9]+\d*$/.test(i + "")) {
            /* let _val = i - 0;
            if (_val > 100) {
              rs = rs && false;
              break;
            } else {
              rs = rs && true;
            } */
            if (i > 149) {
              rs = false
            }
            rs = rs && true;
          } else {
            rs = rs && false;
            break;
          }
        }
        // debugger
        if (rs) {
          if (this.checkAgeOverlap(obj)) {
            this.ageErrorMsg = this.$t('lang.reg_age_error_msg');
            callback(new Error(" "));
          } else {
            this.ageErrorMsg = "";
            callback();
          }
        } else {
          this.ageErrorMsg = this.$t('lang.reg_integer_must_greater_than_0');
          callback(new Error(" "));
        }
      }

      // rs ? callback() : callback(new Error(" "));
    },
    setForm(data) {
      this.form.name = data.project_name;
      this.form.customer_id = data.customer_id;
      this.form.brand_id = data.brand_id;
      this.form.product_id = data.product_id;
      this.form.cycle = [moment(data.start_time).format("YYYY-MM-DD"), moment(data.end_time).format("YYYY-MM-DD")];
      this.form.gender = data.gender;
      this.form.port = data.port.split(",");
      // this.form.ages = data.age;
      let ageArr = JSON.parse(data.age);
      this.form.ages = [];
      for (const i of ageArr) {
        let obj = {};
        obj.start = i[0];
        obj.end = i[1];
        this.addCore(obj);
      }
    },
    async fetchGetData() {
      let project_id = this.projectID;
      let data = await this.fetchCore("/projects/projectdetail", { project_id });
      this.setForm(data);
      this.setBrandList();
      this.setProductList();
    },
    async setBrandList() {
      if (this.form.customer_id) {
        let { brand_list } = await this.fetch_brand_list({ customer_id: this.form.customer_id, menu: 2 });
        this.brand_list = brand_list;
      } else {
        this.brand_list = [];
      }
    },
    changeCustomer() {
      this.setBrandList();
      this.form.brand_id = "";
      this.form.product_id = "";
      this.product_list = [];
    },
    async setProductList() {
      if (this.form.brand_id) {
        let customer_id = this.form.customer_id;
        let brand_id = this.form.brand_id;
        let { product_list } = await this.fetch_product_list({ customer_id, brand_id, menu: 2 });
        this.product_list = product_list;
      } else {
        this.brand_list = [];
        this.product_list = [];
      }
    },
    changeBrand() {
      this.setProductList();
      this.form.product_id = "";
    },
    changeProduct() {},
    changePort() {},
    addCrowdAge() {
      this.addCore({ start: "", end: "" });
    },
    addCore({ start, end }) {
      this.form.ages.push({
        id: _.uniqueId(),
        start,
        end
      });
    },
    deleteCrowdAge(id) {
      this.form.ages = this.form.ages.filter(item => {
        return item.id != id;
      });
      // debugger;
    },
    /**格式化参数结构 */
    getParamData() {
      let age = this.form.ages.map(item => {
        if (item.start && item.end) {
          return [item.start, item.end];
        }
      });
      age = age.filter(i => !!i);
      return {
        project_id: this.projectID,
        name: this.form.name,
        customer_id: this.form.customer_id,
        brand_id: this.form.brand_id,
        product_id: this.form.product_id,
        port: this.form.port.join(","),
        gender: this.form.gender,
        start_time: this.form.cycle[0],
        end_time: this.form.cycle[1],
        age
      };
    },
    getCustomerName(id){
      let obj = this.customer_list.find(i=>i.id==id);
      if (obj) {
        return obj.customer_name
      }else{
        return ''
      }
    },
    onSubmit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let data = this.getParamData();
          let product_id = await this.fetchCore("/projects/add_action", data);
          // console.log(res)
          let customerName = this.getCustomerName(data.customer_id);
          this.update_customer_id(data.customer_id);
          this.update_customer_name(customerName);
          this.update_project_id(product_id);
          this.update_project_name(data.name);
          this.update_basic_info_status("active");
          this.update_version_list()
          this.fetch_preview_data();
          this.fetch_log_info();
          this.setMediaCpmPermission(this.form.product_id);
          this.onClose();
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.onClose();
      //从列表过来的创建项目，点击取消要回到项目列表  产品的恶心需求  把用户懒死
      if (this.customerID&&!this.projectID) {
        this.$router.push({
          name: "ProjectManage",
          params: { 
            customer_id: this.customerID, 
            customer_name: this.customerName, 
          }
        });
      }
    },
    onClose(bool) {
      this.update_active_step(1);
      this.fetch_step_status();
      this.$emit("update:isShow", false);
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
<style scoped>
.project-create-form {
  margin: 40px;
}
.add-btn {
  display: inline-block;
  cursor: pointer;
  margin-left: 49px;
  margin-top: 15px;
  color: #2d9c96;
  font-size: 12px;
}
.age-error-msg {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  margin-left: 50px;
}
</style>
<style>
.project-create-form .el-form-item--mini.el-form-item.gender-form-item,
.project-create-form .el-form-item--mini.el-form-item.age-form-item {
  margin-bottom: 0px;
}
.project-create-form .el-form-item__label {
  color: #fff;
  opacity: 0.6;
}
.project-create-form .age-start .el-input,
.project-create-form .age-end .el-input {
  display: inline-block;
  width: 90px;
}

.port-select-tree .el-select-group__wrap {
  padding-bottom: 0px;
}

.port-select-tree .el-select-group__wrap:not(:last-of-type)::after {
  background: transparent;
}

.port-select-tree .el-select-group__wrap .el-select-dropdown__item {
  padding-left: 40px;
}

.port-select-tree.is-multiple .el-select-dropdown__item.selected {
  background-color: #42a996;
}

.port-select-form .el-tag {
  background-color: #42a996;
}
.port-select-form .el-tag .el-select__tags-text {
  color: #fff;
}
</style>