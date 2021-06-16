<template>
  <hy-dialog :visible="isShow"
    @update:visible='onUpdateVisible'
    custom-class='user-detail'
    v-loading='isLoading'
    width='470px'
    :title="$t('lang.system_user_detail_title')">

    <div class="box detail-container">
      <dl>
        <dd>
          <span>{{$t('lang.system_user_name_label')}}：</span>
          <span class="text">{{form.username}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.system_user_role_name_label')}}：</span>
          <span class="text">{{form.role_name}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.system_user_true_name_label')}}：</span>
          <span class="text">{{form.truename}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.system_user_phone_label')}}：</span>
          <span class="text">{{form.phone}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.system_user_email_label')}}：</span>
          <span class="text">{{form.email}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.system_user_account_status_label')}}：</span>
          <span v-if='form.status==1' class="hy-font-green">{{$t('lang.public_tooltip_on')}}</span>
          <span v-else class="hy-font-yellow">{{$t('lang.public_tooltip_off')}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.system_user_last_login_label')}}：</span>
          <span class="text">{{form.last_login_time}}</span>
        </dd>
      </dl>
    </div>

    <div slot="footer">
      <el-button plain
        @click="onClose">{{$t('lang.public_close')}}</el-button>
    </div>
  </hy-dialog>
</template>

<script>
import _ from "lodash";
import fetch from "@/services/fetch";
export default {
  name: "UserDetail",
  componentName: "UserDetail",
  components: {},
  props: {
    isShow: {
      type: [Boolean],
      required: true
    },
    id: {
      //该值为空，表示新建，否则为编辑
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      form:{},
    };
  },

  computed: {},
  watch: {},
  created() {},

  mounted() {
    this.fetchGetInfo();
  },
  methods: {
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    },
    onClose() {
      this.$emit("update:isShow", false);
    },
    async fetchGetInfo() {
      try {
        let uid = this.id;
        this.isLoading = true;
        let data = await fetch.post("/user/userdetail", { uid });
        if (_.isPlainObject(data)) {
          this.form = data;
        }else{
          // this.$message.error('服务端返回数据格式错误，不是一个对象');
        }
        
        this.isLoading = false;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      }
      return;
    }
  }
};
</script>
<style scoped>
.box {
  font-size: 12px;
  padding: 30px 20px 20px 20px;
  color: #aaa9af;
  height: calc(100% - 50px);
}
dd {
  padding: 3px 0;
}
dd:last-child{
  padding-bottom:0;
}
dd > span{
  padding-left: 6px;
}
dd>span:nth-child(1) {
  display: inline-block;
  width: 95px;
  text-align: right;
}
.box .text {
  color: #f8fdff;
}
</style>
<style>
</style>