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
        <div class="left-box-magnitude">
          <span>M<strong
              :style="index === 0 ? 'font-size: 30px; font-weight: 200;' : 'font-size: 25px; font-weight: bold;'">{{
                item.magnitude }}</strong></span>
        </div>
      </div>
      <div class="right-box">
        <p>{{ item.alertLevel }}</p>
      </div>
    </div>
  </el-card>
</template>


<script setup>
import { ref } from 'vue';
const data = ref([{
  id: 1,
  "time": "04/14 18:37",
  "status": "正式测定",
  "location": "印尼爪哇岛",
  "depth": "600",
  "magnitude": "5.7",
  "alertLevel": 3,
  "color": "blue"
},
{
  id: 2,
  "time": "04/14 17:55",
  "status": "深源",
  "location": "印尼爪哇岛",
  "depth": "",
  "magnitude": "7.1",
  "alertLevel": 3,
  "color": "blue"
}]);
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
    align-items: center;
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
      position: relative;
      display: inline;
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