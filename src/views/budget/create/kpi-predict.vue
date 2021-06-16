<template>
    <head-fold :title="`STEP4:${$t('lang.budget_step4_title')}`"
        style="margin-top:20px">
        <div class="clearfix kpi-predict">
            <div class="clearfix">
              <!-- style="width:130px;margin-left:5px" -->
                <el-select v-model="mediaType"
                    style="width:180px;margin-left:5px"
                    size="mini"
                    clearable
                    @change='onChangeMediaType'
                    :placeholder="$t('lang.public_media_type_placeholder')">
                    <!-- <el-option key="0"
            label="全部媒体类型"
            value=""></el-option> -->
                    <el-option v-for="item in slist.typelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="media"
                    style="width:180px;margin-left:5px"
                    size="mini"
                    filterable
                    clearable
                    @change='onChangeMedia'
                    :placeholder="$t('lang.public_media_placeholder')">
                    <!-- <el-option key="0"
            label="全部媒体"
            value=""></el-option> -->
                    <el-option v-for="item in slist.medialist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>

            </div>
            <div style="margin-top: 20px;">
                <el-table :data="renderList"
                    max-height="400"
                    :border='true'
                    style="width: 100%;background-color: 434954;">

                    <el-table-column prop="media_type"
                        :label="$t('lang.budget_step4_kpi_table_config.media_type')">
                    </el-table-column>
                    <el-table-column prop="media"
                        :label="$t('lang.budget_step4_kpi_table_config.media')">
                    </el-table-column>
                    <el-table-column prop="CPM"
                        :label="$t('lang.budget_step4_kpi_table_config.CPM')">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CPM[0])}}~{{twoPoint(scope.row.CPM[1])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPC"
                        :label="$t('lang.budget_step4_kpi_table_config.CPC')">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CPC[0])}}~{{twoPoint(scope.row.CPC[1])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPL"
                        :label="$t('lang.budget_step4_kpi_table_config.CPL')">
                        <template slot-scope="scope">
                            <template v-if="scope.row.CPL[0]!='-'&&scope.row.CPL[1]!='-'">
                                {{twoPoint(scope.row.CPL[0])}}~{{twoPoint(scope.row.CPL[1])}}
                            </template>
                            <template v-else>--</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CTR"
                        :label="$t('lang.budget_step4_kpi_table_config.CTR')">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CTR[0])}}~{{twoPoint(scope.row.CTR[1])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPUV"
                        :label="$t('lang.budget_step4_kpi_table_config.CPUV')">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CPUV[0])}}~{{twoPoint(scope.row.CPUV[1])}}
                        </template>
                    </el-table-column>

                </el-table>
            </div>

        </div>
    </head-fold>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import headFold from "@/views/public/head-fold";

export default {
  name: "kpi-predict",
  components: { headFold },
  props: {
    list: {
      type: Array,
      required: true
    },
    selectList: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      slist: {},
      mediaType: "",
      media: ""
    };
  },
  watch: {},
  computed: {
    renderList() {
      let list = _.cloneDeep(this.list);
      if (this.mediaType) {
        list = list.filter(i => i.media_type_id == this.mediaType);
      }
      if (this.media) {
        list = list.filter(i => i.media_id == this.media);
      }
      return list;
    }
  },
  created() {
    this.slist = this.selectList;
  },
  mounted() {},
  methods: {
    twoPoint(val) {
      return this.$formatNumber(val, 2, "");
    },
    onChangeMediaType() {
      // this.sendEvent();
    },
    onChangeMedia() {
      // this.sendEvent();
    },
    sendEvent() {
      this.$eventHub.$emit("KPI-PREDICT", {
        mediaType: this.mediaType,
        media: this.media
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.kpi-predict {
  margin-top: 30px;
}
</style>
<style lang='scss'>
.kpi-predict {
  .el-table .el-table__row.row-last .cell {
    color: #b2b4b9;
    font-weight: 800;
    font-size: 14px;
  }
}
</style>
