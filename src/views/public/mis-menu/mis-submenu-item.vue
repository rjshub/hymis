<template>
    <div class="mis-submenu-item"
        @click="goto"
        :class="{active:isActive}">
        <slot></slot>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "mis-submenu-item",
  data() {
    return {
    };
  },
  props: {
    index: {
      type: String,
      required: false
    },
    hash: {
      type: String,
      required: false
    }
  },
  computed: {
    isActive() {
      return this.groupMenu.activeSubMenus.includes(this.index);
    },
  },
 
  inject: ["groupMenu"],

  methods: {
    goto() {
      if (this.index) {
        this.$router.push({ path: this.index });
        this.$dispatch("groupMenuButton", "item-click", this.index);
      }else{
        if (this.hash) {
           let url = window.location.origin+'/#'+this.hash;
          //  console.log("TCL: goto -> url", url)
           window.open(url,'exMis')
        }
       
      }
      
    }
  },

  created() {
  },

  mounted() {
  },

  components: {
    //子组件
  }
};
</script>
<style scoped>
.mis-submenu-item {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  text-align: center;
  padding: 5px;
  border-bottom: 1px solid black;
  color: #fff;
  cursor: pointer;
}

.mis-submenu-item:hover {
  background-color: #40ab97;  /*(背景调换)未找到界面*/
}

.mis-submenu-item.active {
  background-color: #255554;   /*(背景调换)未找到界面*/
}
</style>
<style>
/*全局部分*/
</style>