<template>
  <head-fold title="STEP3:预算分配结果">
    <div class="clearfix allocate-result">
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

        <el-select v-model="point"
          style="width:130px;margin-left:5px"
          size="mini"
          filterable
          clearable
          @change='onChangePoint'
          placeholder="请选择点位">
          <!-- <el-option key="0"
            label="全部点位"
            value=""></el-option> -->
          <el-option v-for="item in slist.positionlist"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div style="margin-top: 20px;">
        <el-table :data="renderList"
        max-height="200"
        :row-class-name='setRowClass'
        :border='true'
        style="width: 100%;background-color: #434954;">
        <!-- （背景调换）预算分配第三步表头 -->

        <el-table-column prop="media_type"
          label="媒体类型">
        </el-table-column>
        <el-table-column prop="media"
          label="媒体">
        </el-table-column>
        <el-table-column prop="position"
          label="点位">
        </el-table-column>
        <el-table-column prop="uv"
          label="预估覆盖">
          <template slot-scope="scope">
             {{$formatNumber(scope.row.uv,0,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="ta"
          v-if="isShowTA"
          label="TA%">
          <template slot-scope="scope">
             {{$formatNumber(scope.row.ta,2,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="win"
          label="预估曝光">
          <template slot-scope="scope">
             {{$formatNumber(scope.row.win,0,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="price"
          label="分配预算">
          <template slot-scope="scope">
            <!-- {{scope.row.price}} -->
             {{$formatNumber(scope.row.price,2,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="days"
          label="购买天数">
          <template slot-scope="scope">
            <span v-if="scope.row.days == '-'">
              {{scope.row.days}}
            </span>
            <span v-else>
               {{$formatNumber(scope.row.days,0,'')}}
            </span>  
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
  name: "allocate-result",
  components: { headFold },
  props: {
    list: {
      type: Array,
      required: true
    },
    total: {
      type: Object,
      required: true
    },
    selectList: {
      type: Object,
      required: true
    },
    isShowTA: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      slist: {},
      mediaType: "",
      // mediaTypeList:[],
      media: "",
      // mediaList:[],
      point: ""
      // pointList:[],
    };
  },
  watch: {},
  computed: {
    renderList(){
      let arr = _.cloneDeep(this.list);
      if (this.mediaType==''&&this.media==''&&this.point=='') {
        let obj = {
          media_type: "total",
          media: this.total.media_lens,
          position: this.total.site_lens,
          uv: this.total.total_equipment,
          ta: this.total.total_ta,
          price: this.total.total_price,
          days: this.total.total_days,
          win: this.total.total_win
        };
        arr.push(obj);
      } else {
        if (this.mediaType) {
          arr = arr.filter(i => i.media_type_id == this.mediaType);
        }
        if (this.media) {
          arr = arr.filter(i => i.media_id == this.media);
        }
        if (this.point) {
          arr = arr.filter(i => i.position_id == this.point);
        }
      }
      return arr;
    }
  },
  created() {
    this.slist = this.selectList;
  },
  mounted() {},
  methods: {
    setRowClass({ row, rowIndex }) {
      let len = this.renderList.length;
      if (
        rowIndex == len - 1 &&
        (this.mediaType == "" && this.media == "" && this.point == "")
      ) {
        return "row-last";
      }
    },
    onChangeMediaType() {
      // this.sendEvent()
    },
    onChangeMedia() {
      // this.sendEvent()
    },
    onChangePoint() {
      // this.sendEvent()
    },
    sendEvent() {
      this.$eventHub.$emit("ALLOCATE-RESULT", {
        mediaType: this.mediaType,
        media: this.media,
        point: this.point
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.allocate-result {
  margin-top: 30px;
}
</style>
<style lang='scss'>
.allocate-result {
  .el-table .el-table__row.row-last .cell {
    color: #b2b4b9;
    font-weight: 800;
    font-size: 14px;
  }
}
</style>
