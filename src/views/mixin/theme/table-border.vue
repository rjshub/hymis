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
        table_border() {
            if (this.nowThemeInfo === "default-theme") {
                return true
            } else {
                return false
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