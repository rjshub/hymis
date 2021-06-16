<template>
    <div class="menu-group">
        <slot></slot>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "mis-menu-group",
  componentName: "rootMenuButton",
  data() {
    return {
      activeMenus: []
    };
  },
  props: {
    defaultActive: {
      type: String,
      required: false
    }
  },

  watch: {
    defaultActive: {
      handler: function(val) {
        this.activeMenus = [];
        this.activeMenus.push(this.defaultActive);
      },
      deep: true,
      immediate: true
    }
  },
  provide() {
    return {
      rootMenu: this
    };
  },

  methods: {
    /*...mapMutations('模块名称', [
      'mutation名称'
    ]),
    
    ...mapActions('模块名称', [
      'action名称'
    ]),*/
    handleItemClick(name) {
      this.activeMenus = [];
      this.activeMenus.push(name);
    }
  },

  created() {
    //初始化,无法操作dom
  },

  mounted() {
    this.$on("item-click", this.handleItemClick);
    this.$on("item-hover", () => {
      for (let item of this.$children) {
        item.isHover = false;
      }
    });

    this.activeMenus = [];
    this.activeMenus.push(this.defaultActive);
  },

  components: {
    //子组件
  }
};
</script>
<style scoped>
/*本地部分*/
.menu-group {
  margin-top: 30px;
  margin-left: 20px;
}

@media screen and (max-height: 900px) {
  .menu-group {
    transform: scale(0.9);
    transform-origin: 50% 0;
  }
}
</style>
<style>
/*全局部分*/
</style>