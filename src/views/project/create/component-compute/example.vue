<template>
    <hy-dialog :visible.sync="isVisible"
        custom-class='operate-guide'
        :title="$t('lang.public_operation_manual')"
        width="500px"
        :show-close="true"
        @close="onClose"
        :close-on-click-modal="false">
        {{$t('lang.public_example')}}

        <div class="clearfix"
            style="margin: 20px;">
            <div class="pull-right">
                <el-button @click="onClose"
                    plain>{{$t('lang.public_button_cancel')}}</el-button>
                <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
            </div>
        </div>
    </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "basic-info",
  data() {
    return {
      isVisible: true,
      isLoading: false,


    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    isReady() {
      return false; //必须有返回
    }
  },
  watch: {
    isShow: {
      handler: function(val) {
        this.isVisible = this.isShow;
      },
      deep: true
    }
  },

  methods: {

    onClose() {
      this.$emit("update:isShow", false);
      this.$emit("cancel");
    }
  },

  mounted() {

  },

  components: {
    //子组件
  }
};
</script>
<style scoped>
.project-create-form {
  margin: 40px;
}
</style>
<style>
.project-create-form .el-form-item__label {
  color: #fff;
  opacity: 0.6;
}
.project-create-form .age-start .el-input,
.project-create-form .age-end .el-input {
  display: inline-block;
  width: 90px;
}
</style>