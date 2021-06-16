<script>
import { mapState } from 'vuex';

export default {
    components: {},
    data() {
        return {
        };
    },
    computed: {
        ...mapState("theme",["nowThemeInfo"]),
        tooltip_effect() {
            if (this.nowThemeInfo === "default-theme") {
                return 'light'
            } else {
                return "dark"
            }
        }
    },
    methods: {},
    mounted() {
    },
    }
</script>
<style lang='scss' scoped>
</style>