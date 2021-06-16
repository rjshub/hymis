<template>
  <div v-loading.fullscreen.lock="isLoading">
    <div class="clearfix"
      style="margin:10px 0">
      <el-select v-model="levelOneAss"
        style="width:180px;"
        size="mini"
        filterable
        clearable
        @change='onChangeOneLevel'
        :placeholder="$t('lang.public_Media_primary_classification_placeholder')">
        <el-option v-for="item in levelOneAssList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="levelTwoAss"
        style="width:180px;"
        size="mini"
        filterable
        clearable
        @change='onChangeTwoLevel'
        :placeholder="$t('lang.public_Media_second_classification_placeholder')">
        <el-option v-for="item in levelTwoAssList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="media"
        style="width:180px;"
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
      <el-input size="mini"
        style="width:193px;vertical-align:bottom;"
        :placeholder="$t('lang.public_key_words')"
        v-model="keyWord"
        @keyup.enter.native="onSearch">
        <i slot="prefix"
          class="el-input__icon el-icon-search"
          @click="onSearch"
          style="cursor: pointer;"></i>
      </el-input>

       <span class="hy-down-load-icon" style="float: right;vertical-align: bottom;" :title="$t('lang.AS_detail_download_excel')" @click="onExport">
          <i class="iconfont icon-list-download"></i>
      </span>
    </div>
    <el-table :data="tableList"
      min-height="500"
      :border="table_border"
      style="width: 100%;">

      <el-table-column prop="id"
        :label="$t('lang.system_media_media_table_config.id')">
        <template slot-scope="scope">
          {{"m"+scope.row.id}}
        </template>
      </el-table-column>

      <el-table-column prop="name"
        :label="$t('lang.system_media_media_table_config.name')">
      </el-table-column>

      <el-table-column prop="pbs_media_name"
        :label="$t('lang.system_media_media_table_config.pbs_media_name')">
      </el-table-column>

      <el-table-column prop="level_1_name"
        :label="$t('lang.system_media_media_table_config.level_1_name')">
      </el-table-column>
      <el-table-column prop="level_2_name"
        :label="$t('lang.system_media_media_table_config.level_2_name')">
      </el-table-column>

      <el-table-column prop="position_id"
        :label="$t('lang.system_media_media_table_config.position_id')">
        <template slot-scope="scope">
          <el-popover popper-class='point-list-popover'
            placement="top"
            :title="$t('lang.system_media_pbs_media')"
            width="400"
            trigger="hover">
            <div class="content">
              <span style="word-break: break-all;">{{scope.row.position_id}}</span>
            </div>
            <span slot="reference" class="mis-point" @click="toPoint(scope.row)">
              {{scope.row.position_id}}
              <!-- <span class="mis-point" @click="toPoint(scope.row)">{{scope.row.position_id}}</span> -->
            </span>
          </el-popover>
          
        </template>
      </el-table-column>

      <el-table-column prop="utime"
        width="145"
        :label="$t('lang.system_media_media_table_config.utime')">
      </el-table-column>

      <el-table-column prop="status"
        width="80"
        :label="$t('lang.system_media_media_table_config.status')">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1"
            style='color:#42a996' class="hy-font-green">{{$t('lang.system_media_media_table_config.status_on')}}</span>
          <span v-else
            style='color:#ffcc00' class="hy-font-yellow">{{$t('lang.system_media_media_table_config.status_off')}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lang.system_media_media_table_config.operate')"
        v-if="ruleManage_permission==1"
        width="140"
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
  name: "media-list",
  componentName: "MediaList",
  components: {
    MediaCreateEdit
  },
  mixins: [theme],
  data() {
    return {
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
    /* agent_id(n,o){
      this.fetchList()
    }, */
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["ruleManage_permission"])
  },
  created() {
    this.$eventHub.$off("refreshMediaList");
    this.$eventHub.$on("refreshMediaList", isNew => {
      isNew?this.fetchListByNew():this.fetchList();
    });
    this.fetchList();
    this.getSelectList();
  },
  mounted() {
    // this.fetchList();
  },
  methods: {
    async onExport() {
      let res = await this.fetchCore("/mediamanage/downloadmedia");
      this.$downloadFile("api/" + res);
    },
    async getSelectList() {
      let data = await this.fetchCore("/mediamanage/selectedlist", {
        type_id_1: this.levelOneAss,
        type_id_2: this.levelTwoAss
      });
      this.mediaList = data.medias || [];
      this.levelOneAssList = data.type.one || [];
      this.levelTwoAssList = data.type.two || [];
    },
    async onChangeOneLevel() {
      await this.getSelectList();
      // levelOneAss
      this.levelTwoAss = "";
      this.media = "";
      this.fetchList(true);
    },
    async onChangeTwoLevel() {
      await this.getSelectList();
      this.media = "";
      this.fetchList(true);
    },
    onChangeMedia() {
      this.fetchList(true);
    },
    onSearch() {
      this.fetchList(true);
    },
    toPoint({type_id_1,type_id_2,id}){
      this.$router.push({
        name: "SystemPointList",
        params: { 
          level1Media: type_id_1, 
          level2Media: type_id_2, 
          media: id 
        }
      });
    },
    async fetchChangeStatus({ id, status }) {
      await this.fetchCore("/mediamanage/changestatus", { media_id: id });
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
    //
    async fetchList(isFirstPage=false) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      let param = {
        type_id_1: this.levelOneAss,
        type_id_2: this.levelTwoAss,
        id: this.media,
        word: this.keyWord,
        page: this.currentPage,
        perpage: this.pageSize
      };

      let url = "/mediamanage/lists";
      let _data = await this.fetchCore(url, param);

      this.total = _data.total - 0;
      // for (let item of _data.lists) {
      //   item.number = '';
      // }
      this.tableList = _data.lists;
      return _data;
    },
    async fetchListByNew() {
      this.levelOneAss=''
      this.levelTwoAss=''
      this.media=''
      this.keyWord=''
      this.currentPage=1
      let _data = await this.fetchList();

      this.total = _data.total - 0;
      this.currentPage = Math.ceil(this.total/this.pageSize)
      _data = await this.fetchList();
      this.total = _data.total - 0;
      this.tableList = _data.lists;
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
.mis-point {
  word-break: normal;
  &:hover {
    border-bottom: 1px solid #42a996;
    /* text-decoration:underline; */
    cursor: pointer;
    color: #42a996;
  }
}
</style>
<style lang="scss">
.point-list-popover.el-popper {
  padding: 12px;
  .content {
    overflow: auto;
    max-height: 600px;
  }
  .head {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>
