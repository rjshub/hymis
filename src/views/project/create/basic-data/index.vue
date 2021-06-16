<template>
  <hy-dialog :visible="true"
    title="Basic Data"
    custom-class='basic-data'
    @close="onClose"
    :heightFillBody='true'
    v-loading="isLoading"
    :close-on-click-modal="false">
    <div class="box">
      <div class="head">
        <!-- 过滤条件 start -->
        <div class="filter-box">
          <el-select v-model="mediaFilterValue"
            class="select"
            size="mini"
            filterable
            @change='mediaChange'
            placeholder="Media">
            <el-option key=""
              :label="$t('lang.AS_detail_basic_data_media_label')"
              value="">
            </el-option>
            <el-option v-for="item in mediaFilterList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>

          <el-select v-model="marketFilterValue"
            class="select"
            style=" margin-left: 10px;"
            size="mini"
            filterable
            @change='marketChange'
            placeholder="Market">
            <el-option key=""
              :label="$t('lang.AS_detail_basic_data_market_label')"
              value="">
            </el-option>
            <el-option v-for="item in marketFilterList "
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>

          <el-input style="width:190px;"
            size="mini"
            :placeholder="$t('lang.public_key_words')"
            @keyup.enter.native="refresh"
            v-model="keywords">
            <i slot="prefix"
              @click="refresh"
              class="el-input__icon el-icon-search"
              style="cursor: pointer;"></i>
          </el-input>
        </div>
        <!-- 过滤条件 end -->

      </div>
      <div class="small-head clearfix" v-if="enableWriteCreateProject">
        <div class="item left">
          <template v-if="!showNewLine">
            <el-button class="BD-button-small-padding"
              @click="addLeftLine"
              :title="$t('lang.public_add')"
              icon="el-icon-plus">
            </el-button>
            <el-upload style="display:inline-block"
              :data='{project_id:projectID}'
              action="/api/basicdata/importbasicdata"
              :show-file-list="false"
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
              :on-error='handleLeftError'
              :before-upload='handleLeftBeforeUpload'
              :on-success="handleLeftSuccess">
              <el-button class="BD-button-small-padding"
                plain
                :title="$t('lang.public_upload_again')"
                icon="iconfont icon-export">
              </el-button>
            </el-upload>

          </template>
          <!-- 新建 start -->
          <div v-else>
            <el-form :inline="true"
              :model="form"
              ref="form"
              :show-message='false'
              :rules='rules'
              class="">

              <el-form-item prop="media">
                <el-select v-model="form.media"
                  style="width: 120px;"
                  placeholder="Media"
                  size="mini"
                  filterable>
                  <el-option v-for="item in mediaList "
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="market">
                <el-select v-model="form.market"
                  style="width: 120px;"
                  placeholder="Market"
                  size="mini"
                  filterable>
                  <el-option v-for="item in marketList "
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="media_supply">
                <el-input v-model="form.media_supply"
                  style="width:120px;"
                  size="mini"
                  :placeholder="$t('lang.AS_detail_basic_data_create_form.media_inventory')">
                </el-input>
              </el-form-item>

              <el-form-item prop="supply_discount">
                <el-input v-model="form.supply_discount"
                  style="width:120px;"
                  size="mini"
                  :placeholder="$t('lang.AS_detail_basic_data_create_form.inventory_discount')">
                </el-input>
              </el-form-item>
              
              <el-form-item prop="customer_cpm">
                <el-input v-model="form.customer_cpm"
                  style="width:120px;"
                  size="mini"
                  :placeholder="$t('lang.AS_detail_basic_data_create_form.CPM_unit_cost_for_client')">
                </el-input>
              </el-form-item>

              <el-form-item prop="media_cpm"
                v-if="enableMediaCpm">
                <el-input v-model="form.media_cpm"
                  style="width:120px;"
                  size="mini"
                  :placeholder="$t('lang.AS_detail_basic_data_create_form.CPM_nit_cost_for_media')">
                </el-input>
              </el-form-item>
              

              <el-form-item>
                <el-button class="BD-button-small-padding"
                  @click="saveNewLeftLine"
                  icon="el-icon-check">
                </el-button>
                <el-button class="BD-button-small-padding"
                  @click="cancelNewLine"
                  plain
                  icon="el-icon-close">
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 新建 end -->
        </div>
        <div class="item right">
          <template v-if="!showRightNewLine">
            <el-button class="BD-button-small-padding"
              @click="addRightLine"
              :title="$t('lang.public_add')"
              icon="el-icon-plus">
            </el-button>
            <el-upload style="display:inline-block"
              :data='{project_id:projectID}'
              :action="rightUploadUrl"
              :show-file-list="false"
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
              :on-error='handleRightError'
              :before-upload='handleRightBeforeUpload'
              :on-success="handleRightSuccess">
              <el-button class="BD-button-small-padding"
                plain
                :title="$t('lang.public_upload_again')"
                icon="iconfont icon-export">
              </el-button>
            </el-upload>
          </template>
          <div v-else>
            <el-form :inline="true"
              :model="newRightForm"
              ref="newRightForm"
              :show-message='false'
              :rules='newRightRules'
              class="">
              <el-form-item prop="market">
                <el-select v-model="newRightForm.market"
                  style="width: 100px;"
                  placeholder="Market"
                  size="mini"
                  filterable>
                  <el-option v-for="item in marketListRightNew "
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="data">
                <el-input v-model="newRightForm.data"
                  style="width:100px;"
                  size="mini"
                  :placeholder="columnName">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="BD-button-small-padding"
                  @click="saveNewRightLine"
                  icon="el-icon-check">
                </el-button>
                <el-button class="BD-button-small-padding"
                  @click="cancelNewRightLine"
                  plain
                  icon="el-icon-close">
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="table-wrap" :class="enableWriteCreateProject?'':'only-read'">
        <!-- 左侧列表 start-->
        <el-form :inline="true"
          :model="editBDForm"
          style="float: left;margin-right:5px;height:100%"
          ref="editBDForm"
          :show-message='false'
          :rules='rules'>

          <el-table :data="tableData"
            style="width:100%;background:#141C28"
            height='100%'
            @sort-change="sortColumnChange">
            <el-table-column prop="media"
              :render-header="renderMediaHeader"
              sortable="custom"
              label="Media"
              width="140">
              <template slot-scope="scope">
                <template v-if='!scope.row.isEdit'>
                  <div style="margin-left: 25px;">{{scope.row.media}}</div>
                </template>
                <el-form-item prop="media"
                  v-else>
                  <div style="margin-left: 25px;">
                    <el-select v-model="editBDForm.media"
                      style="width: 100px;"
                      placeholder="Media"
                      size="mini"
                      filterable>
                      <el-option v-for="item in mediaList "
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column prop="market"
              label="Market"
              sortable="custom"
              width="110">
              <template slot-scope="scope">
                <template v-if='!scope.row.isEdit'>
                  <span>{{scope.row.market}}</span>
                </template>
                <el-form-item prop="market"
                  v-else>
                  <el-select v-model="editBDForm.market"
                    style="width: 100px;"
                    placeholder="Media"
                    size="mini"
                    filterable>
                    <el-option v-for="item in marketList "
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="reach_goal"
              label="Reach Goal">
            <template slot-scope="scope">
              <template v-if='!scope.row.isEdit'>
                <span>{{scope.row.reach_goal_frequency}}</span>
                <span>+</span>
                <span>{{toPercentage(scope.row.reach_goal_reach)}}%</span>
              </template>
              <el-form-item prop="reach_goal"
                  v-else>
                <el-input v-model="editBDForm.reach_goal"
                    style="width:100px;"
                    size="mini"
                    placeholder="Reach Goal"></el-input>
              </el-form-item>
            </template>
          </el-table-column> -->

            <el-table-column prop="media_supply"
              width="140"
              :label="$t('lang.AS_detail_basic_data_create_form.media_inventory')">
              <template slot-scope="scope">
                <template v-if='!scope.row.isEdit'>
                  {{scope.row.media_supply}}
                </template>
                <el-form-item prop="media_supply"
                  v-else>
                  <el-input v-model="editBDForm.media_supply"
                    style="width:100px;"
                    size="mini"
                    :placeholder="$t('lang.public_enter_placeholder')"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column prop="supply_discount"
              :label="$t('lang.AS_detail_basic_data_create_form.inventory_discount')"
              width="100">
              <template slot-scope="scope">
                <template v-if='!scope.row.isEdit'>
                  {{scope.row.supply_discount}}
                </template>
                <el-form-item prop="supply_discount"
                  v-else>
                  <el-input v-model="editBDForm.supply_discount"
                    style="width:100px;"
                    size="mini"
                    :placeholder="$t('lang.public_enter_placeholder')"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column prop="customer_cpm"
              :label="$t('lang.AS_detail_basic_data_create_form.CPM_unit_cost_for_client')"
              width="150">
              <template slot-scope="scope">
                <template v-if='!scope.row.isEdit'>
                  {{scope.row.customer_cpm}}
                </template>
                <el-form-item prop="customer_cpm"
                  v-else>
                  <el-input v-model="editBDForm.customer_cpm"
                    style="width:100px;"
                    size="mini"
                    :placeholder="$t('lang.public_enter_placeholder')"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column prop="media_cpm"
              v-if="enableMediaCpm"
              :label="$t('lang.AS_detail_basic_data_create_form.CPM_nit_cost_for_media')"
              :width="enableWriteCreateProject?120:240">
              <template slot-scope="scope">
                <template v-if='!scope.row.isEdit'>
                  {{scope.row.media_cpm}}
                </template>
                <el-form-item prop="media_cpm"
                  v-else>
                  <el-input v-model="editBDForm.media_cpm"
                    style="width:100px;"
                    size="mini"
                    :placeholder="$t('lang.public_enter_placeholder')"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="$t('lang.public_operate')"
              v-if="enableWriteCreateProject"
              align="center"
              width="120">
              <template slot-scope="scope">
                <span v-if='!scope.row.isEdit'>
                  <i class="iconfont icon-list-edit"
                    :title="$t('lang.public_tooltip_edit')"
                    v-if='!hasEditLine'
                    style="font-size:22px;cursor:pointer;"
                    @click="onEditLeft(scope)"></i>
                  <i class="iconfont icon-trash"
                    :title="$t('lang.public_tooltip_delete')"
                    style="font-size:22px;cursor:pointer;"
                    @click="onDelete(scope.row.id)"></i>
                </span>
                <span v-else>
                  <el-button class="BD-button-small-padding"
                    @click="saveEditLine(scope)"
                    :title="$t('lang.public_button_save')"
                    style="cursor:pointer;"
                    icon="el-icon-check">
                  </el-button>
                  <el-button class="BD-button-small-padding"
                    @click="cancelEditLine(scope)"
                    plain
                    :title="$t('lang.public_button_cancel')"
                    style="cursor:pointer;"
                    icon="el-icon-close">
                  </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <!-- 左侧列表 end-->

        <!-- 右侧列表 start-->
        <el-form :inline="true"
          :model="editRightForm"
          style="float: right;height:100%"
          ref="editRightForm"
          :show-message='false'
          :rules='rightRules'>

          <el-table :data="rightTableData"
            style="width:100%;background:#141C28"
            height='100%'
            @sort-change="sortColumnChangeRight">
            <el-table-column prop="market"
              label="Market"
              sortable="custom"
              width="105">
            </el-table-column>

            <el-table-column prop="reach_goal"
              :width="enableWriteCreateProject?140:210"
              label="Reach Goal">
              <!-- 这一列的表头 start -->
              <template slot="header"
                slot-scope="scope">
                <template v-if="enableWriteCreateProject">
                  <template v-if='!hasEditColumn'>
                  <!-- {{columnName}} -->
                  <el-select v-model="rightTableType_"
                    style="width: 90px;vertical-align: middle;"
                    :placeholder="$t('lang.public_type')"
                    @change="onChangeRightType"
                    class="change-type"
                    size="mini">
                    <el-option label="Reach Goal"
                      value="reachgoal">
                    </el-option>
                    <el-option :label="$t('lang.AS_detail_basic_data_create_form.target_CPM')"
                      value="goalcpm">
                    </el-option>
                  </el-select>
                  <i class="iconfont icon-list-edit right-edit"
                    :title="$t('lang.public_tooltip_edit')"
                    v-if="rightTableData.length"
                    @click="onEditRight"></i>
                </template>
                <template v-else>
                  <el-button size='mini'
                    @click="onConfirmRightEdit"
                    icon="el-icon-check"></el-button>
                  <el-button size='mini'
                    @click="onCancelRightEdit"
                    plain
                    icon="el-icon-close"></el-button>
                </template>
                </template>
                <template v-else>
                  {{columnName}}
                </template>
                
              </template>
              <!-- 这一列的表头 end -->
              <!-- 这一列的内容 start -->
              <template slot-scope="scope">
                <template v-if='!hasEditColumn'>
                  
                  <template v-if='rightTableType=="goalcpm"'>
                    {{scope.row.goal_cpm?$formatNumber(scope.row.goal_cpm,0,''):''}}
                  </template>
                  <template v-else>
                    {{scope.row.reach_goal}}
                  </template>
                </template>

                <el-form-item :prop="scope.row.id"
                  v-else>
                  <el-input v-model="editRightForm[scope.row.id]"
                    style="width:100px;"
                    size="mini"
                    :placeholder="rightTableType=='goalcpm'? $t('lang.AS_detail_basic_data_create_form.target_CPM'):'Reach Goal'"></el-input>
                </el-form-item>
              </template>
              <!-- 这一列的内容 end -->
            </el-table-column>

            <el-table-column :label="$t('lang.public_operate')"
              v-if="enableWriteCreateProject"
              align="center"
              width="70">
              <template slot-scope="scope">
                <i class="iconfont icon-trash"
                  :title="$t('lang.public_tooltip_delete')"
                  style="font-size:22px;cursor:pointer;"
                  @click="onDeleteRight(scope.row.id)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <!-- 右侧列表 end-->
      </div>
    </div>
    <div slot="footer" v-if="enableWriteCreateProject">
      <!-- accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' -->
      <!-- <el-button plain
          @click="onClose">取消</el-button> -->
      <!-- <el-upload style="display:inline-block"
          :data='{project_id:projectID}'
          action="/api/basicdata/importbasicdata"
          :show-file-list="false"
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          :on-success="handleSuccess">
        <el-button plain>重传</el-button>
      </el-upload> -->
      <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
    </div>
  </hy-dialog>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import math from "mathjs";
import moment from "moment";
import fetch from "@/services/fetch";
const Reach_goal_reg = new RegExp(/^\d{1,}[+]\d{1,2}%$/);
export default {
  name: "basic-data",

  components: {},
  data() {
    const THIS = this
    let validatorRightVal = (rule, value, callback) => {
      let _value = _.trim(value);
      if (this.rightTableType == "goalcpm") {
        if (_value == "") {
          // this.$message.error("目标CPM不能为空");
          callback(new Error(THIS.$t('lang.reg_target_CPM_required')));
        } else if (!this.$constReg.positiveInt.test(_value)) {
          // this.$message.error("目标CPM格式不正确，只能是正整数");
          callback(new Error(THIS.$t('lang.reg_target_CPM_incorrect')));
        } else {
          callback();
        }
      } else {
        if (_value == "") {
          // this.$message.error("Reach Goal不能为空");
          callback(new Error(THIS.$t('lang.reg_reach_goal_required')));
        } else if (!new RegExp(/^\d{1,}[+]\d{1,2}%$/).test(_value)) {
          // this.$message.error("Reach Goal格式不正确，例:4+30%");
          callback(new Error(THIS.$t('lang.reg_reach_goal_incorrect')));
        } else {
          callback();
        }
      }
    };
    let validatorRightMarket = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        // this.$message.error("Market不能为空");
        callback(new Error(THIS.$t('lang.reg_market_required')));
      } else {
        callback();
      }
    };
    return {
      rightTableType: "",
      rightTableType_:'',
      isVisible: true,
      isLoading: false,
      showNewLine: false,
      showRightNewLine: false,
      hasEditLine: false,
      hasEditColumn: false,
      order: "", //顺序还是逆序
      column: "", //需要排序的列
      rightOrder: "",
      rightColumn: "",
      tableData: [],

      rightTableData: [],

      marketFilterValue: "",
      mediaFilterValue: "",
      keywords: "",
      marketList: [],
      mediaList: [],
      marketFilterList: [],
      mediaFilterList: [],
      newRightForm: {
        market: "",
        data: ""
      },
      editRightForm: {},
      editBDForm: {
        id: "",
        market: "",
        media: "",
        reach_goal: "",
        customer_cpm: "",
        media_cpm: "",
        media_supply: "",
        supply_discount: ""
      },
      //add new line form
      form: {
        market: "",
        media: "",
        reach_goal: "",
        customer_cpm: "",
        media_cpm: "",
        media_supply: "",
        supply_discount: ""
      },
      rightRules: {},
      newRightRules: {
        market: [
          { required: true, validator: validatorRightMarket, trigger: "change" }
        ],
        data: [
          { required: true, validator: validatorRightVal, trigger: "change" }
        ]
      },
      rules: {
        market: [
          { required: true, message: THIS.$t('lang.reg_market_required'), trigger: "change" }
        ],
        media: [
          { required: true, message: THIS.$t('lang.reg_media_required'), trigger: "change" }
        ],
        reach_goal: [
          { required: true, message: THIS.$t('lang.reg_reach_goal_required'), trigger: "blur" }
        ],
        customer_cpm: [
          { required: true, message: THIS.$t('lang.reg_CPM_unit_cost_for_client_required'), trigger: "blur" }
        ],
        media_cpm: [
          { required: false, message: THIS.$t('lang.reg_CPM_nit_cost_for_media_required'), trigger: "blur" }
        ],
        media_supply: [
          { required: false, message: THIS.$t('lang.reg_media_inventory_required'), trigger: "blur" }
        ],
        supply_discount: [
          { required: true, message: THIS.$t('lang.reg_inventory_discount_required'), trigger: "blur" }
        ]
      }
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    ...mapGetters("permissions", ["enableMediaCpm","enableWriteCreateProject"]),
    marketListRightNew(){ 
      let marks = this.getExistMarketByRightTable();
      return this.marketList.filter(i=>{
        return !marks.includes(i);
      })
    },
    rightListDelUrl(){
      let url = "/reachgoal/deletelist";
      if (this.rightTableType == "goalcpm") {
        url = "/goalcpm/deletelist";
      }
      return url;
    },
    rightUploadUrl() {
      let url = "/api/reachgoal/importreachgoal";
      if (this.rightTableType == "goalcpm") {
        url = "/api/goalcpm/importcpm";
      }
      return url;
    },
    rightListUrl() {
      let url = "/reachgoal/rglist";
      if (this.rightTableType == "goalcpm") {
        url = "/goalcpm/tclists";
      }
      return url;
    },
    rightDeleteUrl() {
      let url = "/reachgoal/delete";
      if (this.rightTableType == "goalcpm") {
        url = "/goalcpm/delete";
      }
      return url;
    },
    columnName() {
      let name = "reach goal";
      if (this.rightTableType == "goalcpm") {
        name = this.$t('lang.AS_detail_basic_data_create_form.target_CPM');
      }
      return name;
    },
    formStyle() {
      if (this.showNewLine) {
        return { height: "calc(100% - 48px - 38px)" };
      } else {
        return { height: "calc(100% - 48px)" };
      }
    },
    tableDataRender() {
      return this.tableData.filter(i => {
        // i.media == this.mediaFilterValue && i.market == this.marketFilterValue
        if (this.mediaFilterValue && this.marketFilterValue) {
          // console.log(1)
          return (
            i.media == this.mediaFilterValue &&
            i.market == this.marketFilterValue
          );
        } else if (this.mediaFilterValue && !this.marketFilterValue) {
          // console.log(2)
          return i.media == this.mediaFilterValue;
        } else if (!this.mediaFilterValue && this.marketFilterValue) {
          // console.log(3)
          return i.market == this.marketFilterValue;
        } else {
          // console.log(4)
          return i;
        }
      });
    }
  },
  watch: {},

  created() {
    this.init();
    // this.update_project_id("4"); //临时代码
  },

  mounted() {},
  methods: {
    ...mapActions("project", [
      // "fetch_step_status",
      // "fetch_preview_data",
      // "fetch_log_info",
      "update_project_id",
      "updata_preview_log_step_status"
    ]),
    onChangeRightType(val){
      // console.log('val=',val)
      let msg = this.$t('lang.AS_detail_basic_data_reach_to_cpm');
      if (val=='reachgoal') {
        msg = this.$t('lang.AS_detail_basic_data_cpm_to_reach');
      }
      this.$confirm(msg, this.$t('lang.public_dialog_point'), {
          confirmButtonText: this.$t('lang.public_button_confirm'),
          cancelButtonText: this.$t('lang.public_button_submit'),
          type: 'warning'
        }).then(async () => {
          await this.deleteRightList();
          this.rightTableType = val;
          this.fetch_rightTable_list();
          // this.clearRightTableVal();
        }).catch(() => {
          this.rightTableType_ = this.rightTableType;
        });
    },
    //暂时不用
    clearRightTableVal(){
      for (let item of this.rightTableData) {
        item.id='';
        if (item.hasOwnProperty('reach_goal')) {
          item.reach_goal = '';
        }else if(item.hasOwnProperty('goal_cpm')) {
          item.goal_cpm = '';
        }
      }
    },
    async init() {
      this.get_select_forfilter_list();
      this.get_select_fornew_list();
      this.fetch_table_list();
      await this.getFileName();
      this.fetch_rightTable_list();
    },
    //获取右侧表中已经存在的mark 
    getExistMarketByRightTable() {
      let obj = {};
      for (const item of this.rightTableData) {
        obj[item.market] = true;
      }
      return Object.keys(obj);
    },
    //暂时废弃
    setRightTableData() {
      let markets = this.getMarketByTableData();
      let list = [];
      for (const market of markets) {
        list.push({
          id: "",
          market: market,
          reach_goal: ""
        });
      }
      this.rightTableData = list;
    },
    // BD上传失败的回调
    handleLeftError() {
      this.isLoading = false;
      this.$message.error(this.$t('lang.public_upload_fail'));
    },
    // BD上传之前的回调
    handleLeftBeforeUpload() {
      if (this.hasEditingLeft(this.$t('lang.public_upload_again'))) {
        return false
      }else{
        this.isLoading = true;
        return true
      }
    },
    // BD上传成功的回调
    handleLeftSuccess(res, file) {
      if (res && res.ret == 0) {
        //不能有&res.ret& 否则进不去
        this.$message.success(this.$t('lang.public_upload_again_success'));
        this.fetch_table_list();
      } else {
        this.$message.error(res.msg || this.$t('lang.public_upload_fail'));
      }
      this.isLoading = false;
    },
    // 右侧表格上传失败的回调
    handleRightError() {
      this.isLoading = false;
      this.$message.error(this.$t('lang.public_upload_fail'));
    },
    // 右侧表格上传之前的回调
    handleRightBeforeUpload() {
      if (this.hasEditingRight(this.$t('lang.public_upload_again'))) {
        return false;
      }else{
        this.isLoading = true;
        return true;
      }
    },
    // 右侧表格上传成功的回调
    handleRightSuccess(res, file) {
      if (res && res.ret == 0) {
        //不能有&res.ret& 否则进不去
        this.$message.success(this.$t('lang.public_upload_again_success'));
        this.fetch_rightTable_list();
      } else {
        this.$message.error(res.msg || this.$t('lang.public_upload_fail'));
      }
      this.isLoading = false;
    },
    mediaChange() {
      this.fetch_table_list();
    },
    marketChange() {
      this.fetch_table_list();
      this.fetch_rightTable_list();
    },
    // 重传按钮
    handleSuccess(res, file) {
      if (res && res.ret == 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
        // this.form.logo = res.data.url;
        this.$message.success(this.$t('lang.public_upload_success'));
        this.init();
      } else {
        this.$message.error(res.msg || this.$t('lang.public_upload_fail'));
      }
    },
    formatParam(obj) {
      let param = _.cloneDeep(obj);
      let reach_goal_arr = param.reach_goal.split("+");
      param.reach_goal_frequency = reach_goal_arr[0];
      param.reach_goal_reach = reach_goal_arr[1];
      param.project_id = this.projectID;
      delete param.reach_goal;
      return param;
    },
    // 保存左侧表格的编辑
    saveEditLine({ $index, row }) {
      this.$refs["editBDForm"].validate(async valid => {
        if (this.validateFormat(this.editBDForm) && valid) {
          // let param = this.formatParam(this.editBDForm);
          let param = _.cloneDeep(this.editBDForm);
          param.project_id = this.projectID;
          delete param.reach_goal;
          // param.supply_discount = math.eval(param.supply_discount + "*100") - 0;
          // param.reach_goal_reach = math.eval(Number.parseFloat(param.reach_goal_reach) + "/100") - 0;

          if (!this.enableMediaCpm) {
            delete param.media_cpm;
          }

          let data = await this.fetchCore("/basicdata/edit", param);
          // this.showNewLine = false;
          this.$message.error(this.$t('lang.public_edit_success'));
          this.fetch_table_list();
          this.updataEditStatus($index, false);
        } else {
          return false;
        }
      });
    },
    // 取消左侧表格的编辑
    cancelEditLine({ $index, row }) {
      this.updataEditStatus($index, false);
    },
    updataEditStatus(index, bool) {
      let obj = _.cloneDeep(this.tableData[index]);
      obj.isEdit = bool;
      this.tableData.splice(index, 1, obj);
      this.hasEditLine = bool;
    },
    getValidator() {
      return (rule, value, callback) => {
        let val = _.trim(value);
        if (this.rightTableType == "goalcpm") {
          if (!this.$constReg.positiveInt.test(val)) {
            callback(new Error(" "));
          } else {
            callback();
          }
        } else {
          if (!Reach_goal_reg.test(val)) {
            callback(new Error(" "));
          } else {
            callback();
          }
        }
      };
    },
    setRightRules() {
      this.rightRules = {};
      for (const i of this.rightTableData) {
        let validator = this.getValidator();
        let [required, message, trigger] = [true, this.$t('lang.public_required'), "blur"];
        this.$set(this.rightRules, i["id"], [
          { required, message, trigger, validator }
        ]);
      }
    },
    onEditRight() {
      this.setRightRules();
      this.hasEditColumn = true;
      this.editRightForm = {}; //清空数据
      for (let item of this.rightTableData) {
        let tem = item.reach_goal ? item.reach_goal : item.goal_cpm;
        this.$set(this.editRightForm, item.id, tem);
      }
    },
    onConfirmRightEdit() {
      this.$refs["editRightForm"].validate(async valid => {
        if (this.validateRightFormat(this.editRightForm) && valid) {
          if (this.rightTableType == "goalcpm") {
            await this.fetchEditGoalCpm(this.editRightForm);
          } else {
            await this.fetchEditReachGoal(this.editRightForm);
          }
          this.hasEditColumn = false;
          this.$message.error(this.$t('lang.public_edit_success'));
          this.fetch_rightTable_list();
        } else {
          return false;
        }
      });
    },
    onCancelRightEdit() {
      this.hasEditColumn = false;
    },
    onEditLeft({ $index, row }) {
      this.updataEditStatus($index, true);
      this.editBDForm = {
        id: row.id,
        market: row.market,
        media: row.media,
        reach_goal:
          row.reach_goal_frequency +
          "+" +
          this.toPercentage(row.reach_goal_reach) +
          "%",
        // customer_cpm: row.customer_cpm,
        customer_cpm: row.customer_cpm.replace(/,/g, ""), //将111,111,11.0000转换为11111111.0000
        // media_cpm: row.media_cpm,
        media_cpm: row.media_cpm ? row.media_cpm.replace(/,/g, "") : "",
        // media_supply: row.media_supply,
        media_supply: row.media_supply.replace(/,/g, ""),

        supply_discount: row.supply_discount
      };
    },
    hasEditingLeft(opera){
      return this.hasEditing('left',opera);
    },
    hasEditingRight(opera){
      return this.hasEditing('right',opera);
    },
    hasEditing(type,opera){
      let has = this.hasEditColumn;
      if (type=='left') {
        has = this.hasEditLine;
      }
      if (has) {
        this.$message.error(this.$t('lang.AS_detail_basic_data_before_handle')+opera);
        return true;
      }else{
        return false
      }
    },
    onDelete(id) {
      if (this.hasEditingLeft(this.$t('lang.public_tooltip_delete'))) {
        return
      }
      this.$confirm(this.$t('lang.AS_detail_basic_data_delete_confirm'), this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      }).then(async () => {
        await this.fetchCore("/basicdata/delete", {
          id,
          project_id: this.projectID
        });
        this.$message.error(this.$t('lang.public_delete_success'));
        this.fetch_table_list();
      });
    },
    toPercentage(decimal) {
      if (decimal) {
        return math.eval(decimal + "*100") - 0;
      } else {
        return "";
      }
    },
    renderHeader(h, { column, $index }) {
      return (
        <span>
          {column.label}
          <i class="ico" onClick={this.clickHandler} domPropsInnerHTML="bar">
            #
          </i>
        </span>
      );
    },

    renderMediaHeader(h, { column, $index }) {
      // console.log("column", column);
      return h(
        "span",
        { style: "padding-left: 0px;margin-left: 25px;" },
        column.label
      );
    },

    clickHandler() {
      // console.log("clickHandler");
    },

    handleCreateSuccess(obj) {},
    handleEditProject() {},
    sortColumnChange({ prop, order }) {
      this.order = order == "ascending" ? "ASC" : "DESC";
      this.column = prop.toLowerCase();
      //发送请求，获取排序数据

      this.fetch_table_list();
    },
    sortColumnChangeRight({ prop, order }) {
      this.rightOrder = order == "ascending" ? "ASC" : "DESC";
      this.rightColumn = "market";
      //发送请求，获取排序数据

      this.fetch_rightTable_list();
    },
    async get_select_fornew_list() {
      let obj = await this.fetchCore("/basicdata/selectedalllist", {
        project_id: this.projectID
      });
      // debugger
      this.marketList = obj.market;
      this.mediaList = obj.media;
    },
    async get_select_forfilter_list() {
      let obj = await this.fetchCore("/basicdata/selectedsearchlist", {
        project_id: this.projectID
      });
      // debugger
      this.marketFilterList = obj.market;
      this.mediaFilterList = obj.media;
    },
    async get_media_list() {
      // this.fetchCore("/project/media",{id});
    },

    async fetch_table_list() {
      let param = {
        project_id: this.projectID,
        version:this.curVersion,
        media: this.mediaFilterValue,
        market: this.marketFilterValue,
        name: this.keywords,
        order: this.order,
        field: this.column
      };
      let data = await this.fetchCore("/basicdata/lists", param);
      this.tableData = data;

      // this.total = Number.parseInt(res.total);
    },

    addLeftLine() {
      this.showNewLine = true;
      this.resetNewLine();
    },
    //to do
    addRightLine() {
      this.showRightNewLine = true;
      this.newRightForm = {
        market: "",
        data: ""
      };
    },
    //to do
    saveNewRightLine() {
      this.$refs["newRightForm"].validate(async valid => {
        if (this.validateRightNewFormat(this.newRightForm) && valid) {
          if (!this.hasEditingRight(this.$t('lang.public_add'))) {
            if (this.rightTableType == "goalcpm") {
              this.fetchNewGoalCpm();
            } else {
              this.fetchNewReachGoal();
            }
          }
        } else {
          return false;
        }
      });
    },
    //to do
    cancelNewRightLine() {
      this.showRightNewLine = false;
    },
    saveNewLeftLine() {
      this.$refs["form"].validate(async valid => {
        if (this.validateFormat(this.form) && valid) {
          let param = this.formatParam(this.form);
          if (!this.enableMediaCpm) {
            delete param.media_cpm;
          }
          if (!this.hasEditingLeft(this.$t('lang.public_add'))) {
            let data = await this.fetchCore("/basicdata/add", param);
            this.showNewLine = false;
            this.$message.error(this.$t('lang.public_add_success'));
            this.fetch_table_list();
          }
        } else {
          return false;
        }
      });
    },
    cancelNewLine() {
      this.showNewLine = false;
    },
    validateRightNewFormat(form) {
      let market = form.market;
      if (!market) {
        this.$message.error(this.$t('lang.reg_market_required'));
        return false;
      }
      let val = _.trim(form.data);
      if (this.rightTableType == "goalcpm") {
        if (!this.$constReg.positiveInt.test(val)) {
          this.$message.error(this.$t('lang.reg_target_CPM_incorrect'));
          return false;
        }
      } else {
        if (!Reach_goal_reg.test(val)) {
          this.$message.error(this.$t('lang.reg_reach_goal_incorrect'));
          return false;
        }
      }
      return true;
    },
    validateRightFormat(form) {
      let values = Object.values(form);
      for (const item of values) {
        let _item = _.trim(item);
        if (this.rightTableType == "goalcpm") {
          if (!this.$constReg.positiveInt.test(_item)) {
            this.$message.error(this.$t('lang.reg_target_CPM_incorrect'));
            return false;
          }
        } else {
          if (!Reach_goal_reg.test(_item)) {
            this.$message.error(this.$t('lang.reg_reach_goal_incorrect'));
            return false;
          }
        }
      }
      return true;
    },
    validateFormat(form) {
      let which_form = _.cloneDeep(form);
      //判断必输
      if (which_form.media == "") {
        this.$message.error(this.$t('lang.reg_media_required'));
        return false;
      } else if (which_form.market == "") {
        this.$message.error(this.$t('lang.reg_market_required'));
        return false;
      } /*  else if (which_form.reach_goal == "") {
        this.$message.error("[Reach Goal]为必填项!");
        return false;
      }  */ else if (
        which_form.customer_cpm == ""
      ) {
        this.$message.error(this.$t('lang.reg_CPM_unit_cost_for_client_required'));
        return false;
      } else if (which_form.media_supply == "") {
        this.$message.error(this.$t('lang.reg_CPM_nit_cost_for_media_required'));
        return false;
      } else if (which_form.supply_discount == "") {
        this.$message.error(this.$t('lang.reg_inventory_discount_required'));
        return false;
      }

      //判断格式
      /* if (!Reach_goal_reg.test(which_form.reach_goal)) {
        this.$message.error("Reach Goal格式不正确，例:4+30%");
        return false;
      } */

      if (which_form.media_cpm != "") {
        if (
          !new RegExp(/^([^0][0-9]{0,11}|0)(\.([0-9]{1,4}))?$/).test(
            which_form.media_cpm
          )
        ) {
          this.$message.error(
            this.$t('lang.reg_media_cpm_error_msg')
          );
          return false;
        }
      }

      if (
        !new RegExp(/^([^0][0-9]{0,11}|0)(\.([0-9]{1,4}))?$/).test(
          which_form.customer_cpm
        )
      ) {
        this.$message.error(
          this.$t('lang.reg_client_cpm_error_msg')
        );
        return false;
      }

      if (
        !new RegExp(/^([^0][0-9]{0,15}|0)(\.([0-9]{1,4}))?$/).test(
          which_form.media_supply
        )
      ) {
        this.$message.error(
          this.$t('lang.reg_media_inventory_error_msg')
        );
        return false;
      }

      if (
        Number.parseFloat(which_form.supply_discount) < 0 ||
        Number.parseFloat(which_form.supply_discount) > 1
      ) {
        this.$message.error(this.$t('lang.reg_inventory_discount_between'));
        return false;
      }
      return true;
    },

    resetNewLine() {
      this.form = {
        market: "",
        media: "",
        reach_goal: "",
        customer_cpm: "",
        media_cpm: "",
        media_supply: "",
        supply_discount: ""
      };
    },

    refresh() {
      this.fetch_table_list();
      // this.fetch_rightTable_list();
    },

    setRightTableTypeByFetch(data) {
      //data.bd_name
      // data.tc_name;
      // data.rg_name;
      let type = "reachgoal";
      if (data.rg_name) {
        type = "reachgoal";
      } else if (data.tc_name) {
        type = "goalcpm";
      }

      this.rightTableType = type;
      this.rightTableType_ = type;
    },
    async fetchNewGoalCpm() {
      let param = {
        project_id: this.projectID
      };
      param.goal_cpm = this.newRightForm.data;
      param.market = this.newRightForm.market;
      await this.fetchCore("/goalcpm/add", param);
      this.showRightNewLine = false;
      this.fetch_rightTable_list();
    },
    getMarketById(id){
      let obj = this.rightTableData.find(i=>i.id==id);
      if (obj) {
        return obj.market;
      }else{
        return;
      }
    },
    async fetchEditGoalCpm(obj) {
      let param = {
        project_id: this.projectID
      };
      let rs = [];
      let keys = Object.keys(obj);
      for (const key of keys) {
        let goal_cpm = obj[key];
        let market = this.getMarketById(key);
        let tem = {
          id: key,
          goal_cpm,
          market
        };
        rs.push(tem);
      }
      param.data = rs;
      let data = await this.fetchCore("/goalcpm/edit", param);
    },
    getReachGoal(rgStr) {
      let arr = rgStr.split("+");
      let rg_frequency = arr[0];
      let rg_reach = arr[1].substr(0, arr[1].length - 1);
      rg_reach = math.eval(rg_reach + "/100") - 0;
      return [rg_frequency, rg_reach];
    },
    //
    async fetchNewReachGoal() {
      let [reach_goal_frequency, reach_goal_reach] = this.getReachGoal(
        this.newRightForm.data
      );
      let param = {
        project_id: this.projectID,
        market: this.newRightForm.market,
        reach_goal_frequency,
        reach_goal_reach
      };
      await this.fetchCore("/reachgoal/add", param);
      this.showRightNewLine = false;
      this.fetch_rightTable_list();
    },
    //右侧表格的编辑的ajax
    async fetchEditReachGoal(obj) {
      let param = {
        project_id: this.projectID
      };
      let rs = [];
      let keys = Object.keys(obj);
      for (const key of keys) {
        let [reach_goal_frequency, reach_goal_reach] = this.getReachGoal(
          obj[key]
        );
        // let _val = obj[key].split('+');
        // let reach_goal_frequency = _val[0];
        // let reach_goal_reach = _val[1].substr(0,_val[1].length-1);
        let market = this.getMarketById(key);

        let tem = {
          id: key,
          reach_goal_frequency,
          reach_goal_reach,
          market
        };
        rs.push(tem);
      }
      param.data = rs;
      let data = await this.fetchCore("/reachgoal/edit", param);
    },
    async deleteRightList() {
      let param = {
        project_id: this.projectID
      };
      let data = await this.fetchCore(this.rightListDelUrl, param);
      return data;
    },
    //获取右侧表当前的类型  reach goal 或者 goal cpm
    async getFileName() {
      let param = {
        project_id: this.projectID,
        version:this.curVersion
      };
      let data = await this.fetchCore("/basicdata/getfilename", param);

      this.setRightTableTypeByFetch(data);
      return data;
    },
    // 获取右侧表格list数据
    async fetch_rightTable_list() {
      let param = {
        project_id: this.projectID,
        version:this.curVersion,
        market: this.marketFilterValue,
        // name: this.keywords,
        order: this.rightOrder,
        field: this.rightColumn
      };
      let list = await this.fetchCore(this.rightListUrl, param);
      /* 目标cpm
      [
        {
          id: 1,
          goalcpm: 1,
          market: "dd"
        },
        {
          id: 1,
          goalcpm: 1,
          market: "dd"
        }
      ]; */
      /* reach goal
      [
        {
          id: 1,
          reach_goal_frequency:1
          reach_goal_reach:0.6
          market: "dd"
        },
        {
          id: 1,
          reach_goal_frequency:1
          reach_goal_reach:0.6
          market: "dd"
        }
      ]; */
      this.rightTableData = list;
      // this.setRightRules();
      return list;
    },
    // 删除右侧表的一行
    async onDeleteRight(id) {
      if (this.hasEditColumn) {
        this.$message.error(this.$t('lang.AS_detail_basic_data_before_delete'));
        return;
      }
      this.$confirm(this.$t('lang.AS_detail_basic_data_delete_confirm'), this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      }).then(async () => {
        await this.fetchCore(this.rightDeleteUrl, {
          id,
          project_id: this.projectID
        });
        this.$message.error(this.$t('lang.public_delete_success'));
        this.fetch_rightTable_list();
      });
      // let param = {project_id: this.projectID,id};
      // let obj = await this.fetchCore("/basicdata/selectedsearchlist", param);
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
    async onSubmit() {
      await this.fetchCore("/basicdata/checkdata", {
        project_id: this.projectID
      });
      this.onClose();
    },
    onClose() {
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
    }
  }
};
</script>
<style scoped>
/*本地部分*/
.box {
  box-sizing: border-box;
  height: 100%;
}
.head {
  padding: 10px;
}

.select {
  width: 110px;
  margin: 0 10px 0 0;
}
.small-head {
  /* font-size: 0; */
  height: 36px;
}
.small-head .item {
  /* display: inline-block; */
  float: left;
  font-size: 14px;
  margin-bottom: 8px;
}
.small-head .left {
  /* width: 899px; */
  width: 905px;
  margin-right: 4px;
  margin-left: 10px;
}
.table-wrap {
  height: calc(100% - 48px - 36px);
}
.table-wrap.only-read {
  height: calc(100% - 48px);
}
.right-edit {
  font-size: 16px;
  cursor: pointer;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
<style>
.basic-data .el-form-item__content {
  line-height: initial;
}
.basic-data .BD-button-small-padding > i {
  font-size: 16px;
}
.basic-data .BD-button-small-padding {
  padding: 4px 7px;
  vertical-align: top;
}
.basic-data .change-type,
.basic-data .change-type .el-input--mini {
  padding: 0;
}
.basic-data .change-type .el-input--mini input.el-input__inner {
  /* padding-right: 15px;
  padding-left: 3px; */
  padding-left: 3px;
  padding-right: 15px;
  text-align: center;
}
.basic-data .change-type .el-input--mini .el-input__icon {
  width: 14px;
}
.basic-data .change-type .el-input--mini .el-input__suffix {
  right: 2px;
}
.basic-data .change-type .el-input.el-input--mini.el-input--suffix {
  line-height: initial;
}
/*全局部分*/
</style>