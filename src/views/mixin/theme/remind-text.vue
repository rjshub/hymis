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
        remind_text() {
            if (this.nowThemeInfo === "default-theme") {
                return 'color: #f56c6c'
            } else {
                return "color: #fee01a"
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