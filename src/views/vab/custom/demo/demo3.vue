<template>
  <div ref="container">1</div>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Name">
      <el-input v-model="form.name" />
    </el-form-item>
  </el-form>
  <el-button @click="handleClick">点击</el-button>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script setup>
import { reactive, ref, useTemplateRef, watch } from 'vue';

const form = reactive({});
const name = ref('');

watch(
  form,
  (newVal, oldVal) => {
    console.log('旧值:', oldVal);
    console.log('新值:', newVal);
  }
);

const container = useTemplateRef('container');
const handleClick = () => {
  container.value.style.backgroundColor = 'blue';
};

/* const tableData = computed(() => {
  console.log(form);
  console.log(name.value);
  // 必须返回一个值，且要在 return 中使用响应式变量才能触发更新
  return [
    { date: '2024-01-01', name: form.name || 'Default', address: 'Address 1' },
    { date: '2024-01-02', name: name.value || 'Default', address: 'Address 2' }
  ];
}); */

/* const tableData = ref([]);
const data = ref({
    "kw": "凡人修仙传",
    "cloud_types":["quark"]
});

onMounted(() => {
    console.log(data.value);
    getQuarkResourceList(data.value).then(res => { 
        console.log(res);
        tableData.value = res.data;
    });
}); */
</script>


<style scoped></style>