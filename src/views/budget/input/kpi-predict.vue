<template>
    <head-fold title="STEP4:KPI预估"
        style="margin-top:20px">
        <div class="clearfix kpi-predict">
            <div class="clearfix">
                <el-select v-model="mediaType"
                    style="width:130px;margin-left:5px"
                    size="mini"
                    clearable
                    @change='onChangeMediaType'
                    placeholder="请选择媒体类型">
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
                    style="width:130px;margin-left:5px"
                    size="mini"
                    filterable
                    clearable
                    @change='onChangeMedia'
                    placeholder="请选择媒体">
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
                    <!-- （背景调换）预算分配第四步表头 -->

                    <el-table-column prop="media_type"
                        label="媒体类型">
                    </el-table-column>
                    <el-table-column prop="media"
                        label="媒体">
                    </el-table-column>
                    <el-table-column prop="CPM"
                        label="预估CPM">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CPM[0])}}~{{twoPoint(scope.row.CPM[1])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPC"
                        label="预估CPC">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CPC[0])}}~{{twoPoint(scope.row.CPC[1])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPL"
                        label="预估CPL">
                        <template slot-scope="scope">
                            <template v-if="scope.row.CPL[0]!='-'&&scope.row.CPL[1]!='-'">
                                {{twoPoint(scope.row.CPL[0])}}~{{twoPoint(scope.row.CPL[1])}}
                            </template>
                            <template v-else>--</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CTR"
                        label="预估CTR">
                        <template slot-scope="scope">
                            {{twoPoint(scope.row.CTR[0])}}~{{twoPoint(scope.row.CTR[1])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPUV"
                        label="预估CPUV">
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
