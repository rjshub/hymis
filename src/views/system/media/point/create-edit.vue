<template>
  <hy-dialog :visible="isShow"
    @update:visible='onUpdateVisible'
    custom-class='point-create-edit'
    v-loading='isLoading'
    :close-on-click-modal="false"
    :title="title_c">

    <div class="box"
      style="padding:24px 20px 0 20px;color:#939aa2;">

      <div v-if="!!id" style="padding-left: 24px;
        font-size: 12px;
        margin-bottom: 20px;">{{$t('lang.system_media_pbs_media')}}：<span style="padding: 11px;">{{id}}</span>
      </div>
      <el-form size='mini'
        ref="form"
        style="height: 100%;"
        :inline="true"
        :model="form"
        :rules="rules"
        class="form"
        label-width="auto">

        <!-- <el-form-item label="MIS点位ID：">
          <span>{{id}}3456</span>
        </el-form-item> -->

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.misPointName')}:`"
          prop="misPointName">
          <el-input v-model.trim="form.misPointName"
            style="width:370px;"
            :placeholder="$t('lang.public_MIS_position_name_placeholder')"></el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.levelOneAss')}:`"
          prop="levelOneAss">
          <!-- <el-input v-model.trim="form.levelOneAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.levelOneAss"
            style="width:370px;"
            size="mini"
            filterable
            clearable
            @change='onChangeLevelOneAss'
            :placeholder="$t('lang.public_select_primary_classification_placeholder')">
            <el-option v-for="item in levelOneAssList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.levelTwoAss')}:`"
          prop="levelTwoAss">
          <!-- <el-input v-model.trim="form.levelTwoAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.levelTwoAss"
            style="width:370px;"
            size="mini"
            filterable
            clearable
            @change='onChangeLevelTwoAss'
            :placeholder="$t('lang.public_select_second_classification_placeholder')">
            <el-option v-for="item in levelTwoAssList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.misMedia')}:`"
          prop="misMedia">

          <!-- <el-input v-model.trim="form.pbsMediaName"
            placeholder="请输入PBS媒体名称"></el-input> -->
          <el-select v-model="form.misMedia"
            style="width:370px;"
            size="mini"
            filterable
            clearable
            @change='onChangeMisMedia'
            :placeholder="$t('lang.public_select_MIS_media_placeholder')">
            <el-option v-for="item in mediaList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <!-- <span style="padding-right: 25px;">{{ item.id }}</span>
              <span>{{ item.name }}</span> -->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.port')}:`"
          prop="port">
          <!-- <el-input v-model.trim="form.levelTwoAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.port"
            style="width:370px;"
            size="mini"
            filterable
            clearable
            multiple
            :placeholder="$t('lang.public_port_placeholder')">
            <el-option v-for="item in portList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.bidPrice')}:`"
          prop="bidPrice">
          <!-- <el-input v-model.trim="form.levelTwoAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.bidPrice"
            style="width:370px;"
            size="mini"
            filterable
            multiple
            clearable
            :placeholder="$t('lang.public_select_Bid_type_placeholder')">
            <el-option v-for="item in bidPriceList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.rate')}:`"
          prop="rate">
          <el-input v-model.trim="form.rate"
            style="width:370px;"
            :placeholder="$t('lang.system_media_point_rate_card_rate')"></el-input>
        </el-form-item>
         <el-form-item :label="`${$t('lang.system_media_point_cerate_form.selling_unit')}:`"
          prop="selling_unit">
          <!-- <el-input v-model.trim="form.levelTwoAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.selling_unit"
            style="width:370px;"
            size="mini"
            clearable
            :placeholder="$t('lang.public_select_selling_unit_placeholder')">
            <el-option v-for="(item,index) in sellingUnitList"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.relationPbsId')}:`"
          class="relation-pbs-form-item"
          :class="{isEdit:!isNew}"
          label-width="110px"
          prop="relationPbsId">
          <relation-pbs ref="refRelationPbs" :list='pbsPointList' :rightCheckedData='pbsPosId'/>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_point_cerate_form.algorithmSupport')}:`" style="padding-left:0"
          prop="algorithmSupport">
          <el-checkbox v-model="form.algorithmSupport" true-label='1' false-label='0'>{{$t('lang.system_media_point_support_budget')}}</el-checkbox>
          <!-- <el-radio v-model="form.algorithmSupport" label="1">支持PDB媒体预算分配</el-radio> -->
          <!-- <el-radio v-model="form.algorithmSupport" label="0">不支持PDB媒体预算分配</el-radio> -->
        </el-form-item>

      </el-form>
    </div>

    <div slot="footer">
      <el-button plain
        @click="onCancel">{{$t('lang.public_button_cancel')}}</el-button>
      <el-button @click="onConfirm">{{$t('lang.public_button_confirm')}}</el-button>
    </div>
  </hy-dialog>
</template>
<script>
import _ from "lodash";
import fetch from "@/services/fetch";
import relationPbs from "./relation-pbs";
export default {
  name: "point-create-edit",
  componentName: "PointCreateEdit",
  components: {
    relationPbs
  },
  props: {
    id: {
      //是否是新建 或者 编辑
      type: [Number, String],
      required: true
    },
    isShow: {
      type: [Boolean],
      required: true
    }
  },
  data() {
    var validateMisPoint = (rule, value, callback) => {
      // let reg = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_\(\)（）-]+$/;
      let reg = /^[^\'\"]+$/;
      if (value === "") {
        callback(new Error(this.$t('lang.reg_MIS_position_name_required')));
      } else {
        if (!reg.test(value)) {
          callback(
            // new Error("只允许是中英文、数字、-_(),首位必须是字母或者汉字")
            new Error(this.$t('lang.reg_MIS_position_not_allowed'))
          );
        } else {
          if (value.length > 30 || value.length < 2) {
            callback(new Error(this.$t('lang.reg_MIS_position_length_error')));
          } else {
            callback();
          }
        }
      }
    };
    var validatePort = (rule, value, callback) => {
      if (value.length) {
        callback();
      }else{
        callback(
          new Error(this.$t('lang.public_port_placeholder'))
        );
      }
    };
    var validateBidPrice = (rule, value, callback) => {
      if (value.length) {
        callback();
      }else{
        callback(
          new Error(this.$t('lang.public_select_Bid_type_placeholder'))
        );
      }
    }
    var validateRelationPbs = (rule, value, callback) => {
      // console.log("TCL: validateRelationPbs -> value", value)
      if (this.form.relationPbsId) {
        callback();
      }else{
        callback(
          new Error(this.$t('lang.public_select_related_pbs_id_placeholder'))
        );
      }   
    }
    var validateRate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.system_media_point_rate_card_rate')));
      } else {
        if (!this.$constReg.num.test(value)){
          callback(
            new Error(this.$t('lang.reg_positive_integer_two_decimal'))
          );
        } else {
          if (value.length > 30) {
            callback(new Error(this.$t('lang.reg_value_length_1_30')));
          } else {
            callback();
          }
        }
      }
    };
    return {
      mediaList: [],
      levelOneAssList: [],
      levelTwoAssList: [],
      portList: [],
      bidPriceList: [],
      pbsPointList:[],
      isLoading: false,
      sellingUnitList:['CPM', this.$t('lang.public_day')],
      rules: {
        misMedia: [
          {
            required: true,
            message: this.$t('lang.public_select_MIS_media_placeholder'),
            trigger: ["change"]
          }
        ],
        misPointName: [
          { required: true, validator: validateMisPoint, trigger: ["blur", "change"] }
        ],
        levelOneAss: [
          { required: true, message: this.$t('lang.reg_select_primary_classification_placeholder'), trigger: "change" }
        ],
        levelTwoAss: [
          { required: true, message: this.$t('lang.reg_select_second_classification_placeholder'), trigger: "change" }
        ],
        relationPbsId: [
          { required: true, validator: validateRelationPbs, trigger: "change" }
        ],
        port: [
          { required: true, validator: validatePort, trigger: ["change"] }
        ],
        bidPrice: [
          { required: true, validator: validateBidPrice, trigger: ["change"] }
        ],
        algorithmSupport: [
          { required: true, message: this.$t('lang.public_algorithmSupport_placeholder'), trigger: ["change"] }
        ],
        rate: [
          { required: true, validator: validateRate, trigger: ["blur", "change"] }
        ],
        selling_unit: [
          { required: true, message: this.$t('lang.public_select_selling_unit_placeholder'),trigger: ["change"] }
        ],
      },
      pbsPosId:'',//编辑时有效
      form: {
        misPointName: "",
        levelOneAss: "",
        levelTwoAss: "",
        misMedia: "",
        port: [],
        bidPrice: [],
        relationPbsId:'',
        pos_name:[],
        algorithmSupport:'1',
        rate:"",
        selling_unit:""
      }
    };
  },
  watch: {},
  computed: {
    isNew() {
      return !this.id;
    },
    title_c() {
      let str = this.$t('lang.public_tooltip_edit');
      if (this.isNew) {
        str = this.$t('lang.public_tooltip_create');
      }
      return str + this.$t('lang.system_media_point');
    }
  },
  async created() {
    this.$on("relation-change", ()=>{
      let [relationPbs,pos_name]=this.$refs.refRelationPbs.getData();
      this.form.relationPbsId=relationPbs.join(',');
      this.form.pos_name=pos_name;
      this.$refs.form.validateField('relationPbsId');
    });

    if (!this.isNew) {
      await this.fetchDetail();
      this.getSelectList();
    } else {
      this.getSelectList();
    }
  },
  mounted() {},
  methods: {

    async getSelectList() {
      let data = await this.fetchCore("/mediamanage/selectedlist", {
        type_id_1: this.form.levelOneAss,
        type_id_2: this.form.levelTwoAss,
        hymis_media_id:this.form.misMedia,
        position_id: this.id
      });
      this.mediaList = data.medias || [];
      this.levelOneAssList = data.type.one || [];
      this.levelTwoAssList = data.type.two || [];
      this.pbsPointList = data.pbs_pos_list || [];
      this.portList = data.ports;
      this.bidPriceList = data.bid_types;
    },
    jsonParse(jsonStr){
      try {
        let obj = JSON.parse(jsonStr);
        return obj;
      } catch (err) {
        console.error(err)
        return {};
      }
    },
    async fetchDetail() {
      let data = await this.fetchCore("/position/positiondetail", {
        position_id: this.id
      });
      let obj = {};
      obj.levelOneAss = data.type_id_1 + "";
      obj.levelTwoAss = data.type_id_2 + "";
      obj.misPointName = data.pos_name;
      obj.misMedia = data.media_id + "";
      obj.port = data.ports.split(",");
      obj.bidPrice = data.bid_type.split(",");
      obj.algorithmSupport = data.type + "";
      obj.rate = data.rate;
      obj.selling_unit = data.selling_unit;
      this.pbsPosId = this.jsonParse(data.pbs_pos_id);
      this.form = obj;
    },
    onChangeLevelOneAss() {
      this.form.levelTwoAss = "";
      this.form.misMedia = "";
      this.getSelectList();
    },
    onChangeLevelTwoAss() {
      this.form.misMedia = "";
      this.getSelectList();
      
    },
    onChangeMisMedia() {
      this.getSelectList();
    },
    onCancel() {
      this.$emit("update:isShow", false);
    },
    onConfirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.fetchNewEdit();
        } else {
          return false;
        }
      });
    },
    getParam() {
      let param = {
        "pos_name": this.form.misPointName,
        "type_id_1": this.form.levelOneAss,
        "type_id_2": this.form.levelTwoAss,
        "media_id":this.form.misMedia,
        // "pbs_media_id": "46,12",
        "pbs_pos_id": this.form.relationPbsId,
        "pbs_pos_name": this.form.pos_name,
        "ports": this.form.port.join(','),
        "bid_type": this.form.bidPrice.join(','),
        "type":this.form.algorithmSupport,
        "rate":this.form.rate,
        "selling_unit":this.form.selling_unit
      }

      if (!this.isNew) {
        param.position_id = this.id;
      }

      return param;
    },
    async fetchNewEdit() {
      let param = this.getParam();
      await this.fetchCore("/position/modifypostion", param);
      this.emitEvent();
      this.onCancel();
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
    },
    emitEvent() {
      this.$eventHub.$emit("refreshPointList",this.isNew);
    },
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    }
  }
};
</script>
<style scoped>
.box {
  height: calc(100% - 24px - 58px);
}
</style>
<style lang="scss">
.point-create-edit {
  .el-form--inline .el-form-item:nth-child(even) {
    // padding-left: 50px;
    padding-left:24px;
  }
  .el-form--inline .el-form-item {
    margin-bottom: 20px;
  }
  .relation-pbs-form-item{
    height: calc(100% - 10px - 147px);
    margin-bottom:10px;
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
    &.isEdit{
      height: calc(100% - 10px - 147px - 36px);
    }
  }
  .relation-pbs-form-item .el-form-item__content {
    height: 100%;
  }
}
</style>
