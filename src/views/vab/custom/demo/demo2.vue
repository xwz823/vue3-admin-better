<template>
  <el-card class="card-box">
    <div v-for="(item, index) in data" :key="item.id" class="row-box"
      :class="index === 0 ? 'row-box-large' : 'row-box-normal'">
      <div class="left-box" :class="index === 0 ? 'left-box-large' : 'left-box-normal'">
        <div class="left-box-content">
          <div>
            <p class="first-line">{{ item.time }} {{ item.status }}</p>
            <p>{{ item.location }}</p>
          </div>
          <div v-if="index === 0">
            <span class="last-line">深度:<strong>{{ item.depth }}</strong> km </span>
          </div>
        </div>
        <div class="left-box-magnitude" :style="`align-items:${index === 0 ? 'flex-end' : 'center'}`">
          <span>M<strong
              :style="index === 0 ? 'font-size: 30px; font-weight: 200;' : 'font-size: 25px; font-weight: bold;'">{{
                item.magnitude }}</strong></span>
        </div>
      </div>
      <div class="right-box"
        :style="`background-color: ${alertLevelColorMap.get(item.alertLevel)};font-size:${index === 0 ? '70px' : '40px'}`">
        {{ item.alertLevel }}
      </div>
    </div>
  </el-card>
</template>


<script setup>
import { getLocationList } from '@/api/demo';
import { onMounted, ref } from 'vue';

const alertLevelColorMap = ref(new Map([
  [3, 'blue'],
  [4, 'green'],
  [5, 'yellow'],
  [6, 'orange'],
  [7, 'red'],
  [8, 'gray'],
  [9, 'white']
]));
onMounted(() => {
  getLocationList().then(res => {
    console.log(res);
    data.value = res.data;
  });
});

const data = ref([]);
</script>

<style lang="scss" scoped>
.card-box {
  width: 480px;
  height: 600px;
  margin: 0 auto;
  text-align: left;
  color: #fff;
  font-size: 19px;
  font-weight: bold;
  font-family: "黑体";
  background-color: #323232;

  p {
    margin: 0;
    width: 100%;
  }

  strong {
    font-size: 30px;
    font-weight: 200;
  }

  .first-line {
    font-size: 17px;
    font-weight: normal;
  }

  .last-line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .row-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px;

    .left-box {
      border: 2px solid #fff;
      border-radius: 5px;
      height: 100%;
      margin: 2px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    .left-box-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
    }

    .left-box-magnitude {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .right-box {
      flex: 1;
      border: 2px solid #fff;
      border-radius: 5px;
      height: 100%;
      margin: 2px;
      text-align: center;
      display: inline;
      align-content: center;
    }
  }
}

.row-box-normal {
  height: 42px;
}

.row-box-large {
  height: 82px;
}

.left-box-large {
  width: 77%;

}

.left-box-normal {
  width: 86%;
}
</style>