<template>
    <el-row :gutter="20">
        <el-col :span="24">
            <div class="header">
                <el-carousel height="250px">
                    <el-carousel-item v-for="item in carousel" :key="item">
                        <h3 class="small justify-center" text="2xl">{{ item }}</h3>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4">
            <div class="left">
                <ul>
                    <li v-for="item in navigation" :key="item" class="left-item">
                        <a href="#" class="left-item">{{ item }}</a>
                    </li>
                </ul>
            </div>
        </el-col>
        <el-col :span="20">
            <div class="right">
                <span>温度：{{ content.current.temperature }}</span>
                <br />
                <span>更新时间：{{ content.current.time }}</span>
                <br />
                <span>天气代码：{{ content.current.weather_code }}</span>
                <br />
                <span>风速：{{ content.current.wind_speed_10m }}</span>
                <br />
                <slot />
                <el-button type="primary" @click="emit('click')">测试</el-button>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="24">
            <div class="footer">
                <span> {{ footer }} </span>
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
import { getWeatherList } from '@/api/demo';
import dayjs from 'dayjs';
import { defineProps, onMounted, ref, watch } from 'vue';

const param = defineProps(['name','age'])
const emit = defineEmits(['click'])
console.log(emit);

watch(param, (newVal, oldVal) => {
    console.log(newVal, oldVal);
})
const content = ref({
    current: {
        temperature: '天气预报加载中',
        time: '',
        weather_code: '',
        wind_speed_10m: '',
    },
});
const carousel = ref([]);
const navigation = ref([]);
const footer = ref('');

onMounted(() => {
    console.log(param);
    console.log('从存储中获取页面信息');
    localStorage.getItem('carousel').split(',').forEach(item => {
        carousel.value.push(item);
    });
    localStorage.getItem('navigation').split(',').forEach(item => {
        navigation.value.push(item);
    });
    footer.value = localStorage.getItem('footer');
    console.log('开始请求天气预报');
    getWeatherList().then(res => {
        console.log(res);
        content.value.current.temperature = res.current.temperature;
        content.value.current.time = dayjs(res.current.time).format('YYYY-MM-DD HH:mm:ss');
        content.value.current.weather_code = res.current.weather_code;
        content.value.current.wind_speed_10m = res.current.wind_speed_10m;
    });
    console.log('天气预报加载完成');
});
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    min-height: 100px;
    height: 250px;
}

.left {
    width: 100%;
    min-height: 100px;
    height: 600px;
    padding: 10px;

    .left-item {
        height: 20px;
    }
}

.right {
    width: 100%;
    min-height: 100px;
    height: 600px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.footer {
    width: 100%;
    min-height: 20px;
    height: 40px;
    padding: 10px;

}
</style>