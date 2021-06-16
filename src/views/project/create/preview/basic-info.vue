<template>
  <tpl :title="$t('lang.AS_detail_project_info_title')"
      width="293px"
      @click-event='clickEvent'>
    <div class="box">
      <p class="title" :title="data.project_name">{{data.project_name}}</p>
      <p>
        <span class="label">{{$t('lang.public_period_label')}}：</span>
        <span :title="data.times">{{data.times}}</span>
      </p>
      <p>
        <span class="label">{{$t('lang.public_client_label')}}：</span>
        <span :title="data.customer_name">{{data.customer_name}}</span>
      </p>
      <p>
        <span class="label">{{$t('lang.public_brand_label')}}：</span>
        <span :title="data.brand_name">{{data.brand_name}}</span>
      </p>
      <p>
        <span class="label">{{$t('lang.public_product_label')}}：</span>
        <span :title="data.product_name">{{data.product_name}}</span>
      </p>
      <p>
        <span class="label">{{$t('lang.public_port_label')}}：</span>
        <span :title="data.port">{{data.port}}</span>
      </p>
      <p>
        <span class="label">{{$t('lang.public_audience_label')}}：</span>
        <span>{{data.gender}}</span>
      </p>
      <p>
        <span class="label">{{$t('lang.public_age')}}：</span>
        <span>{{data.ages}}</span>
      </p>
    </div>
  </tpl>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import tpl from "./tpl";
import fetch from "@/services/fetch";

export default {
  name: "basic-info-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object],
      required: true,
      default: function() {
        return {
          /* project_name: "梁瑞专用Q勿动",
          times: "2018-10-08至2018-10-23",
          customer_name: "LR测试1",
          brand_name: "LR测试品牌1",
          product_name: "LR产品1",
          port: "Phone,Pad",
          gender: "男" */
        };
      }
    }
  },
  data() {
    return {
      isLoading: false,
      showLog: true,
      hasScrollBar: false
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["log_info"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
  },
  created() {},
  mounted() {},
  methods: {
    clickEvent() {
      if (this.enableWriteCreateProject) {
        this.$eventHub.$emit("OPEN-BASIC-INFO");
      }else{
        this.$eventHub.$emit("OPEN-BASIC-INFO-DETAIL");
      }
    }
  }
};
</script>
<style scoped>
.title {
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
}
p {
  padding: 3px 0px;
  overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.box {
  color: #ffffff;
  padding: 18px;
  background: #1c1c1c;  
  box-sizing: border-box;
}
.label {
  color: #909295;
}

</style>
<style>
</style>
