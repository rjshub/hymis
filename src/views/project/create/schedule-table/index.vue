<template>
  <hy-dialog :visible="true"
      title="Spot Plan"
      custom-class='schedule-table'
      @close="onClose"
      :close-on-click-modal="false">
    <div class="box" v-loading="isLoading">
      <el-button @click="onScheduleSet" v-if="enableWriteCreateProject" style="margin-left: 12px;">{{$t('lang.AS_detail_Spotplan_setting')}}</el-button>
      <el-select v-model="media"
          style="margin:10px"
          size="mini"
          :placeholder="$t('lang.public_media_placeholder')">
        <el-option key=""
            :label="$t('lang.AS_detail_basic_data_media_label')"
            value="">
        </el-option>
        <el-option v-for="item in mediaList"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>

      <div class="table-box" style="height:calc(100% - 48px)">
        <el-table :data="renderData"
            :row-class-name='rowClassName'
            :border='true'
            height="100%"
            style="width: 100%;background: #434954;">
   <!-- /*(背景调换)新建项目排期表背景*/ -->
          <el-table-column prop="site_area"
              :label="$t('lang.AS_detail_schedule_table_config.web_site')"
              fixed='left'
              width="90">
          </el-table-column>
          <el-table-column prop="adname"
              :label="$t('lang.AS_detail_schedule_table_config.ad_name')"
              fixed='left'
              width="100">
          </el-table-column>

          <el-table-column :prop="day"
              v-for="day in dayList"
              :key="day"
              :label="day"
              :render-header='renderHeader(day)'
              width="60">
            <template slot-scope="scope">
              <template v-if="!scope.row.is_media">
                <span :title="scope.row[day]" v-if="scope.row[day]">
                  {{$formatNumber(scope.row[day],0,'') }}</span>
                <span v-else>--</span>
              </template>

            </template>
          </el-table-column>
          <!-- <el-table-column prop="name"
              label="姓名"
              :render-header='renderHeader'
              width="180">
          </el-table-column> -->

          <!-- <el-table-column prop="address"
              label="地址">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="unit_quantity"
              :label="$t('lang.AS_detail_schedule_table_config.unit_quantity')"
              width="70">
            <template slot-scope="scope">
              {{$formatNumber(scope.row['unit_quantity'],0,'') }}
            </template>
          </el-table-column>
          <el-table-column prop="unit"
              :label="$t('lang.AS_detail_schedule_table_config.unit')"
              width="50">
          </el-table-column>
          <el-table-column prop="start_day"
              :label="$t('lang.AS_detail_schedule_table_config.start_day')"
              width="100">
          </el-table-column>
          <el-table-column prop="end_day"
              :label="$t('lang.AS_detail_schedule_table_config.end_day')"
              min-width="100">
          </el-table-column>

        </el-table>
      </div>

    </div>
    <!-- <span ref="textWidthRef">{{textStr}}</span> -->
    <div slot="footer">
      <el-button @click="onDelete" v-if="enableWriteCreateProject">{{$t('lang.public_tooltip_delete')}}</el-button>
      <el-button plain
          @click="onGoTo4">{{$t('lang.AS_detail_back_step4')}}</el-button>
      <el-button @click="onDownload" v-if="tableData.length">{{$t('lang.AS_detail_download_excel')}}</el-button>
    </div>
  </hy-dialog>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "schedule-table",
  components: {},
  props: {
    isShow: {
      type: [Boolean],
      required: true
    }
  },
  data() {
    return {
      // textStr:'5454MMK 为什么的',
      isLoading:false,
      mediaList: [
        /* {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        } */
      ],
      media: "",
      tableData: [],
      dayList: []
    };
  },

  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    renderData(){
      let rs = [];
      let flag = false;
      if (this.media) {
        for (const item of this.tableData) {
          if (item.is_media) {
            if (item.site_area==this.media) {
              flag = true;
            }else{
              flag = false;
            }
          }
          if (flag) {
            rs.push(item);
          }
        }
      }else{
        rs = this.tableData;
      }
      return rs;
    },
  },
  watch: {},

  created() {
    this.fetchList();
    //初始化,无法操作dom
  },
  mounted() {
    //初始化，可以操作dom
    //this.refs
  },
  methods: {
    ...mapActions("project", ["fetch_preview_data","updata_preview_log_step_status"]),
    onScheduleSet(){
      this.$dispatch("scheduleTableChart", "schedule-table-open-set-dialog");
    },
    onDelete(){
      this.$confirm(this.$t('lang.AS_detail_schedule_table_delete_confirm'), this.$t('lang.public_dialog_point'), {
          confirmButtonText: this.$t('lang.public_button_confirm'),
          cancelButtonText: this.$t('lang.public_button_cancel'),
          type: 'warning'
        }).then(() => {
          this.fetchDelete();
        }).catch(() => {
                
        });
    },
    async fetchDelete() {
      let param = { project_id: this.projectID};
      let res = await this.fetchCore("/scheduling/delete", param);
      this.onClose();
    },
    rowClassName({ row, rowIndex }) {
      if (row.is_media) {
        return "media-row";
      }
    },
    async onDownload() {
      // this.$downloadFile("/api/projects/downloadallocation?project_id=" + this.projectID);
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/scheduling/downloadschedule", { project_id,version });
        this.$downloadFile('api/'+res);
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    onGoTo4() {
      this.$emit("update:isShow", false);
      this.$eventHub.$emit("OPEN-COMPONENT-COMPUTE");
    },
    //指定表头单元格Style
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == this.activeHead) {
        return { color: "#ffcc00" };
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
      if (rowIndex == 2 && columnIndex == 2) {
        return { color: "#0aecbf" };
      }
    },
    renderHeader(day) {
      return (h, { column, $index }) => {
        let dayStr = moment(day).format("D");
        let monStr = moment(day).format("M月");

        let child = [h("span", { class: "day-head" }, [dayStr])];
        if (dayStr == "1") {
          child.unshift(h("span", { class: "mon-head" }, [monStr]));
        }
        return h("span", {  class: "day-box-head" } , child);
      };
    },

    clickHandler() {
      // console.log("clickHandler");
    },
    onClose() {
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
    },
    setDayList({start_day,end_day}) {
      // if (detail.length && detail[0].data.length) {
        // let obj = detail[0].data[0];

        let sday = moment(start_day).startOf('month');  //指定月的月初
        let eday = moment(end_day).endOf('month').startOf("day").add(1, "d");  //指定月的月末
        // console.log(eday.format('YYYY-MM-DD'))
        let dayArr = [];
        while (!sday.isSame(eday)) {
          dayArr.push(sday.format("YYYY-MM-DD"));
          sday.add(1, "d");
        }
        this.dayList = dayArr;
      // }
    },
    formatData({ detail, total }) {
      let arr = [];
      for (let item of detail) {
        let media = item.name;
        arr.push({ site_area: media, is_media: true });
        arr.push(...item.data);
      }
      arr.push(total);
      return arr;
    },
    setSelectList(arr){
      let rs = [];
      for (const i of arr) {
        rs.push(i.name);
      }
      this.mediaList = rs;
    },
    async fetchList() {
      let version = this.curVersion;
      let param = { project_id: this.projectID, media: this.media,version };
      let res = await this.fetchCore("/scheduling/schedulelist", param);
      // console.log(res)
      // return
      if (res&&res.data) {
        this.setDayList(res.data.total);
        this.setSelectList(res.data.detail);
        this.tableData = this.formatData(res.data);
      }
      
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
<style>
.schedule-table .mis-dialog-body {
  height: calc(100% - 58px);
  margin-top: 5px;
}
</style>

<style scoped>
/*本地部分*/
.box {
  /* padding-left: 28px; */
  /* padding-top: 24px; */
  box-sizing: border-box;
  height: 100%;
}

.yellow {
  color: #ffcc00;
}
.green {
  color: #0aecbf;
}
</style>
<style>
.schedule-table .el-table th.media-row,
.schedule-table .el-table tr.media-row {
  background: #72777f;    /*(背景调换)新建项目排期表排期每行媒体的背景*/
}
.schedule-table .day-head {
  position: absolute;
  bottom: -5px;
}
.schedule-table .mon-head {
  position: absolute;
  top: -1px;
}
.schedule-table .day-box-head {
  position: relative;
  display: block;
  height: 36px;
  width:36px;
  margin-left: 2px;
}
</style>