<template>
  <hy-dialog :visible="true"
      title="Overlapping Data"
      custom-class='overlapping-data'
      @close="onClose"
      :heightFillBody='true'
      :close-on-click-modal="false">
    <div class="box">
      <div class="head">
        <!-- 过滤条件 start -->
        <div>
          <el-select v-model="market"
              class="select"
              style=" margin-left: 10px;"
              size="mini"
              filterable
              @change="refresh"
              placeholder="Market">
            <el-option key=""
                :label="$t('lang.AS_detail_basic_data_market_label')"
                value="">
            </el-option>
            <el-option v-for="item in marketList "
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>

          <el-select v-model="media1"
              class="select"
              size="mini"
              filterable
              @change="refresh"
              placeholder="Media1">
            <el-option key=""
                :label="`${$t('lang.AS_detail_basic_data_media_label')}1`"
                value="">
            </el-option>
            <el-option v-for="item in media1List "
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>

          <el-select v-model="media2"
              class="select"
              size="mini"
              filterable
              @change="refresh"
              placeholder="Media2">
            <el-option key=""
                :label="`${$t('lang.AS_detail_basic_data_media_label')}2`"
                value="">
            </el-option>
            <el-option v-for="item in media2List "
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </div>
        <!-- 过滤条件 end -->
      </div>
      <!-- 列表 -->

      <el-table :data="tableData"
          height="calc(100% - 48px)"
          style="width: 100%;background:#434954">
<!-- 暂无用 -->
        <el-table-column prop="market"
            label="Market">
        </el-table-column>

        <el-table-column prop="media1"
            label="Media1">
        </el-table-column>

        <el-table-column prop="media2"
            label="Media2">
        </el-table-column>

        <el-table-column prop="overlap"
            :label="`${$t('lang.third_nav_media_overlap_ranking')} %`">
          <template slot-scope="scope">
            {{formatOverlap(scope.row.overlap)}}
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div slot="footer" v-if="enableWriteCreateProject">

      <el-upload style="display:inline-block"
          :data='{project_id:projectID}'
          action="/api/overlapping/importoverlapping"
          :show-file-list="false"
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          :on-error='handleError'
          :before-upload='handleBeforeUpload'
          :on-success="handleSuccess">
        <el-button plain>{{$t('lang.public_upload_again')}}</el-button>
      </el-upload>
      <el-button plain
          @click="onDelete">{{$t('lang.public_tooltip_delete')}}</el-button>
    </div>
  </hy-dialog>

</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import math from "mathjs";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "over-lapping",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isVisible: true,
      isLoading: false,
      tableData: [],
      market: "",
      media1: "",
      media2: "",
      marketList: [],
      media1List: [],
      media2List: []
    };
  },

  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
  },
  watch: {},

  created() {
    // this.update_project_id("2"); //临时代码
    this.init();
  },

  mounted() {},
  methods: {
    ...mapActions("project", ["update_project_id", "fetch_preview_data", "updata_preview_log_step_status"]),
    handleError() {
      this.$message.error(this.$t('lang.public_upload_fail'));
    },
    handleBeforeUpload() {},
    handleSuccess(res, file) {
      if (res && res.ret == 0) {
        this.$message.success(this.$t('lang.public_upload_success'));
        this.init();
      } else {
        this.$message.error(res.msg|| this.$t('lang.public_upload_fail'));
      }
    },
    onDelete() {
      this.$confirm(`${this.$t('lang.public_delete_confirm')}Overlapping Data？`, this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(async () => {
          await this.fetchCore("/overlapping/delete", { project_id: this.projectID });
          this.onClose();
        })
        .catch(() => {
          // console.log("取消");
        });
    },

    formatOverlap(overlap) {
      let num = math.eval(overlap + "*100") - 0;
      return this.$formatNumber(num, 2, "");
    },

    onClose() {
      // this.fetch_preview_data();
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
    },
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    },
    async get_select_list() {
      let obj = await this.fetchCore("/basicdata/selectedlists", { project_id: this.projectID });
      this.marketList = obj.market;
      this.mediaList = obj.media;
    },
    async get_media_list() {
      let data = await this.fetchCore("/overlapping/selectlist", { project_id: this.projectID });
    },
    async fetch_table_list() {
      // project_id,market,media1,media2
      let param = {
        project_id: this.projectID,
        version:this.curVersion,
        market: this.market,
        media1: this.media1,
        media2: this.media2
      };
      let data = await this.fetchCore("/overlapping/overlappinglist", param);
      this.tableData = data;
      // this.total = Number.parseInt(res.total);
    },

    refresh() {
      this.fetch_table_list();
    },
    setSelectList() {
      for (let item of this.tableData) {
        this.marketList.push(item.market);
        this.media1List.push(item.media1);
        this.media2List.push(item.media2);
      }
      this.marketList = _.uniq(this.marketList);
      this.media1List = _.uniq(this.media1List);
      this.media2List = _.uniq(this.media2List);
    },
    async init() {
      // this.get_select_list();
      await this.fetch_table_list();
      this.setSelectList();
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
/*本地部分*/
.box {
  box-sizing: border-box;
  height: 100%;
}
.head {
  padding: 10px;
}

.select {
  width: 110px;
  margin: 0 10px 0 0;
}
</style>
<style>
.overlapping-data .mis-dialog-body {
  /* height: 100%; */
  margin-top: 5px;
}
/*全局部分*/
</style>