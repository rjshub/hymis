<template>
  <div v-loading='isLoading'>
    <!--<span ref="textWidthRef" style="position: absolute;top:-9999px;left:-9999px">{{textStr}}</span> -->
    <div class="head">
      <!-- 两个下拉过滤 start -->
      <el-select v-model="market"
          class="select"
          style=" margin-right: 6px;"
          size="mini"
          filterable
          @change="refresh"
          placeholder="Market">
        <el-option key=""
            :label="$t('lang.AS_detail_basic_data_market_label')"
            value="">
        </el-option>
        <el-option v-for="item in marketList "
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>

    </div>

    <el-table :data="tableData"
        height="calc(100% - 48px)"
        :row-class-name='setRowClass'
        style="background-color: #141C29;">
      <el-table-column :prop="key"
          v-for="(key,i) in data.title"
          v-if="showMediaCpm(key)"
          :fixed='i==0'
          :key="key"
          :width="getWidth(key)"
          :class-name='setColumnClass(key)'
          :label="getLabel(key)"
          :render-header='renderHeader'>
        <template slot-scope="scope">
          <!-- 最后一行字体放大2px -->
          <span v-if="scope.$index==tableData.length-1" style="">
            {{scope.row[key]}}
          </span>
          <template v-else>
            <span :style="setFontSize(key,scope)">
              <span v-if="key.toUpperCase().includes('CPM')">
                {{$formatNumber(scope.row[key],0,'')}}
              </span>
              <span v-else-if="key.toUpperCase().includes('COST')">
                {{$formatNumber(scope.row[key],4,'')}}
              </span>
              <span v-else>
                {{scope.row[key]}}
              </span>
            </span>
          </template>

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import math from "mathjs";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  // 不能使用这个name属性,不然局部的名字就无效了，因为使用了keep-alive
  // name: "component-compute-page",
  components: {},
  props: {
    data: {
      type: [Object],
      required: true
    }
  },
  data() {
    return {
      market: "",
      textStr: "",
      // marketList: [],
      // tableData: [],
      isLoading: false
    };
  },
  computed: {
    ...mapState("project", ["projectID"]),
    ...mapGetters("permissions", ["enableMediaCpm"]),
    
    tableData() {
      if (this.data.detail) {
        let table = _.cloneDeep(this.data.detail);

        if (this.market) {
          return table.filter(i => i.market == this.market);
        } else {
          //添加权重行
          let item = _.cloneDeep(table[0]);
          let keys = Object.keys(item);
          for (let key of keys) {
            item[key] = "";
          }
          let totalKey = this.getTotalKey();
          // item[totalKey] = "比重%";
          item[totalKey] = `${this.$t('lang.AS_detail_proportion')} %`;
          this.toPercentage(this.data.weight);
          Object.assign(item, this.data.weight);
          table.push(item);

          return table;
        }
      } else {
        return [];
      }
    },
    marketList() {
      if (this.data.detail) {
        let obj = {};
        for (const item of this.data.detail) {
          if (item.market != this.$t('lang.AS_detail_proportion').toLowerCase() && item.market != "") {
            obj[item.market] = true;
          }
        }
        return Object.keys(obj);
      } else {
        return [];
      }
    }
  },
  watch: {},
  activated() {},
  created() {
    // this.update_project_id("2");
    // this.setMarketList();
    // this.fetchList();
    // console.log('created',this.type)
  },
  mounted() {
    // this.getWidth('wwwsd s ms我发的 KKK《《《《《《 ')
  },
  methods: {
    ...mapActions("project", ["update_project_id"]),
    setFontSize(key,scope){
      let size = 12;
      let bigger= [`${this.$t('lang.AS_detail_media')} Total Cost`,`${this.$t('lang.AS_detail_client')} Total Cost`,'Total Media CPM'];
      if (scope.$index==this.tableData.length-2) {
        size = 14;
      }else 
      if (bigger.indexOf(key)!=-1) {
        size = 14;
      }else if (key.toUpperCase().includes('COST')) {
        size = 13;
      }
      return {
        fontSize: size+'px'
      }
    },
    setRowClass({row, rowIndex}){
      let len = this.tableData.length;
      if (rowIndex==len-1||rowIndex==len-2) {
        return 'row-black'
      }
    },
    setColumnClass(key){
      //console.log('key:',key)
      let list = ['real_reach','real_cpm','Total Media CPM',`${this.$t('lang.AS_detail_client')} Total Cost`,`${this.$t('lang.AS_detail_media')} Total Cost`];
      return list.indexOf(key)!==-1?'column-black':'';
    },
    showMediaCpm(key){
      if (this.enableMediaCpm) {
        // console.log('key1')
        return true;
      }else{
        // console.log('key2',!key.includes('媒体版 '))
        return !key.includes(`${this.$t('lang.AS_detail_media')} `);
      }
    },
    toPercentage(obj) {
      let keys = Object.keys(obj);
      for (const key of keys) {
        // obj[key] = math.eval(obj[key] + "*100") - 0 + "%";
        obj[key] = math.eval(obj[key] + "*100") - 0;
        obj[key] = this.$formatNumber(obj[key],2,'');
      }
      // return math.eval(num + "*100") - 0 + "%";
    },
    renderHeader(h, { column, $index }) {
      // console.log(column.label)
      let label = this.getLabel(column.label);
      // console.log('label=',label)
      // return label;
      if (label == "GAP") {
        return h(
          "span",
          {
            class: "yellow",
            attrs: {
              title: this.$t('lang.AS_detail_component_table_config.GAP_title')
            }
          },

          ["GAP"]
        );
      } else {
        return label;
      }
    },
    getLabel(key) {
      let keyMap = {
        reach_goal: this.$t('lang.AS_detail_component_table_config.reach_goal'),
        real_reach: this.$t('lang.AS_detail_component_table_config.real_reach'),
        goal_cpm: this.$t('lang.AS_detail_component_table_config.goal_cpm'),
        real_cpm: this.$t('lang.AS_detail_component_table_config.real_cpm'),
        cpm_differ: this.$t('lang.AS_detail_component_table_config.cpm_differ'),
      };
      return keyMap[key] ? keyMap[key] : key;
    },
    getTotalKey() {
      let arr = this.data.title;
      let totalKey = "";
      for (let index = 0; index < arr.length; index++) {
        const key = arr[index];
        if (this.data.weight[key]) {
          totalKey = arr[index - 1];
          break;
        }
      }
      return totalKey;
    },
    getWidth(key) {
      let rs = ['客户版 爱奇艺&PPS Cost','媒体版 爱奇艺&PPS Cost'];
      if (rs.indexOf(key)!=-1) {
        return "160px";
      }else{
        return "140px";
      }

      
      /* let l = key.length;
      let f = 13; //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      let w = f * l + 10;
      return w + "px"; */
    },

    refresh() {},
    onClickSelect() {
      if (this.writable) {
        this.$message.error(this.$t('lang.AS_detail_component_compute_cannot_to_filter'));
      }
    },

    async fetchList() {
      let version = this.curVersion;
      let res = await this.fetchCore(this.listUrl, { project_id: this.projectID,version });
      let data = res.data.data;
      let cost_percent = res.data.cost_percent;
      this.setTableData({ cost_percent, data });
      // this.tableData = data.data.data;
      // this.costTableData = data.data.cost_percent;
      // this.costTableData = _.concat(data.data.cost_percent, data.data.cost_percent, data.data.cost_percent);
      this.setForm();
      this.setRules(this.rules, this.tableData);
      this.setCostForm();
      this.setRules(this.costRules, this.costTableData);
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
<style scoped>
.head {
  padding: 10px;
}
</style>
<style>
.component-table .yellow {
  color: #ffcc00;
}
.component-table .column-black {
  background: #333333
}
.component-table .row-black {
  background: #2C333F
}

</style>