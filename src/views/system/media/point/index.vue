<template>
  <div v-loading.fullscreen.lock="isLoading"
    class="point-list-wrap">
    <div class="clearfix"
      style="margin:10px 0">
      <el-select v-model="levelOneAss"
        style="width:155px;"
        size="mini"
        filterable
        clearable
        @change='onChangeOneLevel()'
        :title="$t('lang.public_Media_primary_classification_placeholder')"
        :placeholder="$t('lang.public_Media_primary_classification_placeholder')">
        <el-option v-for="item in levelOneAssList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="levelTwoAss"
        style="width:155px;"
        size="mini"
        filterable
        clearable
        @change='onChangeTwoLevel()'
        :title="$t('lang.public_Media_second_classification_placeholder')"
        :placeholder="$t('lang.public_Media_second_classification_placeholder')">
        <el-option v-for="item in levelTwoAssList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="media"
        style="width:135px;"
        size="mini"
        filterable
        clearable
        @change='onChangeMedia'
        :placeholder="$t('lang.public_media_label')">
        <el-option v-for="item in mediaList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="port"
        style="width:135px;"
        size="mini"
        filterable
        clearable
        @change='onChangePort'
        :placeholder="$t('lang.public_port_label')">
        <el-option v-for="item in portList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="bidPriceType"
        style="width:140px;"
        size="mini"
        filterable
        clearable
        @change='onChangeBidPriceType'
        :placeholder="$t('lang.public_Bid_type_label')">
        <el-option v-for="item in bidPriceList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="algorithmSupport"
        style="width:140px;"
        size="mini"
        filterable
        clearable
        @change='onChangeAlgorithmSupport'
        :placeholder="$t('lang.public_algorithmSupport_placeholder')">
        <el-option v-for="item in algorithmSupportList"
          :key="item.val"
          :label="item.name"
          :value="item.val">
        </el-option>
      </el-select>
      <el-input size="mini"
        style="width:167px;vertical-align:bottom;"
        :placeholder="$t('lang.public_key_words')"
        v-model="keyWord"
        @keyup.enter.native="onSearch">
        <i slot="prefix"
          class="el-input__icon el-icon-search"
          @click="onSearch"
          style="cursor: pointer;"></i>
      </el-input>
      <!-- <el-button plain style="float: right;"
        @click="onExport">导出</el-button> -->
      <span class="hy-down-load-icon" style="vertical-align: bottom;" :title="$t('lang.AS_detail_download_excel')" @click="onExport">
            <i class="iconfont icon-list-download"></i>
      </span>
    </div>
    <el-table :data="tableList"
      min-height="500"
      :border="table_border"
      style="width: 100%;">

      <el-table-column prop="id"
      width="100"
        :label="$t('lang.system_media_point_table_config.id')">
        <template slot-scope="scope">
          {{"d"+scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column prop="pos_name"
      width="110"
        :label="$t('lang.system_media_point_table_config.pos_name')">
        <template slot-scope="scope">
          <i class="iconfont icon-calculator" style="margin-right: 5px;vertical-align: text-top;font-size:12px;line-height:14px" v-if="scope.row.type==1"></i>
          {{scope.row.pos_name}}
        </template>
        <!-- icon-calculator -->
      </el-table-column>
      <el-table-column prop="media_name" width="110"
        :label="$t('lang.system_media_point_table_config.media_name')">
      </el-table-column>
      <el-table-column prop="level_1_name" width="110"
        :label="$t('lang.system_media_point_table_config.level_1_name')">
      </el-table-column>
      <el-table-column prop="level_2_name" width="110"
        :label="$t('lang.system_media_point_table_config.level_2_name')">
      </el-table-column>
      <el-table-column prop="pbs_media_names"
        :label="$t('lang.system_media_point_table_config.pbs_media_names')">
      </el-table-column>
      <el-table-column prop="pbs_pos_id" width="110"
        :label="$t('lang.system_media_point_table_config.pbs_pos_id')">
        <template slot-scope="scope">
          <el-popover popper-class='point-list-popover'
            placement="top"
            :title="$t('lang.system_media_point_table_config.pbs_pos_id')"
            width="400"
            trigger="hover">
            <div class="content">
              <div v-for="(value, key) in JSON.parse(scope.row.pbs_pos_id)"
                :key="key">
                <div>{{key}}{{$t('lang.system_media_point_corresponding_ID')}}</div>
                <div>{{value.join(',')}}</div>
              </div>
            </div>
            <div slot="reference">
              <div class="head">{{scope.row.pbs_pos_id}}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="pbs_pos_name"
        :label="$t('lang.system_media_point_table_config.pbs_pos_name')">
        <template slot-scope="scope">
          <el-popover popper-class='point-list-popover'
            placement="top"
            :title="$t('lang.system_media_point_table_config.pbs_pos_name')"
            width="500"
            trigger="hover">
            <div class="content" v-text="scope.row.pbs_pos_name">
            </div>
            <div slot="reference">
              <div class="head">{{scope.row.pbs_pos_name}}</div>
            </div>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column prop="mr" width="110"
        :label="$t('lang.system_media_point_table_config.mr')">
        <template slot-scope="scope">
          <el-popover popper-class='point-list-popover'
            placement="top"
            :title="$t('lang.system_media_point_table_config.mr')"
            width="500"
            trigger="hover">
            <div class="content" v-text="scope.row.mr">
            </div>
            <div slot="reference">
              <div class="head">{{scope.row.mr}}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="ports"
        width="60"
        :label="$t('lang.system_media_point_table_config.ports')">
      </el-table-column>
      <el-table-column prop="bid_type"
        :label="$t('lang.system_media_point_table_config.bid_type')">
      </el-table-column>
       <el-table-column prop="rate"
        :label="$t('lang.system_media_point_table_config.rate')">
      </el-table-column>
       <el-table-column prop="selling_unit"
        :label="$t('lang.system_media_point_table_config.selling_unit')">
      </el-table-column>

      <el-table-column prop="utime"
        width="120"
        :label="$t('lang.system_media_point_table_config.utime')">
      </el-table-column>

      <el-table-column prop="status"
        width="50"
        :label="$t('lang.system_media_point_table_config.status')">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1"
            style='color:#42a996' class="hy-font-green">{{$t('lang.public_tooltip_on')}}</span>
          <span v-else
            style='color:#ffcc00' class="hy-font-yellow">{{$t('lang.public_tooltip_off')}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lang.system_media_point_table_config.operate')"
        width="84"
        fixed="right"
        v-if="ruleManage_permission==1"
        class-name="operate">
        <template slot-scope="scope">
          <i class="iconfont icon-qidong"
            v-if="scope.row.status==0"
            @click="fetchChangeStatus(scope.row)"
            :title="$t('lang.public_tooltip_on')"></i>
          <i class="iconfont icon-tingzhi"
            v-if="scope.row.status==1"
            @click="fetchChangeStatus(scope.row)"
            :title="$t('lang.public_tooltip_off')"></i>
          <i class="iconfont icon-list-edit"
            @click="onEdit(scope.row)"
            :title="$t('lang.public_tooltip_edit')"></i>
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
    <media-create-edit v-if="isShowEditDialog"
      :isShow.sync="isShowEditDialog"
      :id='editId' />
  </div>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";
import fetch from "@/services/fetch";
import MediaCreateEdit from "./create-edit";
import theme from '@/views/mixin/theme/table-border';
// import CityEdit from "./create-edit";

export default {
  name: "point-list",
  componentName: "PointList",
  components: {
    MediaCreateEdit
  },
  mixins: [theme],
  data() {
    return {
      algorithmSupport:'',//算法支持
      algorithmSupportList:[{name: this.$t('lang.public_support'),val:'1'},{name: this.$t('lang.public_not_support'),val:'0'},{name: this.$t('lang.public_all'),val:''}],
      port:'',
      portList:[],
      bidPriceType:'',
      bidPriceList:[],
      editId: "",
      isShowEditDialog: false,
      levelOneAss: "",
      levelOneAssList: [],
      levelTwoAss: "",
      levelTwoAssList: [],
      media: "",
      mediaList: [],
      isLoading: false,
      total: 10, //总页数
      pageSize: 20, //每页几条数据
      currentPage: 1, //当前页面
      tableList: [],
      keyWord: ""
    };
  },
  watch: {
    /* agent_id(n, o) {
      this.fetchList();
    } */
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["ruleManage_permission"])
  },
  async created() {
    this.$eventHub.$off("refreshPointList");
    this.$eventHub.$on("refreshPointList", isNew => {
      isNew?this.fetchListByNew():this.fetchList();
    });
    let param = this.$route.params;
    if(param.level1Media){
      this.initByRouteParams(param);
    }else{
      this.fetchList();
      this.getSelectList();
    }
  },
  
  mounted() {
    // this.fetchList();
  },
  methods: {
    async initByRouteParams({level1Media,level2Media,media}){
        this.levelOneAss=level1Media;
        await this.onChangeOneLevel(false)
        this.levelTwoAss=level2Media;
        await this.onChangeTwoLevel(false)
        this.media=media;
        await this.onChangeMedia()
    },
    async onExport(){
      let res = await this.fetchCore('/position/downloadposition');
      this.$downloadFile('api/'+res);
    },
    async getSelectList() {
      let data = await this.fetchCore("/mediamanage/selectedlist", {
        type_id_1: this.levelOneAss,
        type_id_2: this.levelTwoAss
      });
      this.mediaList = data.medias || [];
      this.levelOneAssList = data.type.one || [];
      this.levelTwoAssList = data.type.two || [];
      this.portList = data.ports;
      this.bidPriceList = data.bid_types;
    },
    onChangePort(){
       this.fetchList(true);
    },
    onChangeBidPriceType(){
       this.fetchList(true);
    },
    onChangeAlgorithmSupport(){
       this.fetchList(true);
    },
    async onChangeOneLevel(getList=true) {
      
      await this.getSelectList();
      // levelOneAss
      this.levelTwoAss = "";
      this.media = "";
      if(getList){
        await this.fetchList(true);
      }
      
    },
    async onChangeTwoLevel(getList=true) {
      await this.getSelectList();
      this.media = "";
      if(getList){
        await this.fetchList(true);
      }
    },
    onChangeMedia() {
      this.fetchList(true);
    },
    onSearch() {
      this.fetchList(true);
    },
    async fetchChangeStatus({ id, status }) {
      await this.fetchCore("/position/changestatus", { position_id: id });
      this.updataStatus(id, status);
    },
    updataStatus(id, status) {
      let obj = this.tableList.find(i => i.id == id);
      obj.status = status == "1" ? "0" : "1";
    },
    onEdit({ id, name, name_en }) {
      this.editId = id;
      this.isShowEditDialog = true;
    },
    onSizeChange(val) {
     
      this.pageSize = val;
      this.fetchList(true);
    },
    onCurrentChange(val) {
      this.currentPage = val;
      this.fetchList();
    },
    async fetchListByNew(){
      this.levelOneAss=''
      this.levelTwoAss=''
      this.media=''
      this.keyWord=''
      this.port=''
      this.bidPriceType=''
      this.bidPriceType=''
      this.algorithmSupport = ''
      this.currentPage=1
      let _data = await this.fetchList();

      this.total = _data.total - 0;
      // console.log(this.total,this.pageSize)
      this.currentPage = Math.ceil(this.total/this.pageSize)
      _data = await this.fetchList();
      this.total = _data.total - 0;
      this.tableList = _data.list;
    },
    async fetchList(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1;
      }
      let param = {
        type_id_1: this.levelOneAss,
        type_id_2: this.levelTwoAss,
        media_id: this.media,
        word: this.keyWord,
        port: this.port, //
        bid_type: this.bidPriceType, //
        page: this.currentPage,
        perpage: this.pageSize,
        type:this.algorithmSupport
      };
      let url = "/position/lists";
      let _data = await this.fetchCore(url, param);
      // console.log('--mayue',_data.list)
      this.total = _data.total - 0;
      this.tableList = _data.list;
      return _data
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
<style lang="scss" scoped>
</style>
<style>
.point-list-wrap .el-table .cell,
.point-list-wrap .el-table th div {
  padding-right: 0;
  padding-left: 0;
  /* white-space: nowrap; */
}
.point-list-wrap .el-table tr th:first-child .cell,
.point-list-wrap tr.el-table__row td:first-child .cell {
  padding-left: 5px;
}
.point-list-wrap .el-table .cell .head {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.point-list-popover.el-popper {
  padding: 12px;
}
.point-list-popover.el-popper .content {
  overflow: auto;
  max-height: 600px;
  white-space: pre-line;
  white-space: pre;
}
.point-list-popover.el-popper .head {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
