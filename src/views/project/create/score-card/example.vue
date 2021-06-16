<template>
  <hy-dialog :visible="true"
      custom-class='score-card'
      :title="$t('lang.AS_detail_score_card_example_title')"
      @close="onClose"
      :close-on-click-modal="false">
    <div class="box" v-loading='isLoading'>
      <!-- 头部 -->
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
        <div class="describe">{{$t('lang.AS_detail_score_card_example_score_card.describe')}}</div>
        <dl style="overflow: hidden;" class="table-demo">
          <dt class="title">{{$t('lang.AS_detail_sample_table')}}</dt>
          <img v-if="languageInfo==='zh'" src="~@/assets/image/project/demo/score-card-demo-zh.png">
          <img v-if="languageInfo==='en'" style="display: block;width: 40%" src="~@/assets/image/project/demo/score-card-demo-en.png">
        </dl>
        <dl>
          <dt class="title">{{$t('lang.AS_detail_specification')}}</dt>
          <dd>{{$t('lang.AS_detail_score_card_example_score_card.format1')}}</dd>
          <dd>{{$t('lang.AS_detail_score_card_example_score_card.format2')}}</dd>
          <dd>{{$t('lang.AS_detail_score_card_example_score_card.format3')}}<u @click="downloadRule"
              style="cursor: pointer;color: #42a996;">{{$t('lang.AS_detail_score_card_example_score_card.format4')}}</u></dd>
          <dd>{{$t('lang.AS_detail_score_card_example_score_card.format5')}}</dd>
          <dd>{{$t('lang.AS_detail_score_card_example_score_card.format6')}}</dd>
          <dd>{{$t('lang.AS_detail_score_card_example_score_card.format7')}}</dd>
        </dl>
      </div>
      <div v-if="activeTab=='2'">
        <div class="describe">{{$t('lang.AS_detail_score_card_example_over_lapping.describe')}}</div>
        <dl style="overflow: hidden;" class="table-demo">
          <dt class="title">{{$t('lang.AS_detail_sample_table')}}</dt>
          <img v-if="languageInfo==='zh'" src="~@/assets/image/project/demo/overlapping-data-demo-zh.png">
          <img v-if="languageInfo==='en'" src="~@/assets/image/project/demo/overlapping-data-demo-en.png">
        </dl>
        <dl>
          <dt class="title">{{$t('lang.AS_detail_specification')}}</dt>
          <dd>{{$t('lang.AS_detail_score_card_example_over_lapping.format1')}}</dd>
          <dd>{{$t('lang.AS_detail_score_card_example_over_lapping.format2')}}<u @click="downloadRule"
              style="cursor: pointer;color: #42a996;">{{$t('lang.AS_detail_score_card_example_over_lapping.format3')}}</u></dd>
          <dd>{{$t('lang.AS_detail_score_card_example_over_lapping.format4')}}</dd>
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
          name: "Score Card"
        },
        {
          id: "2",
          name: "Overlapping"
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
    onDownLoad() {
      let lang = ''
      if (this.$t('lang.overall_language') === 'chinese') {
        lang = ''
      } else {
        lang = 'en/'
      }
      if (this.activeTab == "1") {
        this.$downloadFile(`/static/${lang}score card format.xlsx`);
      } else {
        this.$downloadFile(`/static/${lang}overlapping data format.xlsx`);
      }
    },
    onClose() {
      this.$emit("update:isShow", false);
    },
    onClickTab() {
      console.log(this.activeTab);
      // this.getData();
    },
    async downloadRule() {
      let url = '/markets/downloadall';
      let res = await this.fetchCore(url);
      // console.log('SC',res)
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
.score-card .hy-tab {
  position: absolute;
  top: 6px;
  /* left: 88px; */
  left: 177px;
}
</style>