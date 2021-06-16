<template>
  <hy-dialog :visible="true"
    custom-class='basic-data-demo'
    :title="$t('lang.AS_detail_basic_data_example_title')"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="box" v-loading='isLoading'>
      <el-tabs v-model="activeTab"
        class="hy-tab"
        type="card"
        @tab-click="onClickTab">
        <el-tab-pane v-for="(item,index) in tabList"
          :label="item.name"
          :key="index"
          :name="item.id">
        </el-tab-pane>
      </el-tabs>

      <div v-if="activeTab=='1'">
        <div class="describe">{{$t('lang.AS_detail_basic_data_example_basic_data.describe')}}</div>
        <dl class="table-demo">
          <dt class="title">{{$t('lang.AS_detail_sample_table')}}</dt>
          <img v-if="languageInfo==='zh'" src="~@/assets/image/project/demo/basic-data-demo-zh.png">
          <img v-if="languageInfo==='en'" style="display: block;width: 100%" src="~@/assets/image/project/demo/basic-data-demo-en.png">
        </dl>
        <dl>
          <dt class="title">{{$t('lang.AS_detail_specification')}}</dt>
          <dd>{{$t('lang.AS_detail_basic_data_example_basic_data.format1')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_basic_data.format2')}}<u @click="downloadRule"
              style="cursor: pointer;color: #42a996;">market&media</u>{{$t('lang.AS_detail_basic_data_example_basic_data.format3')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_basic_data.format4')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_basic_data.format5')}}</dd>
        </dl>
      </div>
      <div v-if="activeTab=='2'">
        <div class="describe">{{$t('lang.AS_detail_basic_data_example_target_cpm.describe')}}
        </div>
        <dl class="table-demo">
          <dt class="title">{{$t('lang.AS_detail_sample_table')}}</dt>
          <img v-if="languageInfo==='zh'" src="~@/assets/image/project/demo/basic-data-cpm-demo-zh.png">
          <img v-if="languageInfo==='en'" src="~@/assets/image/project/demo/basic-data-cpm-demo-en.png">
        </dl>
        <dl>
          <dt class="title">{{$t('lang.AS_detail_specification')}}</dt>
          <dd>{{$t('lang.AS_detail_basic_data_example_target_cpm.format1')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_target_cpm.format2')}}<u @click="downloadRule"
              style="cursor: pointer;color: #42a996;">market</u>{{$t('lang.AS_detail_basic_data_example_target_cpm.format3')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_target_cpm.format4')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_target_cpm.format5')}}</dd>
        </dl>
      </div>
      <div v-if="activeTab=='3'">
        <div class="describe">{{$t('lang.AS_detail_basic_data_example_reach_goal.describe')}}
        </div>
        <dl class="table-demo">
          <dt class="title">{{$t('lang.AS_detail_sample_table')}}</dt>
          <img src="~@/assets/image/project/demo/basic-data-reach-demo.png">
        </dl>
        <dl>
          <dt class="title">{{$t('lang.AS_detail_specification')}}</dt>
          <dd>{{$t('lang.AS_detail_basic_data_example_reach_goal.format1')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_reach_goal.format2')}}<u @click="downloadRule"
              style="cursor: pointer;color: #42a996;">market</u>{{$t('lang.AS_detail_basic_data_example_reach_goal.format3')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_reach_goal.format4')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_reach_goal.format5')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_reach_goal.format6')}}</dd>
          <dd>{{$t('lang.AS_detail_basic_data_example_reach_goal.format7')}}</dd>
        </dl>
      </div>
    </div>

    <div slot="footer">
      <el-button plain
        @click="onDownLoad">{{$t('lang.AS_detail_download_form_template')}}</el-button>
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
  data() {
    return {
      isVisible: true,
      isLoading: false,
      activeTab: "1", //当前激活的tab，只能是字符串
      tabList: [
        {
          id: "1",
          name: "Basic Data"
        },
        {
          id: "2",
          name: this.$t('lang.AS_detail_target_CPM')
        },
        {
          id: "3",
          name: "Reach Goal"
        }
      ]
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    ...mapState('user',['languageInfo']),
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {
    onClickTab() {
    },
    onDownLoad() {
      let lang = ''
      if (this.$t('lang.overall_language') === 'chinese') {
        lang = ''
      } else {
        lang = 'en/'
      }
      let url = `/static/${lang}reach goal format.xlsx`;
      
      if (this.activeTab=='1') {
        url = `/static/${lang}basic data format.xlsx`;
      }else if (this.activeTab=='2') {
        url = `/static/${lang}goal cpm format.xlsx`;
      }
      console.log(url, 888)
      this.$downloadFile(url);
    },
    onClose() {
      this.$emit("update:isShow", false);
    },
    async downloadRule() {
      /* let url = '/static/Name Specifications of Markets&Media.zip';
      if (this.activeTab!='1') {
        url = '/static/market name.xlsx';
      } */
      let url = '/markets/downloadall';
      if (this.activeTab!='1') {
        url = '/markets/download';
      }
      let res = await this.fetchCore(url);
      // console.log('BD',res)
      this.$downloadFile('api/'+res);
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
  }
};
</script>
<style scoped>
.box {
  padding: 26px 20px;
  color: #999999;
  height: 100%;
  box-sizing: border-box;
}
.describe {
}
.title {
  color: #42a996;
  font-weight: bold;
}
dt {
  margin-bottom: 36px;
  margin-top: 32px;
}
</style>
<style>
.basic-data-demo .hy-tab {
  position: absolute;
  top: 6px;
  /* left: 159px; */
  left: 177px;
}
</style>