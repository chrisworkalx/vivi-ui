<script>
export default {
  methods: {
    onClick() {
      alert('11');
    },
    handleClick() {
      console.log('hello--my-button');
    }
  },
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>保存</button>
      </div>
    );
  }
};
</script>

<style>
button {
  color: blue;
}
</style>
