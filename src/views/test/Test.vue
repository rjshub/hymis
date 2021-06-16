<script>
  export default {
    name: 'el-test',
    prop: ['age'],
    data() {
      return {
        msg: 'el-test'
      }
    },
    render (h) {
      return (
        <div>{this.msg}</div>
      )
    }
  }
</script>


