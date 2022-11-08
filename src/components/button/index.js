import button from "./button.vue";

button.install = function (Vue) {
  Vue.component("MyButton", button);
};

export default button;
