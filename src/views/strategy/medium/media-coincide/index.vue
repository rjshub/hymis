<template>
  <div class="media-coincide-content"
    v-loading.fullscreen.lock='isLoading'>

    <div class="clearfix"
      style="margin:10px 0">
<!-- style="width:180px;" -->
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

      <!-- <el-select v-model="mediaTwoLevel"
        style="width:180px;"
        size="mini"
        filterable
        clearable
        class="hy-input-with-title"
        @change='onChangeMediaTwoLevel'
        placeholder="媒体二级分类">
        <el-option v-for="item in mediaTwoLevelList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select> -->

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
        @change="changeMonth">
      </el-date-picker>

      <el-select v-model="mediaA"
        style="width:180px;"
        size="mini"
        filterable
        clearable
        class="hy-input-with-title"
        @change='onChangeMedia'
        :placeholder="$t('lang.public_MediaA_placeholder')">
        <el-option v-for="item in mediaAlist"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <span class="vs">VS</span>

      <el-select v-model="mediaB"
        style="width:180px;"
        size="mini"
        filterable
        clearable
        class="hy-input-with-title"
        @change='onChangeMedia'
        :placeholder="$t('lang.public_MediaB_placeholder')">
        <el-option v-for="item in mediaBlist"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

    </div>

    <el-table :data="tableList"
      min-height="500"
      :border='true'
      :span-method="onSpanMethod"
      style="width: 100%;background-color: #434954;">

      <el-table-column prop="id"
        :label="$t('lang.MS_Media_coincide_table_config.id')">
      </el-table-column>
      <el-table-column prop="media"
        :label="$t('lang.MS_Media_coincide_table_config.media')">
      </el-table-column>

      <el-table-column prop="mediaOneLevel"
        :label="$t('lang.MS_Media_coincide_table_config.mediaOneLevel')">
      </el-table-column>
      <el-table-column prop="mediaTwoLevel"
        :label="$t('lang.MS_Media_coincide_table_config.mediaTwoLevel')">
      </el-table-column>

      <el-table-column prop="uv"
        :label="$t('lang.MS_Media_coincide_table_config.uv')">
        <template slot-scope="scope">
            <span>{{$formatNumber(scope.row.uv,4,'')}}</span>
            <!-- --{{scope.row.media_b_uv_change}}-- -->
            <!-- <template v-if="scope.$index%2==0"> -->
              <template v-if="scope.row.uv_change!=0">
                
                <i class="icon-arrow-up" v-if="scope.row.uv_change>0"
                style="vertical-align: -3px;"></i>
                <i class="icon-arrow-fall" v-else
                  style="vertical-align: -3px;"></i>
              </template>
            <!-- </template> -->
            
            
          <!-- <span v-if="scope.row.status==1" style='color:#42a996'>启用</span>
          <span v-else style='color:#ffcc00'>停用</span> -->
        </template>
      </el-table-column>

      <el-table-column prop="union_uv"
      width="170"
        :label="$t('lang.MS_Media_coincide_table_config.union_uv')">
        <template slot-scope="scope">
          {{$formatNumber(scope.row.union_uv,4,'')}}
        </template>
      </el-table-column>

      <el-table-column prop="intersection_uv"
      width="170"
        :label="$t('lang.MS_Media_coincide_table_config.intersection_uv')">
        <template slot-scope="scope">
          {{$formatNumber(scope.row.intersection_uv,4,'')}}
        </template>
      </el-table-column>

      <el-table-column  prop="overlap_rate" 
        :label="$t('lang.MS_Media_coincide_table_config.overlap_rate')"
        width="140">
        <template slot-scope="scope">
          {{$formatNumber(scope.row.overlap_rate*100,2,'')}}%
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-wrap clearfix">
      <el-pagination background
        @size-change="onSizeChange"
        class="pull-right"
        @current-change="onCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20,30,40,50]"
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
// import CityCreate from "./city/create-edit";
// import MediaCreate from "./media/create-edit";

export default {
  name: "MediaCoverRank",
  componentName: "MediaCoverRank",
  components: {
    // CityCreate,
    // MediaCreate
  },

  data() {
    return {
      media: "",
      terminalType: "",
      total: 0, //总页数
      pageSize: 20, //每页几条数据
      currentPage: 1, //当前页面
      pickerOptions: {
        disabledDate(time) {
          return (moment(time) - moment().startOf("day") > 0)||(moment(time) - moment('2018-04-01').startOf("day") < 0);
        }
      },
      tableList: [],
      mediaOneLevel: "",
      mediaOneLevelList: [],
      mediaTwoLevel: "",
      mediaTwoLevelList: [],
      mediaA:'',
      // mediaAlist:[],
      mediaB:'',
      // mediaBlist:[],
      mediaList:[],
      month: moment(moment().subtract(1, "months")).format("YYYY-MM"),
      keyWord: "",

      isLoading: false,
      isShowCityDialog: false,
      isShowMediaDialog: false,
    };
  },

  created() {
    this.getMediaSelectList();
    this.fetchList();
    // this.$on("REFRESH", this.fetch_role_list);
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    mediaAlist(){
      if (this.mediaB) {
        return this.mediaList.filter(i => i.id!=this.mediaB);
      }else{
        return this.mediaList;
      }
    },
    mediaBlist(){
      if (this.mediaA) {
        return this.mediaList.filter(i => i.id!=this.mediaA);
      }else{
        return this.mediaList;
      }
    },
    tableListRender(){
      if (this.mediaOneLevel=='') {
        return this.tableList;
      }
    },
  },
  methods: {
    // 获取一级二级媒体下拉列表
    async getMediaSelectList(){
      let data = await this.fetchCore("/strategy/selectlist", {
        type_id_1: this.mediaOneLevel,
        // type_id_2: this.mediaTwoLevel
      });
      this.mediaList = data.medias || [];
      this.mediaOneLevelList = data.type.one || [];

      // this.mediaTwoLevelList = data.type.two || [];
    },
    // 一级媒体的change事件
    async onChangeMediaOneLevel() {
      this.mediaTwoLevel = "";
      this.clearMedia()
      await this.getMediaSelectList();
      this.fetchList();
    },
    // 二级媒体的change事件
    async onChangeMediaTwoLevel() {
      this.clearMedia()
      await this.getMediaSelectList();
      this.fetchList();
    },
    clearMedia(){
      this.mediaA='';
      this.mediaB='';
    },
    onChangeMedia(val){
      // if (this.mediaA&&this.mediaB) {
        this.fetchList();
      // }
    },
    onSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex )
      let spanRowColumn = [0,5,6,7];
      if (spanRowColumn.includes(columnIndex) ) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    onDetail(obj) {},
    onSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.fetchList();
    },
    onCurrentChange(val) {
      this.currentPage = val;
      this.fetchList(false);
    },
    async fetchList(isFirstPage=true) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      let param = {
        "type_id_1":this.mediaOneLevel,
        "type_id_2":this.mediaTwoLevel,
        "date":this.month+"-01",
        "media_a":this.mediaA,
        "media_b":this.mediaB,
        "page_size":this.pageSize,
        "page":this.currentPage
      };

      let url = "/strategy/compute_media_chd";
      let _data = await this.fetchCore(url, param);
      if (_.isPlainObject(_data.page_info)) {
        
        this.total = _data.page_info.total_records - 0;
      }else{
        this.total =0
      }

      // for (let item of _data.lists) {
      //   item.number = '';
      // }
      this.tableList = this.formatList(_data.list);
      return _data;
    },
    formatList(list){
      let rs = [];
      for (let item of list) {
        let other = {
          id:item.id,
          // uv:item.uv,
          union_uv:item.union_uv,
          intersection_uv:item.intersection_uv,
          overlap_rate:item.overlap_rate
        }
        let mediaA = {
          mediaOneLevel:item.media_a_type_1_name,
          mediaTwoLevel:item.media_a_type_2_name,
          media:item.media_a_name,
          uv:item.media_a_uv,
          uv_change:item.media_a_uv_change,
          ...other
        }
        let mediaB = {
          mediaOneLevel:item.media_b_type_1_name,
          mediaTwoLevel:item.media_b_type_2_name,
          media:item.media_b_name,
          uv:item.media_b_uv,
          uv_change:item.media_b_uv_change,
          ...other
        }
        rs.push(mediaA,mediaB)
      }
      return rs;
    },
    changeMonth() {
      this.fetchList(true);
    },
    onSearch() {},
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
.vs{
      color: #999999;
    font-size: 16px;
    font-weight: bold;
    padding: 0 10px;
}
</style>
<style>
/*全局部分*/
</style>
<style lang="scss">
.media-coincide-content {
  .operate {
    height: 24px;
    i {
      cursor: pointer;
      opacity: 0.6;
      display: inline-block;
      color: white;
      width: 24px;
      height: 24px;
      // background-size:18px;
      background-repeat: no-repeat;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>