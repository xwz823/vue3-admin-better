<template>
    <div class="demo6-container">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form :model="form" label-width="120px" :inline="true">
                    <el-form-item label="轮播图" >
                        <el-input v-model="form.carousel" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="导航列表" >
                        <el-input v-model="form.navigation" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="底部授权" >
                        <el-input v-model="form.footer" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-button type="primary">测试</el-button>
                </el-form>
            </el-col>
            <el-col :span="24">
                <Demo5 name="demo6" age="18" @click="test" >slot 1元素</Demo5>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue';
import Demo5 from './demo5.vue';
const form = reactive({
    carousel: '',
    navigation: '',
    footer: '',
});

const test = () => {
    console.log('测试');
}

onMounted(() => {
    form.carousel = localStorage.getItem('carousel');
    form.navigation = localStorage.getItem('navigation');
    form.footer = localStorage.getItem('footer');
});

watch(form, (newVal, oldVal) => {
    console.log(newVal, oldVal);

    localStorage.setItem('carousel', newVal.carousel);
    localStorage.setItem('navigation', newVal.navigation);
    localStorage.setItem('footer', newVal.footer);
});

</script>

<style lang="scss" scoped>
.demo6-container {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: start;
}
</style>