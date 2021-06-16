<template>
    <head-fold title="STEP2:选择媒体&点位">
        <div class="clearfix wrap"
            v-loading='isLoading'>
            <div class="head">
                <!-- <el-button plain >上传对应的点位信息表</el-button> -->
                <el-upload action="/api/algorithm/importformat"
                    :show-file-list="false"
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
                    :on-error='handleLeftError'
                    :before-upload='handleLeftBeforeUpload'
                    :on-success="handleLeftSuccess">
                    <el-button plain>上传对应的点位信息表</el-button>
                </el-upload>
                <el-button plain
                    @click="onDownLoad">点位信息format下载</el-button>
            </div>
            <div class="tree-wrap">
                <div class="left item">
                    <div class="thead">
                        <span>媒体&点位</span>
                        <el-input size="mini"
                            style="width:193px;vertical-align:bottom;"
                            placeholder="关键字搜索"
                            v-model="treeKeyWord">
                            <i slot="suffix"
                                class="el-input__icon el-icon-search"
                                style="cursor: pointer;"></i>
                        </el-input>
                    </div>
                    <div class="tbody">
                        <el-tree ref="LtreeRef"
                            :filter-node-method="filterNode"
                            :props="props"
                            :data="treeData"
                            node-key='key'
                            show-checkbox
                            @check-change="onChangeCheck">
                        </el-tree>
                    </div>
                </div>
                <div class="right item">
                    <div class="thead">
                        <span>已选</span>
                        <div>
                            <!-- <span>开启周期保护</span> -->
                            <el-checkbox v-model="periodProtect">开启周期保护</el-checkbox>
                        </div>
                    </div>
                    <div class="tbody">
                        <el-tree class="right-tree"
                            :props="props"
                            :data="rtreeData"
                            node-key='key'
                            default-expand-all
                            :expand-on-click-node='false'
                            @check-change="onChangeCheck">
                            <span class="custom-tree-node"
                                slot-scope="{ node, data }">
                                <span class="tree-node"
                                    :title="data.name">{{ data.name }}</span>
                                <span class="ico-box">
                                    <div class="input-box"
                                        v-if='data.children.length==0'>
                                        <el-input style="width:55px"
                                            size="mini"
                                            v-model="data.lowday"
                                            placeholder="下限">
                                        </el-input>
                                        至
                                        <el-input style="width:55px"
                                            size="mini"
                                            v-model="data.upday"
                                            placeholder="上限">
                                        </el-input>
                                    </div>
                                    <i class="iconfont icon-lock"
                                        @click="() => onLock(node, data)"
                                        v-show='data.period_safety==1'></i>
                                    <i class="iconfont icon-unlock"
                                        @click="() => onUnlock(node, data)"
                                        v-show='data.period_safety==0'></i>
                                    <i class="iconfont icon-trash"
                                        @click="() => onRemove(node, data)"></i>

                                </span>
                            </span>
                        </el-tree>
                    </div>
                </div>
            </div>
            <!-- <el-button style="margin-top:10px" @click="onStartCalculate">开始计算</el-button> -->
        </div>
    </head-fold>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import headFold from "@/views/public/head-fold";

export default {
  name: "media-point",
  components: { headFold },
  data() {
    return {
      periodProtect: false,
      isLoading: false,
      treeKeyWord: "",
      port: "", //请求树时传递参数
      props: {
        label: "name",
        children: "children"
      },
      treeData: [],
      rtreeData: []
    };
  },
  props: {
    currentPortVal: {
      type: String,
      required: true
    }
  },
  watch: {
    treeKeyWord(val) {
      this.$refs.LtreeRef.filter(val);
    },
    //端口变化
    currentPortVal(val) {
      this.port = this.currentPortVal;
      this.fetchGetTree();
    }
  },
  computed: {},
  created() {
    this.fetchGetTree();
  },
  mounted() {
    // this.init();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    onSearch(val) {
      this.$refs.LtreeRef.filter(val);
    },
    onLock(node, data) {
      data.period_safety = 0;
    },
    onUnlock(node, data) {
      data.period_safety = 1;
    },
    onRemove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.key === data.key);
      children.splice(index, 1);
      this.$refs.LtreeRef.setChecked(data.key, false, true);
    },
    // 上传失败的回调
    handleLeftError() {
      this.isLoading = false;
      this.$message.error("上传失败，请稍后重试!");
    },
    // 上传之前的回调
    handleLeftBeforeUpload() {
      this.isLoading = true;
      /* if (this.hasEditingLeft('重传')) {
        return false
      }else{
        this.isLoading = true;
        return true
      } */
    },
    // 上传成功的回调
    handleLeftSuccess(res, file) {
      this.isLoading = false;
      if (res && res.ret == 0) {
        let uploadDataArr = this.getUploadData(res.data);
        this.setRtreeByUploadData(uploadDataArr);
        //不能有&res.ret& 否则进不去
        this.$message.success("上传成功!");
        // this.fetch_table_list();
      } else {
        this.$message.error(res.msg || "上传失败，请稍后重试!");
      }
    },
    setRtreeByUploadData(arr) {
      for (let item of arr) {
        let node = this.getNodeByKey(item.key);
        // console.log('node',node)
        if (_.isPlainObject(node)) {
          node.customer_cpm = item.customer_cpm;
          node.discount = item.discount;
        }
      }
    },
    getNodeByKey(key, arr) {
      // console.log("TCL: getNodeByKey -> key,arr", key,arr)
      if (!Array.isArray(arr)) {
        arr = this.rtreeData;
      }
      // debugger
      for (let item of arr) {
        if (!item.hasOwnProperty("children") || item.children.length == 0) {
          if (item.key == key) {
            // console.log('item:',item,key)
            return item;
          }
        } else {
          let tem = this.getNodeByKey(key, item.children);
          if (tem) {
            return tem;
          }
        }
      }
    },
    getUploadData(arr) {
      let rs = [];
      for (let item of arr) {
        if (!item.hasOwnProperty("children")) {
          rs.push(item);
        } else {
          rs = rs.concat(this.getUploadData(item.children));
        }
      }
      return rs;
    },
    async onDownLoad() {
      this.isLoading = true;
      let url = await this.fetchCore("/algorithm/downloadformat", {
        data: this.rtreeData
      });
      this.isLoading = false;
      this.$downloadFile("/api/" + url);
    },
    formatTree(list, parentId) {
      // var list = _.cloneDeep(list);
      let arr = [];
      for (let i of list) {
        i.customer_cpm = 0;
        i.discount = 0;
        i.period_safety = 0; //0,1 不锁定，锁定
        // 叶子节点
        if (!i.hasOwnProperty("children") || i.children.length == 0) {
          i.lowday = "";
          i.upday = "";
        }
        let index = i.key.lastIndexOf("_");
        // let ids = i.key.split('_');
        if (parentId == "") {
          // 一级节点
          if (index == -1) {
            let tem = _.cloneDeep(i);
            delete tem.children;
            tem.children = this.formatTree(list, i.key);
            arr.push(tem);
          }
        } else {
          let pid = i.key.substr(0, index);
          if (pid == parentId) {
            let tem = _.cloneDeep(i);
            delete tem.children;
            tem.children = this.formatTree(list, i.key);
            arr.push(tem);
          }
        }
      }
      return arr;
    },

    //"3_7_6" 返回['3_7_6','3_7','3']
    getKeysByStr(keyStr) {
      let rs = [keyStr];
      let index = keyStr.lastIndexOf("_");
      if (index != -1) {
        let temKey = keyStr.substr(0, index);
        rs = rs.concat(this.getKeysByStr(temKey));
      }
      return rs;
    },
    onChangeCheck(data, selfChecked, childChecked) {
      let nodes = this.$refs.LtreeRef.getCheckedNodes(false, true);
      // let nodes2 = this.$refs.LtreeRef.getCheckedKeys(true);
      // console.log("TCL: onChangeCheck -> nodes2", nodes2)
      // console.log("TCL: onChangeCheck -> nodes", nodes)
      // this.formatTree(nodes,'');
      // this.removeChildren(nodes)
      this.rtreeData = this.formatTree(_.cloneDeep(nodes), "");
      // this.removeChildren(nodes)
      // console.log("TCL: onChangeCheck -> this.rtreeData", JSON.stringify(this.rtreeData))
      // console.log("TCL: onChangeCheck -> this.rtreeData", this.rtreeData)
    },
    // 暂时废弃
    removeChildren(arr) {
      for (let item of arr) {
        item.isLeaf = !item.hasOwnProperty("children");
        delete item.children;
      }
    },
    onSubmit() {
      return new Promise((resolve, reject) => {
        let rs = this.getData();
        if (rs.pos_list.length) {
          resolve(this.getData());
        } else {
          this.$message.error("请选择点位");
          reject();
        }
      });
    },
    getData() {
      let arr = this.getLeafData();
      let pos_list = [];
      for (let item of arr) {
        let [media_type_id, media_id] = item.key.split("_");
        let obj = {
          position: item.name,
          position_id: item.id,
          media: item.media_name,
          media_id,
          media_type: item.level_1_name,
          media_type_id,
          lowday: item.lowday,
          upday: item.upday,
          period_safety: item.period_safety,
          customer_cpm: item.customer_cpm,
          discount: item.discount,
          ports:item.ports
        };
        pos_list.push(obj);
      }
      let period_safety = this.periodProtect ? 1 : 0;
      return { pos_list, period_safety };
    },
    getLeafData(list) {
      if (!list) {
        list = this.rtreeData;
      }
      let rs = [];
      for (let item of list) {
        if (item.children.length == 0) {
          rs.push(item);
        } else {
          rs = rs.concat(this.getLeafData(item.children));
        }
      }
      return rs;
    },
    // 暂时废弃
    addUniqueId(arr) {
      // _.uniqueId('contact_');
      for (let item of arr) {
        item.key = _.uniqueId("p_");
        if (Array.isArray(item.children)) {
          this.addUniqueId(item.children);
        }
      }
    },

    async fetchGetTree() {
      let data = await this.fetchCore("/algorithm/positionlist", {
        port: this.port
      });
      this.treeData = data;
      // this.formatTree(this.treeData);
      // this.rtreeData = data;
      // console.log("TCL: fetchGetTree -> data", data)
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
<style scoped lang='scss'>
@import "../../../assets/css/theme/mixin.scss";

.wrap {
  padding: 20px 6px;
  .icon-unlock,
  .icon-lock {
    margin: 0 5px;
  }
  .icon-unlock,.icon-lock,.icon-trash{
    opacity: .5;
    &:hover{
      opacity: .8;
    }
  }
  .icon-trash{
    font-size: 16px;
    color: #fff;
  }
  .head{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .tree-wrap{
    display: flex;
    .item{
      flex: 1;
      &.left{
        border-right: 1px solid #363d47;
      }
      .thead{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background-color: #49505a;  /*（背景调换）预算分配第二步表头*/
        color: #b5b8bd;
        padding: 0 12px;
      }
      .tbody{
        background-color: #2c323e;  /*（背景调换）预算分配第二步*/
        padding: 12px;
        height: 460px;
        overflow: auto;
      }
    }
  }
}
</style>
<style lang='scss'>
.right-tree{
  .custom-tree-node{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tree-node{
      display: inline-block;
    width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
    .ico-box{
      display: flex;
      align-items: center;
      .input-box{
        .el-input--mini .el-input__inner{
          height: 18px;
          line-height: 18px;
          padding: 0 5px;
          text-align: center;
        }
      }
    }
  }
}

</style>
