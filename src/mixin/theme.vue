<script>
import { mapState, mapActions } from 'vuex'

export default {
    components: {},
    data() {
        return {

        };
    },
    computed: {
        ...mapState("theme", ["nowThemeInfo"]),
    },
    methods: {
        ...mapActions('theme', ["update_now_theme_info"]),
    },
    }
</script>
<style lang='scss' scoped>
</style>