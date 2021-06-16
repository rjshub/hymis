<template>
  <hy-dialog :visible="true"
      v-loading='isLoading'
      title="Reach Curve"
      custom-class='reach-curve'
      @close="onClose"
      :heightFillBody='true'
      :close-on-click-modal="false">
    <div class="box"
        style="height: 100%;">

      <el-tabs v-model="activeTab"
          class="hy-tab"
          type="card"
          @tab-click="onClickTab">
        <el-tab-pane v-for="n in tabList"
            :label="n"
            :key="n"
            :name="n">
        </el-tab-pane>
      </el-tabs>

      <el-table :data="tableData"
          :show-header='true'
          :cell-style='setCellStyle'
          :cell-class-name='setCellClass'
          :header-cell-style='headerCellStyle'
          :header-cell-class-name='headerCellClass'
          style="width: 100%;background: #141C28;">

        <el-table-column v-for="(item,index) in tableHead"
            :fixed='index==0'
            :key="index"
            :prop="item+''"
            :render-header='renderHeader'
            :label="item+''"
            width="100px;">
          <template slot-scope="scope">
            <template v-if="item =='total_imp'">
              {{scope.row['total_imp']}}
            </template>
            <template v-else>
              {{$formatNumber(scope.row[item+''],4,'')}}
            </template>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <div slot="footer" v-if="enableWriteCreateProject">
      <!-- accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' -->
      <!-- <el-button plain
          @click="onClose">取消</el-button> -->
      <el-upload style="display:inline-block"
          :data='{project_id:projectID}'
          action="/api/reachcurve/importreachcurve"
          :show-file-list="false"
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          :on-error='handleError'
          :before-upload='beforeUpload'
          :on-success="handleSuccess">
        <el-button plain>{{$t('lang.public_upload_again')}}</el-button>
      </el-upload>
      <el-button @click="onDelete">{{$t('lang.public_tooltip_delete')}}</el-button>
    </div>
  </hy-dialog>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import math from "mathjs";
import moment from "moment";
import fetch from "@/services/fetch";
const Green = "#0aecbf";
const Yellow = "#ffcc00";
export default {
  name: "reach-curve",
  props: {
    isShow: {
      type: [Boolean],
      required: true
    }
  },
  components: {},
  data() {
    return {
      positions_cache: {}, //只做缓存，不做响应式监测
      tableHeads_cache: {}, //只做缓存，不做响应式监测
      tableDatas_cache: {}, //只做缓存，不做响应式监测
      isLoading: false,
      isVisible: true, //弹窗是否显示
      activeTab: "0", //当前激活的tab，只能是字符串
      tabList: [], //tab列表或者城市列表
      // Highlight
      highlightPoint: [], //当前表格高亮的点  x(列数)和y(行数)坐标，都是从0开始计数
      tableHead: [],
      tableData: [],
      isMounted:false,
    };
  },

  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    column_indx() {
      return this.positions_cache[this.activeTab][1] - 1;
    },
    row_indx() {
      return this.positions_cache[this.activeTab][0] - 2;
    },

  },
  watch: {
    activeTab: {
      handler: function (val, oldVal) {
        // console.log('activeTab:',val)
        this.setHeadAndBody()
      },
      immediate: false
    },
  },
  created() {
    this.getList();
  },

  mounted() {
    console.log('mounted')
    this.isMounted=true;
    // setTimeout(() => {
      // this.setCenterHighlight();
    // }, 5000);
  },
  methods: {
    ...mapActions("project", ["fetch_step_status", "fetch_preview_data", "update_project_id","updata_preview_log_step_status"]),
    handleError(err, file, fileList){
      this.isLoading = false;
      this.$message.error(this.$t('lang.public_upload_fail'));
    },
    beforeUpload(file){
      this.isLoading = true;
    },
    handleSuccess(res, file, fileList){
      this.isLoading = false;
      if (res && res.ret == 0) {
        //不能有&res.ret& 否则进不去
        this.$message.success(this.$t('lang.public_upload_again_success'));
        this.getList();
      } else {
        this.$message.error(res.msg || this.$t('lang.public_upload_fail'));
      }
    },
    onDelete(){
      this.$confirm(`${this.$t('lang.public_delete_confirm')}reach curve?'`, this.$t('lang.public_dialog_point'), {
          confirmButtonText: this.$t('lang.public_button_confirm'),
          cancelButtonText: this.$t('lang.public_button_cancel'),
          type: 'warning'
        }).then(() => {
          this.fetchDelete();
        }).catch(() => {
                
        });
    },
    async fetchDelete(){
      try {
        this.isLoading = true;
        await fetch.post("/reachcurve/delete", { project_id: this.projectID });
        this.isLoading = false; //debugger
        this.onClose();
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
        throw err;
      }
    },
    onClickTab() {
      // console.log(this.activeTab);
    },
    setCenterHighlight(){
      if (this.tableHead) {
        let len = this.tableHead.length;
         const dom = document.querySelectorAll('.el-table__body-wrapper')[0];
        // 如果总列数大于13，才需要进行滚动条定位
        if (len>13) {
          //如果高亮点在0-7 或者从反方向的0-7 是不需要进行重新定位的
          if (this.column_indx>6||len-this.column_indx>7) {
              let tem = this.column_indx - 6;
              dom.scrollLeft = math.eval(tem + "*100") - 0;
          }
        }
      }
    },
    setHeadAndBody() {
      this.tableHead = this.tableHeads_cache[this.activeTab];
      // console.log('this.tableHead---')
      this.$nextTick(() => {
        this.tableData = this.tableDatas_cache[this.activeTab];
        // console.log('this.tableData---')
        this.$nextTick(() => {
          if (this.isMounted) {
            this.isMounted = false;
            setTimeout(() => {
              this.setCenterHighlight();
            }, 500);
          }else{
            this.setCenterHighlight();
          }
        });
      });
    },
    async getList() {
      try {
        this.isLoading = true;
        let version = this.curVersion;
        let _data = await fetch.post("/reachcurve/lists", { project_id: this.projectID,version });
        this.isLoading = false; //debugger
        let data = _data.data;
        // console.log(data)
        // this.positions_cache = Object.assign({}, this.positions_cache, data.position);
        //只做缓存，不做响应式
        this.positions_cache = data.position;
        this.tableHeads_cache = data.columns; //只做缓存，不做响应式
        this.tableDatas_cache = data.curve; //只做缓存，不做响应式
        this.setTabs(data.cpm);
        return data;
      } catch (err) {
        this.$message.error(err.message);
        // console.log(err);
        throw err;
      }
    },
    setTabs(obj) {
      this.tabList = Object.keys(obj);
      this.activeTab = this.tabList[0];
    },
    //指定表头单元格Style
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == this.column_indx) {
        return { color: Yellow };
      }
    },
    headerCellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == this.column_indx) {
        return 'hy_yellow_header';
      }
    },
    /**
     * row:这一行的数据 Object
     * column：这一列的数据 Object
     * rowIndex:行号 从0开始
     * columnIndex：列号 从0开始
     */
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log('setCellStyle',row, column, rowIndex, columnIndex)
      if (rowIndex == this.row_indx && columnIndex == this.column_indx) {
        return { color: Green };
      }
      if (rowIndex == this.row_indx && columnIndex == 0) {
        return { color: Yellow };
      }
    },
    setCellClass({ row, column, rowIndex, columnIndex }) {
      // console.log('setCellStyle',row, column, rowIndex, columnIndex)
      if (rowIndex == this.row_indx && columnIndex == this.column_indx) {
        return 'hy_green_cell';
      }
      if (rowIndex == this.row_indx && columnIndex == 0) {
        return 'hy_yellow_cell';
      }
    },
    renderHeader(h, { column, $index }) {
      // console.log(column.label)
      // console.log($index)
      let name = column.label;
      if ($index == 0) {
        return <span>{name}</span>;
      } else {
        name = this.$formatNumber(name, 0, "", ",");
        // return <span>{$formatNumber(name,0,'',',')}</span>;
        return h("span", {}, [name]);
      }
    },
    clickHandler() {
      // console.log("clickHandler");
    },
    onClose() {
      // this.fetch_preview_data();
      // this.fetch_step_status();
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
    }
  }
};
</script>
<style scoped>
/*本地部分*/
.box {
  /* padding-left: 28px; */
  /* padding-top: 24px; */
  box-sizing: border-box;
}
</style>
<style>
/*全局部分*/
.reach-curve .hy-tab {
  position: absolute;
  top: 6px;
  /* left: 114px; */
  left: 172px;
  max-width: 1040px; /* 不可注释，不然就没有左右翻页了 */
}
.reach-curve .mis-dialog-body {
  /* height: 100%; */
  margin-top: 0px;
  /* overflow:auto; */
}
</style>