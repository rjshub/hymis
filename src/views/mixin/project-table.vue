<script>

export default {
    components: {},
    data() {
        return {

        };
    },
    watch: {},
    methods: {
        set_list_class(index) {
            // 设置列表斑马纹
            if (index === 0) {
                return 'light-sub-list'
            } else if (index === 1) {
                return 'dark-sub-list'
            } else {
                if (index%2 === 0) {
                    return 'light-sub-list'
                } else {
                    return 'dark-sub-list'
                }
            }
        }
    },
    mounted() {},
    }
</script>
<style lang='scss' scoped>
</style>