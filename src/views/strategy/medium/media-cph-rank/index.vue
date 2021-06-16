<template>
  <div class="media-cph-rank-content"
    v-loading.fullscreen.lock='isLoading'>

    <div class="clearfix"
      style="margin:10px 0">

      <el-select v-model="mediaOneLevel"
        style="width:195px;"
        size="mini"
        filterable
        clearable
        class="hy-input-with-title"
        @change='onChangeMediaOneLevel'
        :placeholder="$t('lang.public_Media_primary_classification_placeholder')">
        <el-option v-for="item in mediaOneLevelList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="mediaTwoLevel"
        style="width:210px;"
        size="mini"
        filterable
        clearable
        class="hy-input-with-title"
        @change='onChangeMediaTwoLevel'
        :placeholder="$t('lang.public_Media_second_classification_placeholder')">
        <el-option v-for="item in mediaTwoLevelList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-date-picker size="mini"
        style="width: 194px;vertical-align: top;"
        v-model="month"
        type="month"
        align="center"
        :editable='false'
        :format="$t('lang.MS_date_picker_format')"
        :clearable="false"
        value-format="yyyy-MM"
        :picker-options="pickerOptions"
        @change="changeMonth()">
      </el-date-picker>

      <el-input size="mini"
        style="width:193px;vertical-align:bottom;"
        :placeholder="$t('lang.public_key_words')"
        v-model="keyWord"
        @keyup.enter.native="onSearch">
        <i slot="suffix"
          class="el-input__icon el-icon-search"
          @click="onSearch"
          style="cursor: pointer;"></i>
      </el-input>

    </div>

    <el-table :data="tableList"
      min-height="500"
      :border="table_border"
      style="width: 100%;">

      <el-table-column prop="rank"
        width="60"
        :label="$t('lang.MS_media_cph_rank_table_config.rank')">
      </el-table-column>
      <el-table-column prop="media"
        :label="$t('lang.MS_media_cph_rank_table_config.media')">
      </el-table-column>

      <el-table-column prop="level_1_name"
        :label="$t('lang.MS_media_cph_rank_table_config.level_1_name')">
      </el-table-column>
      <el-table-column prop="level_2_name"
        :label="$t('lang.MS_media_cph_rank_table_config.level_2_name')">
      </el-table-column>

      <el-table-column prop="score"
        :label="$t('lang.MS_media_cph_rank_table_config.score')">

        <template slot="header"
          slot-scope="scope">
          <div class="table-scope-header">
            {{$t('lang.MS_media_cph_rank_table_config.score')}}
            <!-- <img class="help"
              title="媒体覆盖数、以及历史投放数据综合效果打分"
              src="~@/assets/image/help.png" /> -->
              <i class="help iconfont icon-help" :title="$t('lang.MS_media_cph_rank_table_config.score_tooltip')"></i>
          </div>
        </template>
        <template slot-scope="scope">
          <template v-if="scope.row.score!=0">
            {{$formatNumber(scope.row.score,2,'')}}
            <template v-if="scope.row.increase!='0%'">
              <i class="icon-arrow-up"
                v-if="scope.row.increase.indexOf('-')==-1"
                style="vertical-align: -3px;"></i>
              <i class="icon-arrow-fall"
                v-else
                style="vertical-align: -3px;"></i>
            </template>
          </template>
          <span v-else>--</span>

          <!-- <span v-if="scope.row.status==1" style='color:#42a996'>启用</span>
          <span v-else style='color:#ffcc00'>停用</span> -->
        </template>
      </el-table-column>

      <el-table-column prop="increase"
        :label="$t('lang.MS_media_cph_rank_table_config.increase')">
        <template slot="header"
          slot-scope="scope">
          <div class="table-scope-header">
            {{$t('lang.MS_media_cph_rank_table_config.increase')}}
            <!-- <img class="help"
              title="媒体选中月与前一个月环比增长比率"
              src="~@/assets/image/help.png" /> -->
              <i class="help iconfont icon-help" :title="$t('lang.MS_media_cph_rank_table_config.increase_tooltip')"></i>
          </div>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.increase==''||(scope.row.increase=='0%'&&scope.row.score==0)">--</span>
          <template v-else>
            {{scope.row.increase}}
          </template>

        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-wrap clearfix">
      <el-pagination background
        @size-change="onSizeChange"
        class="pull-right"
        @current-change="onCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10,20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import theme from '@/views/mixin/theme/table-border'
// import CityCreate from "./city/create-edit";
// import MediaCreate from "./media/create-edit";

export default {
  name: "MediaCphRank",
  componentName: "MediaCphRank",
  components: {
    // CityCreate,
    // MediaCreate
  },
  mixins: [theme],
  data() {
    return {
      total: 0, //总页数
      pageSize: 20, //每页几条数据
      currentPage: 1, //当前页面
      pickerOptions: {
        disabledDate(time) {
          return (
            moment(time) - moment().startOf("day") > 0 ||
            moment(time) - moment("2018-04-01").startOf("day") < 0
          );
        }
      },
      tableList: [],
      mediaOneLevel: "",
      mediaOneLevelList: [],
      mediaTwoLevel: "",
      mediaTwoLevelList: [],
      month: moment(moment().subtract(1, "months")).format("YYYY-MM"),
      keyWord: "",
      isLoading: false
    };
  },

  created() {
    this.fetchList();
    this.getSelectList();
    // this.$on("REFRESH", this.fetch_role_list);
  },
  computed: {
    ...mapState("system", ["agent_id"])
  },
  watch: {
    /* $route(n, o) {
      this.searchVal = "";
    },
    agent_id(n, o) {
      this.searchVal = "";
    } */
  },
  methods: {
    async getSelectList() {
      let data = await this.fetchCore("/mediamanage/selectedlist", {
        type_id_1: this.mediaOneLevel,
        type_id_2: this.mediaTwoLevel
      });
      // this.mediaList = data.medias || [];
      this.mediaOneLevelList = data.type.one || [];
      this.mediaTwoLevelList = data.type.two || [];
    },
    async onChangeMediaOneLevel() {
      await this.getSelectList();
      // levelOneAss
      this.mediaTwoLevel = "";
      this.fetchList();
    },
    async onChangeMediaTwoLevel() {
      await this.getSelectList();
      this.fetchList();
    },
    // /strategy/compute_media
    async fetchList(isFirstPage = true) {
      if (isFirstPage) {
        this.currentPage = 1;
      }
      let param = {
        date: this.month + "-01",
        type_id_1: this.mediaOneLevel,
        type_id_2: this.mediaTwoLevel,
        page: this.currentPage,
        page_size: this.pageSize,
        word: this.keyWord
      };
      let _data = await this.fetchCore("/strategy/compute_media", param);
      // console.log('_data',_data)
      if (_.isPlainObject(_data)) {
        this.tableList = _data.list;
        if (_data.page_info) {
          this.total = _data.page_info.total_records - 0;
        } else {
          this.total = 0;
        }
      }else{
        this.tableList = [];
        this.total = 0;
      }
    },
    onSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.fetchList();
    },
    onCurrentChange(val) {
      this.currentPage = val;
      this.fetchList(false);
    },

    changeMonth() {
      this.fetchList();
    },
    onSearch() {
      this.fetchList();
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
    test() {}
  }
};
</script>
<style scoped lang="scss">
.media-cph-rank-content {
  // padding-top: 31px;
}
</style>
<style>
/*全局部分*/
</style>
<style lang="scss">
</style>