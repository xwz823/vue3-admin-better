<template>
    <div>
        <ul>
            <li v-for="(item, index) in list" :key="index"
                style="display: flex; justify-content: space-between; align-items: center;">
                <div class="todo-content">{{ item.content }}</div>
                <el-button type="danger" @click="handleDelete(item.id)">删除</el-button>
            </li>
        </ul>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <el-input v-model="input"  @keydown.enter="handleEnter" placeholder="请输入内容" style="margin-right: 10px;" />
        <el-button @click="handleClick">新增</el-button>
    </div>
</template>

    <script setup>
    import { ref } from 'vue';
    const input = ref('');
    const list = ref([]);
    const handleClick = () => {
        console.log('点击');
        list.value.push({ id: list.value.length + 1, content: input.value });
        input.value = '';
    };
    const handleDelete = (id) => {
        list.value = list.value.filter(item => item.id !== id);
    };

    const handleEnter = () => {
        console.log('按下回车键');
        handleClick();
    };
</script>
    .todo-content{
    width: 300px;
    background-color: #f0f0f0;
    }
    <style scoped></style>