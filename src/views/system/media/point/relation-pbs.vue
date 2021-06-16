<template>
  <div class="media-relation-pbs">
    <div class="item left">
      <div class="head">
        <el-select v-model="selectVal"
          style="width: 220px;
            margin-top: 7px;"
          size="mini"
          filterable
          @change="onChange"
          :placeholder="$t('lang.reg_select_pbs_name_placeholder')">
          <el-option v-for="item in renderSelectList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="padding-right: 25px;">{{ item.id }}</span>
            <span>{{ item.name }}</span>
          </el-option>
        </el-select>

        <el-input style="width: 220px;
          margin-top: 7px;"
          :placeholder="$t('lang.public_position_name_placeholder')"
          @keyup.native.enter='onSearch'
          v-model="searchVal">
          <i slot="suffix"
            style="cursor: pointer;"
            class="el-input__icon el-icon-search"
            @click="onSearch"></i>
        </el-input>

        <el-checkbox :indeterminate="isIndeterminate"
          v-show="renderLeftList.length"
          v-model="checkedAll"
          style="float: right;
            margin-top: 6px;"
          @change="onChangeAll">{{$t('lang.public_checkAll')}}</el-checkbox>
      </div>
      <div class="body"
        :class="{'no-data':!renderLeftList.length}">
        <div class="list-item"
          v-for="item in renderLeftList"
          :key="item.id">
          <el-checkbox :value="item.checked"
            :disabled='item.enabled'
            @change="onChangeSingle(item)">
            <span style="padding-left:5px"
              :title="item.name"
              class='name'>{{ item.name }}</span>
          </el-checkbox>
        </div>
        <div v-show="!renderLeftList.length">{{$t('lang.public_empty_list_text')}}</div>
      </div>
    </div>
    <div class="item right">
      <!-- {{renderRightList}} -->
      <div class="head">
        <span class="checked">{{$t('lang.public_selected')}}</span>
        <span class="clear"
          @click="onClear"
          v-show="renderRightList.length">{{$t('lang.public_handle_empty')}}</span>
      </div>
      <div class="body"
        :class="{'no-data':!renderRightList.length}">
        <div class="list-item"
          v-for="item in renderRightList"
          :key="item.id">
          <span :title="item.name"
            class='name'>{{ item.name }}</span>
          <i class="iconfont icon-trash"
            style="float: right;
          font-size: 16px;cursor: pointer;"
            @click="onRemove(item.id)"></i>
        </div>
        <div v-show="!renderRightList.length">{{$t('lang.public_empty_list_text')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  name: "media-relation-pbs",
  props: {
    list: {
      type: Array,
      required: true
    },
    rightCheckedData: {
      type: [Object, String],
      required: false
    }
  },
  data() {
    return {
      filterVal: "",
      searchVal: "", //搜索值
      selectVal: "", //下拉值
      isIndeterminate: false,
      checkedAll: false,
      cache: {},
      // leftList: [],
      // rightList: [],
      pageStatus: "BeforeCreated" // 'Created'  'AfterCreated'
    };
  },
  watch: {
    list: {
      handler: function(val, oldVal) {
        // console.log('created--list--',this.pageStatus)
        this.clearLastData();
        // this.setSelectList(val);
        this.initCache(val);
        this.setDefaultActiveSelect();
        // this.setRightList();
        if (this.pageStatus == "Created") {
          this.pageStatus = "AfterCreated";
        }
      },
      deep: true,
      immediate: false
    },
    renderRightList: {
      handler: function(val, oldVal) {
        this.$dispatch("PointCreateEdit", "relation-change");
      },
      deep: true
    },
    renderLeftList: {
      handler: function(val, oldVal) {
        this.setSelectAllBtn();
      },
      deep: true
    }
  },
  computed: {
    isEdit() {
      return _.isPlainObject(this.rightCheckedData);
    },
    renderRightList() {
      let rs = [];
      let keys = Object.keys(this.cache);
      for (const key of keys) {
        let tem = this.cache[key].filter(k => k.checked == true);
        rs = rs.concat(tem);
      }
      return rs;
    },
    getRightListIds() {
      let rs = [];
      for (const item of this.renderRightList) {
        rs.push(item.id);
      }
      return rs;
    },
    getLeftListIds() {
      let rs = [];
      for (const item of this.renderLeftList) {
        rs.push(item.id);
      }
      return rs;
    },
    renderLeftList: {
      get: function() {
        let rs = [];
        let list = this.cache[this.selectVal];
        if (Array.isArray(list)) {
          if (this.filterVal) {
            rs = list.filter(i => i.name.indexOf(this.filterVal) != -1);
          } else {
            rs = list;
          }
        }
        return rs;
      },
      set: function({ id, checked }) {
        let cache = _.cloneDeep(this.cache);
        let tem = cache[this.selectVal].find(i => i.id == id);
        tem.checked = !checked;
        this.cache = cache;
      }
    },
    renderSelectList() {
      let slist = [];
      for (let item of this.list) {
        let index = slist.findIndex(i => i.id == item.pbs_media_id);
        if (index == -1) {
          slist.push({
            id: item.pbs_media_id + "",
            name: item.pbs_media_name
          });
        }
      }
      return slist;
    }
  },
  created() {
    this.pageStatus = "Created";
    // this.isFirstEnter = true;
    // console.log('created----',this.pageStatus)
  },
  mounted() {
    // this.init();
  },
  methods: {
    /* filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }, */
    onSearch() {
      // console.log('onSearch')
      this.filterVal = this.searchVal;
    },

    // 设置下拉列表默认勾选
    setDefaultActiveSelect() {
      if (this.renderSelectList.length) {
        let id = this.renderSelectList[0]["id"];
        // console.log('id=',id)
        if (this.isEdit && this.pageStatus == "Created") {
          let keys = Object.keys(this.rightCheckedData);
          if (keys[0]) {
            id = keys[0] + "";
          }
        }
        this.selectVal = id;
      }
    },
    //清除上次的数据
    clearLastData() {
      this.selectVal = "";
      this.filterVal = "";
      // this.selectList = [];
      // this.leftList = [];
      // this.rightList = [];
      // this.cache = {};
      // this.setSelectAllBtn();
    },
    // 设置左侧的全选按钮状态
    setSelectAllBtn() {
      let len = 0;
      let checkedLen = 0;
      for (let item of this.renderLeftList) {
        if (item.checked) {
          checkedLen += 1;
        }
        if (!item.enabled) {
          len += 1;
        }
      }
      if (checkedLen == len) {
        this.isIndeterminate = false;
        this.checkedAll = true;
      } else if (checkedLen == 0) {
        this.isIndeterminate = false;
        this.checkedAll = false;
      } else {
        this.isIndeterminate = true;
        this.checkedAll = false;
      }
    },

    // 设置缓存数据
    initCache(arr) {
      let cache = {};
      for (let item of arr) {
        let pbsMediaId = item.pbs_media_id + "";
        let obj = {
          checked: false,
          isShow: true,
          enabled:item.enabled,
          id: pbsMediaId + "_" + item.pbs_pos_id,
          name: item.pbs_pos_id + "_" + item.pbs_pos_name
        };
        if (!cache[pbsMediaId]) {
          cache[item.pbs_media_id] = [];
        }
        cache[pbsMediaId].push(obj);
      }
      this.cache = cache;
      this.initEditCache();
      return cache;
    },
    initEditCache() {
      // 仅仅只在编辑状态，且是第一次进来的时候
      if (this.isEdit && this.pageStatus == "Created") {
        let arr = [];
        let keys = Object.keys(this.rightCheckedData);
        for (let _key of keys) {
          let key = _key + "";
          let pos_ids = this.rightCheckedData[key];
          for (let id of pos_ids) {
            let _id = key + "_" + id;
            arr.push(_id);
          }
        }
        this.checkCore(arr, true);
      }
    },
    // 右侧的清空按钮
    onClear() {
      this.$confirm(this.$t('lang.system_media_point_clear_related_PBS_ID'), this.$t('lang.public_dialog_warning'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(() => {
          this.checkCore(this.getRightListIds, false);
        })
        .catch(() => {});
    },
    // 右侧单独的删除按钮
    onRemove(id) {
      this.checkCore([id], false);
    },
    checkCore(ids, isChecked) {
      let cache = _.cloneDeep(this.cache);
      for (let id of ids) {
        let keys = Object.keys(cache);
        for (const key of keys) {
          let obj = cache[key].find(k => k.id == id);
          /* if(obj){
              console.log('obj.enabled=',obj.enabled)
          } */
          
          if (obj&&!obj.enabled) {
            obj.checked = isChecked;
          }
        }
      }
      this.cache = cache;
    },
    // 点击全选按钮
    onChangeAll(val) {
      this.isIndeterminate = false;
      this.checkCore(this.getLeftListIds, val);
    },
    onChangeSingle(obj) {
      this.renderLeftList = obj;
    },
    //下拉列表的change事件
    onChange(val) {
      this.filterVal = "";
      this.searchVal = "";
      return;
      // this.leftList = this.cache[val];
      // this.setSelectAllBtn();
    },
    getPosName(nameStr) {
      let index = nameStr.indexOf("_");
      let name = "";
      if (index != -1) {
        name = nameStr.substr(index + 1);
      }
      return name;
    },
    //供父组件使用，例如this.$refs.refRelationPbs
    getData() {
      let relationPbs = [];
      let pos_name = [];
      for (let item of this.renderRightList) {
        relationPbs.push(item.id);
        pos_name.push(this.getPosName(item.name));
      }
      pos_name = _.uniq(pos_name);
      return [relationPbs, pos_name];
    }
  }
};
</script>
<style scoped lang="scss">
.media-relation-pbs {
  height: 100%;
  display: flex;
  // width: 1078px;
  width: 100%;
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    &:first-child {
      border-right: 1px solid #151b27;
    }
    &.right {
      .head {
        line-height: 42px;
        font-size: 12px;
      }
      .clear {
        float: right;
        text-decoration: underline;
        color: #2d9c96;
        cursor: pointer;
      }
    }
    .head {
      background-color: #49505a;   /*背景调换，系统管理->媒体管理->新增点位->关于PBS->头部背景*/
      height: 42px;
      padding: 0 12px;
    }
    .body {
      background-color: #2c333e;   /*背景调换，系统管理->媒体管理->新增点位->关于PBS->body背景*/
      flex: 1;
      overflow-y: auto;
      &.no-data {
        justify-content: center;
        display: flex;
        align-items: center;
      }
      // padding: 5px 0px;
      .list-item {
        padding: 0 12px;
        height: 28px;
        &:hover {
          background: #4a4e53;   /*背景调换，系统管理->媒体管理->新增点位->关于PBS->body条目hover背景*/
        }
        span.name {
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          width: 480px;
          vertical-align: bottom;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.media-relation-pbs{
  .el-checkbox__input.is-disabled+span.el-checkbox__label{
    color: #9FBFBD;
  }
}

</style>
