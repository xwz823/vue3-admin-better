<template>
  <div class="demo6-container">
    <el-row :gutter="20">
        <el-col :span="24">
            <el-form :model="form" label-width="120px">
                <el-form-item label="轮播图">
                    <el-input v-model="form.carousel"  placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="导航列表">
                    <el-input v-model="form.navigation"  placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="底部授权">
                    <el-input v-model="form.footer"  placeholder="请输入内容" ></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue';
const form = reactive({
    carousel: '',
    navigation: '',
    footer: '',
});

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
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>