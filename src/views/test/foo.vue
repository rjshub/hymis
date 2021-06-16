<template>
  <div style="background: black;color:#fff">
    <p >按钮 </p>

    <p>
      成功按钮ico（mini）：
      <el-button size="mini" icon="el-icon-share"></el-button>
    </p>
    <p>
      成功按钮（mini）：
      <el-button size="mini" icon="el-icon-share">成功按钮（mini）</el-button>
    </p>
    <p>
      取消按钮plain（mini）：
      <el-button size="mini" plain icon="el-icon-share">取消按钮plain（mini）</el-button>
    </p>

    <p>
      ico（默认）添加small-padding：
    <el-button icon="el-icon-share" class="hy-button-small-padding"></el-button>
    </p>
    <p>
      ico（默认）：
    <el-button icon="el-icon-share"></el-button>
    </p>
    <p>
      成功按钮（默认）：
    <el-button icon="el-icon-share">成功按钮（默认）</el-button>
    </p>
    <p>
      显示弹窗plain（默认）：
    <el-button plain
      @click="dialogVisible=true">显示弹窗plain（默认）</el-button>
    </p>

    <hr>

    <el-input v-model="form.name" placeholder="请输入内容"></el-input>
    <el-input v-model="form.age" placeholder="请输入内容"></el-input>


    <hy-dialog 
      custom-class='testClass'
      :visible.sync="dialogVisible"
      :title="title"
      :lazy-load='false'
      :show-close='true'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @open="onOpen"
      @closed="onClosed"
      @close='onClose'>
      <div>为什么的第三方风扇飞</div>
      <div>为什么的第三方风扇飞</div>
      <div>为什么的第三方风扇飞</div>
      <div slot="footer">
        <el-button plain
          @click="dialogVisible = false">取消</el-button>
        <el-button @click="dialogVisible = false">重传</el-button>
        <el-button @click="dialogVisible = false">重传</el-button>
        <el-button @click="dialogVisible = false">重传</el-button>
      </div>
    </hy-dialog>
    
    <el-select v-model="media"
        multiple 
        style="margin:10px"
        ref='mayue'
        size="mini"
        placeholder="请选择媒体">
        <el-option 
          key="item.value"
          label="item.label"
          value="item.value">
          <div>3443</div>
          <div>3443</div>
          <div>3443</div>
        </el-option>
      </el-select>

      <el-input class="hy-mini-input"
          style="width:100px;"
          ref="baseNum"
          size="mini"
          placeholder="基数" >
          <template slot="append">%</template>
      </el-input>
      <!-- <reach-curve /> -->
      <!-- <component-table /> -->
  </div>

</template>
<script>

import scoreCard from "@/views/project/create/score-card";
import reachCurve from "@/views/project/create/reach-curve";
import componentTable from "@/views/project/create/component-table";
export default {
  name: "foo",
  components: {reachCurve,scoreCard,componentTable},
  data() {
    return {
      media:[],
      form:{
        name:11,
        age:'mayue'
      },
      activeName: 'second',
      title: "标题",
      showDialoger: false,
      dialogVisible: false
    };
  },
  watch: {
    name_c(n,o){
      console.log(n,o)
    }
  },
  computed: {
    name_c(){
      return this.form.name;
    },
  },
  mounted() {
    this.$refs.mayue.visible=true;
  },
  methods: {
    
    handleClick(tab, event) {
        console.log(tab, event);
      },
    onOpen() {
      console.log("foo-onOpen");
    },
    onClose() {
      console.log("foo-onClose");
    },
    onClosed() {
      console.log("foo-onClosed");
    },
    handleClose(done) {
      done();
    },
    open() {
      this.$alert("这是一段内容", "标题名称", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    }
  },
  
};
</script>
<style>
/* #app {
  background: black;
  padding: 100px;
} */
</style>
<style scoped>
p{
  margin:4px;
}
</style>

