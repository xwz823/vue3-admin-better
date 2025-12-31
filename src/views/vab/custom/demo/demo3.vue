<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table>
</template>

<script setup>
import { getQuarkResourceList } from '@/api/demo';
import { onMounted, ref } from 'vue';

const tableData = ref([]);
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
});
</script>


<style scoped></style>