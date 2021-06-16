<template>

  <el-table-column :prop="columnData[props.field]"
      class-name='hy-small-table-cell-padding'
      :label="columnData.name"
      :show-overflow-tooltip="true"
      min-width="260px"
      :render-header='renderEditHeader'>
    <el-table-column :label="$t('lang.AS_detail_initial_value')"
        :class-name='writable?"hy-small-table-cell-padding9":""'
        min-width="160">
      <template slot-scope="scope">
        <el-form-item :prop="scope.row.id"
            v-if="writable">
          <el-input class="hy-small-padding-input"
              style="width:100px;"
              size="mini"
              v-model="form[scope.row.id]">
          </el-input>
        </el-form-item>
        <span v-else>{{$formatNumber(scope.row[columnData[props.field]],4,'')}}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('lang.public_tooltip_scored')"
        min-width="160">
      <template slot-scope="scope">
        <span style="color:#42a996">{{$formatNumber(scope.row[columnData[props.field]+'_score'],4,'')}}</span>
      </template>
    </el-table-column>
  </el-table-column>
</template>

<script>
import math from "mathjs";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import theme from '@/views/mixin/theme/remind-text.vue'

export default {
  name: "reach-curve-table-column",
  components: {},
  inject: ["userOperateStatus", "loading"],
  mixins: [theme],
  props: {
    props: {
      type: Object,
      required: false,
      default: function() {
        return {
          field: "field",
          name: "name",
          percent: "percent",
          status: "status"
        };
      }
    },
    notEqual100: {
      type: Boolean,
      required: true
    },
    columnData: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    isLast: {
      type: Boolean,
      required: true
    },
    hasOnlyOne: {
      type: Boolean,
      required: true
    },
    operateStatus: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      rules: {},
      // isNew: false, //是否是新建页面
      writable: false //是否是可写状态 true:是  false：否
    };
  },

  computed: {
    ...mapState("project", ["projectID"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    isNew() {
      return this.columnData[this.props.field] == "new_d";
    },
    hasOverLappingBtn() {
      // let arr = [this.$t('lang.public_table_monthly_unique_devices_zh'), this.$t('lang.public_table_monthly_unique_devices_en')];
      let arr = ['月覆盖设备数（万）', '月覆盖设备数(万)','Monthly Unique Devices（10K）','Monthly Unique Devices(10K)'];
      let name = this.columnData[this.props.name];
      // console.log(arr.indexOf(name) != -1);
      return arr.indexOf(name) != -1;
    }
  },
  watch: {},
  created() {
    if (this.isNew) {
      this.writable = true;
    }
    // console.log('c--',this.columnData[this.props.field])
  },
  mounted() {},
  methods: {
    ...mapActions("project", ["update_project_id", "updata_preview_log_step_status"]),
    //column:列对象object   $index:列号 从0开始
    renderEditHeader(h, { column, $index }) {
      // console.log(column, $index);
      // console.log(h)
      //console.log("renderEditHeader");
      if (this.writable) {
        return h("div", { class: "hy-tabel-head" }, [
          h("el-form-item", {
            props: {
              prop: "name"
            },
            scopedSlots: {
              default: props =>
                h("el-input", {
                  class: "hy-mini-input",
                  style: "width:110px;",
                  props: {
                    size: "mini",
                    disabled: this.columnData.is_special,
                    value: this.form["name"]
                  },
                  attrs: {
                    placeholder: this.$t('lang.public_project_name')
                  },
                  domProps: {},
                  on: {
                    input: val => {
                      this.form["name"] = val;
                    }
                  }
                })
            }
          }),
          h("el-form-item", {
            props: {
              prop: "percent"
            },
            scopedSlots: {
              default: props =>
                h(
                  "el-input",
                  {
                    class: "hy-mini-input",
                    style: "width:60px;",
                    props: {
                      size: "mini",
                      value: this.form["percent"]
                    },
                    attrs: {
                      placeholder: "%"
                    },
                    on: {
                      input: val => {
                        this.form["percent"] = val;
                      }
                    }
                  },
                  [
                    h(
                      "template",
                      {
                        slot: "append"
                      },
                      "%"
                    )
                  ]
                )
            }
          }),

          h("el-button", {
            on: {
              click: this.clickConfirmBtn
            },
            props: {
              icon: "el-icon-check",
              size: "mini"
            }
          }),
          h("el-button", {
            on: {
              click: this.clickCancelBtn
            },
            props: {
              icon: "el-icon-close",
              size: "mini",
              plain: true
            }
          })
        ]);
      } else {
        let percent = this.columnData[this.props.percent];
        if (percent) {
          percent = math.eval(percent + "*100") - 0 + "%";
        } else {
          percent = "";
        }
        return h(
          "div",
          {
            class: "hy-tabel-head"
          },
          [
            //math.eval(p + "*100") - 0
            h(`span`, {
              style: "display: inline-block;max-width: 190px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;",
              domProps: {
                title: this.columnData[this.props.name]
              }
            }, this.columnData[this.props.name]),
            h("span", {
              // style: this.notEqual100?"color: #fee01a;":""
              style: this.notEqual100? this.remind_text:""
            }, percent),
            this.enableWriteCreateProject?h("i", {
              domProps: {
                title: this.$t('lang.public_tooltip_ascending_order')
              },
              on: {
                click: this.clickSortBtn.bind(this, 1)
              },
              class: {
                // "icon-up": true,
                "iconfont icon-sort-up": true,
                active: this.columnData[this.props.status] == 1
              },
              style: "vertical-align: middle;cursor: pointer;"
            }):'',
            this.enableWriteCreateProject?h("i", {
              domProps: {
                title: this.$t('lang.public_tooltip_descending_order')
              },
              on: {
                click: this.clickSortBtn.bind(this, -1)
              },
              class: {
                // "icon-down": true,
                "iconfont icon-sort-down": true,
                active: this.columnData[this.props.status] == -1
              },
              style: "vertical-align: middle;cursor: pointer;"
            }):'',
            this.enableWriteCreateProject?h("i", {
              class: "iconfont icon-list-edit",
              style: "vertical-align: middle;cursor: pointer;",
              domProps: {
                title: this.$t('lang.public_tooltip_edit')
              },
              on: {
                click: this.clickEditBtn
              }
            }):"",
            !this.enableWriteCreateProject?"":this.hasOnlyOne
              ? ""
              : this.columnData.is_special
                ? ""
                : h("i", {
                    class: "iconfont icon-trash",
                    style: "vertical-align: middle;cursor: pointer;",
                    domProps: {
                      title: this.$t('lang.public_tooltip_delete')
                    },
                    on: {
                      click: this.clickDeleteBtn
                    }
                  }),
            !this.enableWriteCreateProject?"":this.hasOverLappingBtn
              ? h(
                  "el-upload",
                  {
                    style: "display:inline-block;padding:0px",
                    props: {
                      accept:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
                      data: { project_id: this.projectID },
                      action: "/api/overlapping/importoverlapping",
                      showFileList: false,
                      onSuccess: this.onUploadSuccess,
                      onError: this.onUploadError,
                      beforeUpload: this.onbeforeUpload
                    }
                  },
                  [
                    h("i", {
                      domProps: {
                        title: "Overlapping Data上传"
                      },
                      // class: "icon-upload",
                      class: "iconfont icon-export",
                      style: ""
                    })
                  ]
                )
              : "",
            !this.enableWriteCreateProject?"":this.isLast
              ? h("i", {
                  domProps: {
                    title: this.$t('lang.public_tooltip_add')
                  },
                  class: "iconfont icon-add",
                  style: "vertical-align: middle;cursor: pointer;margin-left:5px",
                  on: {
                    click: () => this.clickAddBtn()
                  }
                })
              : ""
          ]
        );
      }
    },
    onUploadSuccess(res, file, fileList) {
      if (res && res.ret == 0) {
        this.$message.success(this.$t('lang.public_upload_success'));
        this.updata_preview_log_step_status();
        this.$dispatch("ScoreCard", "REFRESH");
      } else {
        this.$message.error(res.msg || this.$t('lang.public_upload_fail'));
      }
      this.loading(false);
    },
    onUploadError(err, file, fileList) {
      // console.log("onUploadError");
      this.loading(false);
    },
    onbeforeUpload(file) {
      this.loading(true);
      // console.log("onbeforeUpload");
    },
    checkUserOperate(msg = "") {
      if (this.operateStatus) {
        switch (this.operateStatus) {
          case "Editing":
            msg = this.$t('lang.AS_detail_score_card_editing') + msg + this.$t('lang.AS_detail_score_card_finish_editing');
            break;
          case "Newing":
            msg = this.$t('lang.AS_detail_score_card_adding') + msg + this.$t('lang.AS_detail_score_card_finish_adding');
            break;
          default:
          //n 与 case 1 和 case 2 不同时执行的代码
        }
        this.$message.error(msg);
        return false;
      } else {
        return true;
      }
    },
    clickSortBtn(type) {
      let msg = this.$t('lang.public_tooltip_ascending_order');
      if (type == -1) {
        msg = this.$t('lang.public_tooltip_descending_order');
      }
      this.columnData[this.props.sort] == type;
      if (this.checkUserOperate(this.$t('lang.public_unable_to') + msg + ",")) {
        let id = this.columnData[this.props.field];
        this.$dispatch("ScoreCard", "SORT-COMPUTE", { id, type });
      }
    },

    // clickSortBtn2(e, _type) {
    //   let type = _type;
    //   return () => {
    //     // console.log('type==',type)
    //     let msg = "升序";
    //     if (type == -1) {
    //       msg = "降序";
    //     }
    //     if (this.checkUserOperate("无法进行" + msg + "计算,")) {
    //       let id = this.columnData[this.props.field];
    //       this.$dispatch("ScoreCard", "SORT-COMPUTE", { id, type });
    //     }
    //   };
    // },

    clickDeleteBtn() {
      if (this.checkUserOperate(`${this.$t('lang.public_unable_to')}${this.$t('lang.public_tooltip_delete')} , `)) {
        let field = this.columnData[this.props.field];
        this.$dispatch("ScoreCard", "DELETE", { field });
      }
    },
    //点击添加按钮
    clickAddBtn() {
      if (this.checkUserOperate()) {
        this.$dispatch("ScoreCard", "ADD");
      }
    },
    //点击头部的编辑按钮
    clickEditBtn() {
      // console.log("--", this.checkUserOperate());
      if (this.checkUserOperate()) {
        let field = this.columnData[this.props.field];
        this.$dispatch("ScoreCard", "EDIT", { field });
        this.writable = true;
      }
    },
    //点击头部的确认按钮
    clickConfirmBtn() {
      let field = this.columnData[this.props.field];
      let event = "CONFIRM-EDIT";
      if (this.isNew) {
        event = "CONFIRM-ADD";
      }
      let _resolve = "";
      let _reject = "";
      let _promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });
      _promise
        .then(r => {
          this.writable = false;
        })
        .catch(e => {
          console.error(e);
        });

      this.$dispatch("ScoreCard", event, { field, _resolve, _reject });
    },
    //点击头部的取消按钮
    clickCancelBtn() {
      this.writable = false;
      let field = this.columnData[this.props.field];
      let event = "CANCEL-EDIT";
      if (this.isNew) {
        event = "CANCEL-ADD";
      }
      this.$dispatch("ScoreCard", event, { field });
    }
  }
};
</script>
<style scoped>
</style>
<style>
.score-card .sort-btn-active {
  color: #42a996;
}
.score-card .icon-upload,
.score-card .icon-edit,
.score-card .icon-delete {
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-left: 5px;
}
.score-card .icon-sort-up,
.score-card .icon-sort-down {
  width: 12px;
  height: 12px;
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  /* border: 1px solid ; */
}

.score-card .icon-upload {
  background: url("~@/assets/image/project/upload-overlapping.png");
  vertical-align: text-top;
}
.score-card .icon-edit {
  background: url("~@/assets/image/project/edit-small.png");
}
.score-card .icon-delete {
  background: url("~@/assets/image/project/trash-small.png");
}
.score-card .icon-down,
.score-card .icon-up {
  width: 12px;
  height: 12px;
  display: inline-block;
}
/* .score-card .icon-down {
  background: url("~@/assets/image/project/down.png");
}
.score-card .icon-down.active {
  background: url("~@/assets/image/project/down-active.png");
} */
.score-card .icon-sort-down {
  /* background: url("~@/assets/image/project/down.png"); */
  color: #fff;
  border-color: #fff;
}
.score-card .icon-sort-down.active {
  /* background: url("~@/assets/image/project/down-active.png"); */
  color: rgb(66, 169, 150);
  border-color: rgb(66, 169, 150);
}
/* .score-card .icon-up {
  margin-left: 2px;
  background: url("~@/assets/image/project/up.png");
}
.score-card .icon-up.active {
  background: url("~@/assets/image/project/up-active.png");
} */
.score-card .icon-sort-up {
  margin-left: 2px;
  color: #fff;
  border-color: #fff;
}
.score-card .icon-sort-up.active {
  color: rgb(66, 169, 150);
  border-color: rgb(66, 169, 150);
}
.score-card .hy-small-table-cell-padding9 {
  padding-top: 9px;
  padding-bottom: 9px;
}
</style>