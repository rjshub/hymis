<template>
  <hy-dialog :visible="true"
      custom-class='operate-guide'
      :title="$t('lang.AS_detail_project_info_title')"
      v-loading="isLoading"
      width="500px"
      :show-close="true"
      @close="onClose"
      :close-on-click-modal="false">
    <div class="box" v-if="isDone">
      <div class="item">
        <span>{{$t('lang.public_project_name')}}:</span>
        <span>{{form.project_name}}</span>
      </div>
      <div class="item">
        <span>{{$t('lang.public_period_label')}}:</span>
        <span>{{formatDate(form.start_time)}}{{$t('lang.public_DatePicker_between')}}{{formatDate(form.end_time)}}</span>
      </div>
      <div class="item">
        <span>{{$t('lang.public_client_label')}}:</span>
        <span>{{form.customer_name}}</span>
      </div>
      <div class="item">
        <span>{{$t('lang.public_brand_label')}}:</span>
        <span>{{form.brand_name}}</span>
      </div>
      <div class="item">
        <span>{{$t('lang.public_product_label')}}:</span>
        <span>{{form.product_name}}</span>
      </div>
      <div class="item">
        <span>{{$t('lang.public_port_label')}}:</span>
        <span>{{formatPort(form.port)}}</span>
      </div>
      <div class="item">
        <span>{{$t('lang.public_audience_label')}}:</span>
        <span>{{formatGender(form.gender)}}</span>
        <span style="display: block;
    text-indent: 36px;">{{formatAge(form.age)}}</span>
      </div>
    </div>

    <div class="clearfix"
        style="margin: 20px;">
      <div class="pull-right">
        <el-button @click="onCancel"
            plain>{{$t('lang.public_button_cancel')}}</el-button>
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
  name: "basic-info-detail",
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
    return {
      isLoading: false,
      isDone: false,
      port:{
        "1":"Phone",
        "2":"Pad",
        "3":"Pc",
        "4":"Mobile(Phone+Pad)",
        "5":"OTT",
      },
      form:{

      }
    };
  },

  computed: {
    ...mapState("project", [
      "basic_info_status",
      "customer_list",
      "curVersion",
      // "brand_list",
      // "product_list",
      "port_list",
      "projectID",
      "pageType",
      "customerID"
    ])
  },
  watch: {},
  created() {
    this.fetchGetData();
  },
  mounted() {},
  methods: {
    ...mapActions("permissions", ["setMediaCpmPermission"]),
    ...mapActions("project", [
      "fetch_step_status",
      "update_project_id",
      "update_basic_info_status",
      "fetch_customer_port_list",
      "fetch_brand_list",
      "fetch_product_list",
      "fetch_log_info",
      "fetch_preview_data",
      "update_active_step"
    ]),
    formatAge(str){
      let arr = JSON.parse(str);
      let rs = [];
      for (let iArr of arr) {
        let tem = iArr[0]+"~"+iArr[1]+ this.$t('lang.AS_detail_years_old');
        rs.push(tem);
      }
      return rs.join(',')
    },
    formatGender(id){
      let obj = {
        "0": this.$t('lang.public_female'),
        "1": this.$t('lang.public_male'),
        "2": this.$t('lang.public_all'),
      };
      return obj[id]
    },
    formatPort(str){
      // if (_.isString(str)) {
        let idArr = str.split(',');
        let rs = [];
        for (const id of idArr) {
          rs.push(this.port[id])
        }
        return rs.join(',')
      // }
    },
    formatDate(str){
      return moment(str).format('YYYY-MM-DD')
    },
    async fetchGetData() {
      let project_id = this.projectID;
      let version = this.curVersion;
      let data = await this.fetchCore("/projects/projectdetail", { project_id,version });
      this.form = data;
      this.isDone = true;
    },
    onCancel() {
      this.onClose();
      //从列表过来的创建项目，点击取消要回到项目列表  产品的恶心需求  把用户懒死
      if (this.customerID) {
        let name = this.pageType
        this.$router.push({
          name
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
.box{
  padding: 25px 25px 0px 25px;
  color: #fff;
}
.item{
  padding: 2px 0;
}
.item span:first-child{
  color:#909295;
}
</style>
<style>

</style>