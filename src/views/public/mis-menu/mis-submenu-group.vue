<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "mis-submenu-group",
  componentName: "groupMenuButton",
  data() {
    return {
      activeSubMenus: [],
    };
  },
  props: {
    values: {
      type: Object,
      required: false
    }
  },

  computed: {
    rootMenu() {
      return this.$route.path.split('/')[1];
    }
  },

  watch: {
    rootMenu: {
      handler: function(val) {
        if(!this.isMathSubMenu()){
          this.activeSubMenus = [];
        }
      },
      deep: true,
      immediate: true
    }
  },

  provide() {
    return {
      groupMenu: this
    };
  },

  methods: {
    handleItemClick(name) {
			// console.log('TCL: handleItemClick -> name', name)
      this.activeSubMenus = [];
      this.activeSubMenus.push(name);
      //this.$dispatch("misMenuItem", "hide-subMenu");
    },
    isMathSubMenu(){
      return this.activeSubMenus.every((item)=>{
        return item.split("/")[1]==this.rootMenu;
      });
    }
  },

  created() {
    this.$on("item-click", this.handleItemClick);
  },

  mounted() {
  },

  components: {
    //子组件
  }
};
</script>
<style scoped>
/*本地部分*/
</style>
<style>
/*全局部分*/
</style>