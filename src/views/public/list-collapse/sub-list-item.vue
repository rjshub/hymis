<template>
  <!-- <div class="sublist-box"> -->
  <div class="medium-item"
    :class="`${highlight?'highlight-item':''} ${table_border? className:''}`">
    <div class="serial-num"
      :title="serialIndex">{{serialIndex}}</div>

    <div class="name">
      <span class="name-text">{{name}}</span>
      <span v-if='isDraft'
        class="draft-name hy-font-yellow">{{$t('lang.public_tooltip_draft')}}</span>
    </div>

    <div class="message-area">
      <i class="brand-ico">
        <img v-if="iconUrl"
          style="height:100%;width: 30px;height: 30px;"
          :title='iconTitle'
          :src="'/api/'+iconUrl" />
        <span v-else-if="iconName"
          :title="iconTitle"
          class="dotted-box">{{iconName}}</span>
      </i>

      <div class="product-short"
        v-if="shortName">
        <span :title='shortTitle'
          class="dotted-box">{{shortName}}</span>
      </div>
      <div class="device"
        v-if="device">
        <!-- phone -->
        <span v-if="deviceArray.length==1">
          <span v-if="device==1"
            title="OTV-Phone">
            <i title='Phone'
              class="iconfont icon-iPad-portrait"></i>
          </span>
          <!-- pad -->
          <span v-else-if="device==2">
            <i title='OTV-Pad'
              class="iconfont icon-iPad-landscape"></i>
          </span>
          <!-- pc -->
          <span v-else-if="device==3">
            <i title='OTV-PC'
              class="iconfont icon-mac"></i>
          </span>

          <!-- moblie(phone+pad)  -->
          <span v-else-if="device==4">
            <i title='OTV-Moblie(Phone+Pad)'
              class="iconfont icon-iPad-portrait-landscape"></i>
          </span>
          <!-- ott  -->
          <span v-else-if="device==5">
            <i title='OTT'
              class="iconfont icon-tv"></i>
          </span>
          <!-- APP -->
          <span v-else-if=" device=='APP'">
            <i title='APP'
              class="iconfont icon-iPad-portrait"></i>
          </span>
          <!-- PC -->
          <span v-else-if=" device=='PC'">
            <i title='PC'
              class="iconfont icon-mac"></i>
          </span>
          <!-- WAP -->
          <!-- icon 要改 -->
          <span v-else-if=" device=='WAP'">
            <i title='WAP'
              class="iconfont icon-email"></i>
          </span>
        </span>
        <!-- cross screen -->
        <span v-else>
          <i :title='crossScreenTitle_c'
            class="iconfont icon-grid"></i>
        </span>
      </div>

      <div class="time">{{time}}</div>
    </div>

    <div class="operate-box">

      <i class="iconfont icon-list-Add"
        :title="addTitle"
        v-if="showAddBtn"
        @click="onAdd">
      </i>

      <i class="iconfont icon-index-detail"
        :title="$t('lang.public_tooltip_detail')"
        v-if="showDetailBtn"
        @click="onDetail"></i>

      <i class="iconfont icon-list-edit"
        :title="$t('lang.public_tooltip_edit')"
        v-if="showEditBtn"
        @click="onEdit"></i>

      <i class="iconfont icon-list-view"
        :title="$t('lang.public_tooltip_show')"
        v-if="showViewBtn"
        @click="onEdit"></i>

      <i class="iconfont icon-list-download"
        :class="{disabled:status==0}"
        :title="$t('lang.public_tooltip_download')"
        v-if="showDownloadBtn"
        @click="onDownload()"></i>

      <!-- <i class="icon-list-history"
        title="历史"
        v-if="showHistoryBtn"
        @click="onHistory"></i> -->

      <el-popover v-if="showHistoryBtn"
        placement="bottom-end"
        width="210"
        :offset='10'
        :disabled='!historyList.length'
        trigger="click">
        <div class="version-list">
          <template>
            <div class="item"
              v-for='item in historyList'
              :key='item.id'>
              <span class="version"
                :title="item.version">{{getVersionName(item)}}</span>
              <i class="iconfont icon-list-view"
                @click="onViewHis(item)"
                :title="$t('lang.public_tooltip_show')"></i>
              <i class="iconfont icon-list-download"
                @click="onDownload(item)"
                :title="$t('lang.public_tooltip_download')"></i>
            </div>
          </template>
          <!-- <div class="no-data" v-else>
            暂无数据
          </div> -->
        </div>
        <i class="iconfont icon-list-history"
          :class="{disabled:!historyList.length}"
          :title="$t('lang.public_tooltip_history')"
          slot="reference"
          @click="onHistory"></i>
      </el-popover>

      <el-popover placement="bottom-end"
        width="130"
        :offset='10'
        trigger="click">
        <div class="menu">
          <div class="item"
            :class="{disabled:isDraft}"
            @click="onArchive">
            <i class="iconfont icon-list-archives"
              :title="$t('lang.public_tooltip_archives')"></i>
            {{$t('lang.public_tooltip_archives')}}</div>
          <div class="item"
            @click="onDelete">
            <i class="iconfont icon-trash"
              :title="$t('lang.public_tooltip_delete')"></i>
            {{$t('lang.public_tooltip_delete')}}</div>
        </div>
        <i class="iconfont icon-list-more"
          :title="$t('lang.public_tooltip_more')"
          slot="reference"
          v-if="showMoreBtn"></i>
      </el-popover>
      <i class="iconfont icon-trash"
          :title="$t('lang.public_tooltip_delete')"
          v-if="showDeleteBtn"
          @click="onDelete"></i>
      <i class="iconfont icon-list-active"
        style="height: 22px;"
        :title="$t('lang.public_tooltip_activating')"
        v-if="showActiveBtn"
        @click="onActive"></i>
    </div>
  </div>

</template>

<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import theme from '@/views/mixin/theme/table-border'

export default {
  name: "sub-list-item",
  components: {
    //子组件
  },
  mixins: [theme],
  props: {
    highlight: {
      type: [Boolean],
      required: false,
      default: false
    },
    id: {
      type: [String, Number],
      required: true
    },
    serialIndex: {
      type: [String, Number],
      required: true
    },
    name: {
      type: [String],
      required: true
    },
    iconUrl: {
      type: [String, Number],
      required: false
    },
    iconTitle: {
      type: [String, Number],
      required: false
    },
    shortName: {
      //简称
      type: [String, Number],
      required: false
    },
    //logo为空得替换名称
    iconName: {
      type: [String, Number],
      required: false
    },
    dataExtend: {
      //预留扩展字段
      type: [String, Number],
      required: false
    },
    shortTitle: {
      type: [String, Number],
      required: false
    },
    device: {
      type: [Array, String],
      required: false
    },
    time: {
      type: [String],
      required: true
    },
    isDraft: {
      type: [Boolean],
      required: false
    },
    status: {
      type: [String, Number],
      required: false
    },
    addTitle: {
      type: [String],
      required: false
    },
    historyList: {
      type: [Array],
      required: false,
      default: function () {
        return []
      }
    },
    //要显示的按钮list
    visibleBtnList: {
      type: [Array],
      required: false
    },
    className: {
      type: String,
    }
  },
  data() {
    return {
      showEditInput: false, //是否显示编辑输入框
      showActiveBtn: false, //是否显示激活按钮
      showArchiveBtn: false, //是否显示归档按钮
      showViewBtn: false, //是否显示查看按钮
      showEditBtn: false, //编辑按钮
      showAddBtn: false, //添加按钮
      showHistoryBtn: false, //添加按钮
      showDeleteBtn: false, //删除按钮
      showDownloadBtn: false, //下载按钮
      showDetailBtn: false, //下载按钮
      showMoreBtn: false, //下载按钮

      isLoadingMore: false,
      isShow2: false,
      tableValues2: []
    };
  },

  computed: {
    deviceArray() {
      let result = []
      if (this.device.indexOf(',')) {
        result = this.device.split(",");
      } else (
        result = [this.device]
      )
      return result
    },
    crossScreenTitle_c() {
      //this.device长度肯定大于1
      let arr = this.device.split(",");
      let OTV_map = {
        "1": "Phone",
        "2": "Pad",
        "3": "PC",
        "4": "Mobile(Phone+Pad)"
      };
      let OTV_str = [];
      let hasOTT = false;
      let str = "";
      for (const item of arr) {
        if (item > 4) {
          hasOTT = true || hasOTT;
        } else {
          if (OTV_map[item]) {
            OTV_str.push(OTV_map[item + ""]);
          }
        }
      }
      if (OTV_str.length) {
        str = "OTV(" + OTV_str.join("+") + ")";
        if (hasOTT) {
          str = str + "+OTT";
        }
      } else {
        str = this.device
      }
      return str;
    }
  },

  // inject: ["collapse"],

  watch: {},

  created() {
    this.initBtn();
  },

  methods: {
    initBtn() {
      let btnList = this.visibleBtnList;

      this.showHistoryBtn = btnList.includes("history");
      this.showAddBtn = btnList.includes("add"); //客户管理特有
      this.showDownloadBtn = btnList.includes("download");
      this.showDetailBtn = btnList.includes("detail");
      this.showDeleteBtn = btnList.includes("delete");
      this.showEditBtn = btnList.includes("edit");
      this.showViewBtn = btnList.includes("view");
      this.showMoreBtn = btnList.includes("more");
      this.showActiveBtn = btnList.includes("active");
      this.showArchiveBtn = btnList.includes("archive");

      /* this.showHistoryBtn = !!this.$listeners.history;
      this.showAddBtn = !!this.$listeners.add;
      this.showDownloadBtn = !!this.$listeners.download;
      this.showDetailBtn = !!this.$listeners.detail;
      this.showDeleteBtn = !!this.$listeners.delete;
      this.showEditBtn = !!this.$listeners.edit;
      this.showViewBtn = !!this.$listeners.view;
      this.showMoreBtn = !!this.$listeners.more;
      this.showActiveBtn = !!this.$listeners.active; */
      // edit-confirm
      // console.log('this.$listeners',this.$listeners);
      // this.$listeners.add
    },
    getVersionName({ version, ctime }) {
      let timeStr = moment(ctime).format("YYYYMMDDHHmm");
      return "V" + version + "_" + timeStr;
    },
    formatBrand(brand) {
      let result = "";
      for (let item of brand) {
        result += `<span title=${item}>${item}</span>`;
      }
      return result;
    },
    /* onMore() {
      this.$emit("more", this.id);
    }, */
    onHistory() {
      this.$emit("history", this.id);
    },
    onAdd() {
      this.$emit("add", this.id);
      // this.$dispatch("listCollapse", "item-detail", row);
    },
    onDetail() {
      this.$emit("detail", this.id);
      // this.$dispatch("listCollapse", "item-detail", row);
    },
    onActive() {
      this.$emit("active", { id: this.id, name: this.name });
    },
    onDownload(obj) {
      if (!obj) {
        //非历史的只有状态为非草稿的才能下载
        if (this.status != 0) {
          this.$emit("download", { id: this.id, version: "0" });
        }
      } else {
        this.$emit("download", { id: this.id, version: obj.version });
      }
      // this.$dispatch("listCollapse", "item-download", row);
    },
    onViewHis({ project_id, version }) {
      this.$emit("view", { id:project_id, version,name: this.name });
    },
    onEdit() {
      let param = {
        id: this.id,
        name: this.name,
        shortName: this.shortName,
        iconUrl: this.iconUrl,
        dataExtend: this.dataExtend,
        version: "0"
      };
      this.$emit("edit", param);
      this.$emit("view", param);
      // this.$dispatch("listCollapse", "item-edit", row);
    },
    onArchive() {
      if (!this.isDraft) {
        this.$emit("archive", { id: this.id, name: this.name });
      }
    },
    onDelete() {
      this.$emit("delete", { id: this.id, name: this.name });
      // this.$dispatch("listCollapse", "item-remove", row);
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/theme/mixin.scss";

.sublist-box {
  /* margin-left: 30px; */
}

.more {
  position: relative;
  z-index: 1;
  height: 18px;
  text-align: center;
  border-top: 1px solid black;
  background-color: #434a54;   /*(背景调换)暂无此class*/
  margin-top: -1px;
  padding: 15px 0;
  .loading-more {
    display: inline-block;
    cursor: pointer;
  }
}

.medium-item {
  background-color: #434a54;   /*(背景调换)项目列表展开每一条背景*/
  display: flex;
  height: 48px;
  line-height: 48px;
  color: #fffeff;
  font-size: 14px;
  border-top: 1px solid #161c28;
  position: relative;
  &:hover {
    background-color: #265454;  /*(背景调换)项目列表展开每一条hover背景*/
  }
  &.highlight-item {
    background-color: #2a6f6f;  /*(背景调换)项目列表展开每一条highlight背景*/
  }
  .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }
  .name-text {
    max-width: calc(100% - 70px);
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .serial-num {
    padding-left: 18px;
    padding-right: 28px;
  }
}
.light-sub-list {
  background-color: #FFFEFF !important;
}
.dark-sub-list {
  background-color: #FBF8FB !important;
}

.time,
.operate-box {
  margin-right: 14px;
}
.time {
  width: 140px;
}
.device {
  padding-right: 14px;
  width: 30px;
  text-align: center;
  span {
    display: block;
  }
  i {
    width: 30px;
    display: block;
    background-repeat: no-repeat;
    background-position: center;
    height: 48px;
  }
}

.draft-name {
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.4);  /*(背景调换)项目列表草稿状态的背景*/
  border-radius: 20px;
  display: inline-block;
  width: 40px;
  text-align: center;
  height: 16px;
  line-height: 16px;
  margin-left: 5px;
  position: absolute;
  top: calc(50% - 8px);
}

.message-area {
  display: inline-flex;
  position: absolute;
  right: 238px;
}

.operate-box {
  /* display: inline-block;
  text-align: center;
  height: 48px;
  line-height: 48px;
  margin-right: 21px; */
  position: absolute;
  right: 5px;
  // height: 40px;
  height: 100%;
  i {
    margin-left: 20px;
    // margin-top: 12px;
    cursor: pointer;
    opacity: 0.6;
    display: inline-block;
    color: white;
    font-size: 24px;
    line-height: inherit;
    // width: 24px;
    // height: 24px;
    &:hover {
      opacity: 0.8;
    }
  }
}

.product-short {
  display: table;
  margin-right: 14px;
}
.dotted-box {
  width: 30px;
  height: 30px;
  border: 1px dashed #fff;
  display: inline-block;
  vertical-align: middle;
  line-height: 30px;
  text-align: center;
}
.brand-ico {
  /* width: 30px; */
  /* height: 30px; */
  margin-right: 14px;
  font-style: normal;
}

.disabled {
  opacity: 0.2 !important;
  cursor: not-allowed !important;
}

.menu .item,
.version-list .item {
  height: 40px;
  line-height: 40px;
  background-color: #2c333e;   /*(背景调换)项目列表操作列弹出框背景*/
  padding-left: 12px;
  color: #fefffd;
  opacity: 0.6;
  i {
    display: inline-block;
    // width: 24px;
    // height: 24px;
    font-size: 24px;
    vertical-align: middle;
  }
  &:hover {
    background-color: #42a996;   /*(背景调换)项目列表操作列弹出框动态背景*/
    opacity: 1;
    cursor: pointer;
  }
}
.version-list {
  max-height: 204px;
  overflow-y: auto;
  .no-data {
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: #fefffd;
    opacity: 0.6;
  }
  .item {
    border-bottom: 1px solid #151b27;
    overflow: hidden;

    &:last-child {
      border-bottom: 0px;
    }
    &:hover {
      cursor: default;
      i {
        cursor: pointer;
      }
    }
    .version {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 116px;
    }
    i {
      vertical-align: 8px;
      &.icon-list-view {
        margin: 0 8px;
      }
    }
  }
}
::-webkit-scrollbar {
  width: 2px;
}
</style>
