<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Grocery List</span>
      </div>
    </template>
    <p v-for="o in initList" :key="o.title" class="list">
      <span style="width: 400px;">{{ o.title }}</span>
      <span style="width: 100px;">{{ o.quantity }}</span>
      <el-button type="primary" @click="edit(o)">Edit</el-button>
      <el-button type="danger" @click="remove(o)">Delete</el-button>
    </p>
    <template #footer>
      <div class="card-footer">
        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
          <div style="margin: 5px 10px; ">
            <p>Grocery title</p>
            <el-input v-model="title" placeholder="Grocery title" />
          </div>
          <div style="margin: 5px 5px; ">
            <p>Grocery quantity</p>
            <el-input v-model="quantity" placeholder="Grocery quantity" />
          </div>
        </div>
        <div>
          <el-button type="primary" @click="add">Add Grocery</el-button>
          <el-button type="danger" @click="resetList">Reset List</el-button>
        </div>
      </div>
    </template>
  </el-card>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="showEditDialog" title="Edit Grocery" width="500" height="500">
    <el-form :model="form">
      <el-form-item label="Grocery title" :label-width="formLabelWidth" class="edit-form">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Grocery quantity" :label-width="formLabelWidth">
        <el-input v-model="form.quantity" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showEditDialog = false">Cancel</el-button>
        <el-button type="primary" @click="editConfirm()">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>



<script setup>
import { ref } from 'vue';
const list = [
  {
    title: 'Apple',
    quantity: 1
  },
  {
    title: 'Banana',
    quantity: 1
  }
]
const form = ref({
  title: '',
  quantity: ''
})
const currIndex = ref(-1);
const cloneList = JSON.parse(JSON.stringify(list));
const initList = ref(JSON.parse(JSON.stringify(list)));

const title = ref('');
const quantity = ref('');
const showEditDialog = ref(false);
const formLabelWidth = '140px';

const edit = (o) => {
  showEditDialog.value = true;
  currIndex.value = initList.value.indexOf(o);
  form.value = JSON.parse(JSON.stringify(initList.value[currIndex.value]));
}
const editConfirm = () => {
  showEditDialog.value = false;
  initList.value[currIndex.value] = JSON.parse(JSON.stringify(form.value));
}
const remove = (item) => {
  let index = initList.value.indexOf(item);
  if (index !== -1) {
    initList.value.splice(index, 1);
  }
}
const add = () => {
  initList.value.push({
    title: title.value,
    quantity: quantity.value
  })
}
const resetList = () => {
  console.log(cloneList);
  initList.value = JSON.parse(JSON.stringify(cloneList));
}
</script>

<style lang="scss" scoped>
.box-card {
  width: 600px;
  height: 800px;
  margin: 0 auto;
  text-align: center;
  font-size: 20px;
  font-weight: bolder;
}

.list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  text-align: left;
  font-size: 14px;
  font-weight: normal;
}

p {
  font-size: 14px;
  font-weight: normal;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.edit-form {
  padding: 10px 0px;
}
</style>