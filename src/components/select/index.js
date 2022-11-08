import select from './select.vue';

select.install = function (Vue) {
  Vue.component('MySelect', select);
};

export default select;
