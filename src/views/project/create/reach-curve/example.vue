<template>
  <hy-dialog :visible="true"
    custom-class='basic-data-demo'
    :title="$t('lang.AS_detail_reach_curve_example_title')"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="box">
      <div class="describe">{{$t('lang.AS_detail_reach_curve_example.describe')}}</div>
      <dl style="overflow: hidden;" class="table-demo">
        <dt class="title">{{$t('lang.AS_detail_sample_table')}}</dt>
        <img v-if="languageInfo==='zh'" src="~@/assets/image/project/demo/reach-curve-demo-zh.png">
        <img v-if="languageInfo==='en'" style="display: block;width: 80%" src="~@/assets/image/project/demo/reach-curve-demo-en.png">
      </dl>
      <dl>
        <dt class="title">{{$t('lang.AS_detail_specification')}}</dt>
        <dd>{{$t('lang.AS_detail_reach_curve_example.format1')}}</dd>
        <dd>{{$t('lang.AS_detail_reach_curve_example.format2')}}</dd>
        <dd>{{$t('lang.AS_detail_reach_curve_example.format3')}}<u @click="downloadRule"
            style="cursor: pointer;color: #42a996;">{{$t('lang.AS_detail_reach_curve_example.format4')}}</u>{{$t('lang.AS_detail_reach_curve_example.format5')}}</dd>
        <dd>{{$t('lang.AS_detail_reach_curve_example.format6')}}</dd>
      </dl>
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
      isLoading: false
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
      this.$downloadFile(`/static/${lang}reach curve format.xlsx`);
    },
    onClose() {
      this.$emit("update:isShow", false);
    },
    async downloadRule() {
      let url = '/markets/download';
      let res = await this.fetchCore(url);
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
    }
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
</style>