<template>
  <div>
    <select @click="onClick">
      <option>苹果</option>
      <option>桃子</option>
    </select>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      alert("11");
    },
  },
};
</script>

<style>
select {
  color: red;
}
</style>