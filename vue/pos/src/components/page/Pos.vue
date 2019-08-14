<template>
  <div class="pos">
    <el-row>
      <el-col :span="7" class="pos-order" id="order-list">
        <el-tabs>
          <el-tab-pane label="点餐">
            <el-table :data="tableData" style="width:100%;" border>
              <el-table-column prop="goodsName" label="商品名称"></el-table-column>
              <el-table-column prop="count" label="数量" width="70"></el-table-column>
              <el-table-column prop="price" label="价格" width="70"></el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template scope="scope">
                  <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                  <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="totalDiv">
              <small>数量：</small>
              {{ totalCount }} &nbsp;&nbsp;&nbsp;&nbsp;
              <small>金额：</small>
              {{ totalMoney }} 元
            </div>

            <el-row class="row-btn">
              <el-button type="warning">挂单</el-button>
              <el-button type="danger" @click="delAllGoods">删除</el-button>
              <el-button type="success" @click="checkout">结账</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="挂单">挂单</el-tab-pane>
          <el-tab-pane label="外卖">外卖</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="17">
        <div class="often-goods">
          <div class="title">常用商品</div>
          <div class="often-goods-list">
            <ul>
              <li v-for="goods in oftenGoods" @click="addOrderList(goods)">
                <span>{{goods.goodsName}}</span>
                <span class="o-price">￥{{goods.price}}元</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="goods-type">
          <el-tabs>
            <el-tab-pane label="汉堡">
              <ul class="cookList">
                <li v-for="goods in type0Goods" @click="addOrderList(goods)">
                  <span class="foodImg">
                    <img
                      src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1330000057,1851103504&fm=26&gp=0.jpg"
                      alt
                    >
                  </span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="小食">
              <ul class="cookList">
                <li v-for="goods in type1Goods" @click="addOrderList(goods)">
                  <span class="foodImg">
                    <img
                      src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1330000057,1851103504&fm=26&gp=0.jpg"
                      alt
                    >
                  </span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="饮料">
              <ul class="cookList">
                <li v-for="goods in type2Goods" @click="addOrderList(goods)">
                  <span class="foodImg">
                    <img
                      src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1330000057,1851103504&fm=26&gp=0.jpg"
                      alt
                    >
                  </span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="套餐">
              <ul class="cookList">
                <li v-for="goods in type3Goods" @click="addOrderList(goods)">
                  <span class="foodImg">
                    <img
                      src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1330000057,1851103504&fm=26&gp=0.jpg"
                      alt
                    >
                  </span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "pos",
  data() {
    return {
      tableData: [],
      oftenGoods: [],
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: [],
      totalCount: 0,
      totalMoney: 0
    };
  },
  // 钩子函数
  created() {
    axios
      .get(
        "https://www.easy-mock.com/mock/5b8b30dbf032f03c5e71de7f/kuaican/oftenGoods"
      )
      .then(response => {
        // console.log(response);
        this.oftenGoods = response.data;
      })
      .catch(error => {
        console.log(error);
        alert("网络错误，不能访问");
      });

    // 读取分类商品列表
    axios
      .get(
        "https://www.easy-mock.com/mock/5b8b30dbf032f03c5e71de7f/kuaican/typeGoods"
      )
      .then(response => {
        // console.log(response);
        this.type0Goods = response.data[0];
        this.type1Goods = response.data[1];
        this.type2Goods = response.data[2];
        this.type3Goods = response.data[3];
      })
      .catch(error => {
        console.log(error);
        alert("网络错误，不能访问");
      });
  },
  // DOM挂载之后
  mounted: function() {
    var orderHeight = document.body.clientHeight;
    console.log(orderHeight);
    document.getElementById("order-list").style.height = orderHeight + "px";
  },
  methods: {
    // 添加订单列表的方法
    addOrderList(goods) {
      // 判断是否这个商品已经存在于订单列表
      let isHave = false;
      for (let i = 0; i < this.tableData.length; i++) {
        // console.log(this.tableData[i].goodsId);
        if (this.tableData[i].goodsId == goods.goodsId) {
          isHave = true;
        }
      }
      // 根据isHave的值判断订单列表中是否已经有此商品
      if (isHave) {
        // 如果isHave为真，数量+1
        let arr = this.tableData.filter(function(current) {
          return current.goodsId == goods.goodsId;
        });
        arr[0].count++;
        // console.log(arr);
      } else {
        // 不存在就推入数组
        let newGoods = {
          goodsId: goods.goodsId,
          goodsName: goods.goodsName,
          price: goods.price,
          count: 1
        };
        this.tableData.push(newGoods);
      }
      console.log(this.tableData);
      this.getAllMoney();
    },
    // 删除单个商品
    delSingleGoods(goods) {
      this.tableData = this.tableData.filter(o => o.goodsId != goods.goodsId);
      this.getAllMoney();
    },
    // 删除所有商品
    delAllGoods() {
      this.tableData = [];
      this.totalCount = 0;
      this.totalMoney = 0;
    },
    // 数量和价格的汇总
    getAllMoney() {
      // 汇总清零，否则会累积相加
      this.totalCount = 0;
      this.totalMoney = 0;
      // 进行数量和价格的汇总计算
      if (this.tableData) {
        this.tableData.forEach(element => {
          this.totalCount += element.count;
          this.totalMoney += element.price * element.count;
        });
      }
    },
    // 模拟结账
    checkout() {
      if (this.tableData != 0) {
        this.$message({
          message:
            "结账成功！您支付的金额为:" + this.totalMoney + "元，非常感谢。",
          type: "success"
        });
        this.tableData = [];
        this.totalCount = 0;
        this.totalMoney = 0;
      } else {
        this.$message.error("不能空结");
      }
    }
  }
};
</script>

<style scoped>
.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
  padding: 10px;
}
.pos-order .row-btn {
  margin-top: 10px;
}
.often-goods .title {
  height: 20px;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #d3dce6;
  background-color: #f9fafc;
}
.often-goods-list ul li {
  list-style: none;
  float: left;
  padding: 10px;
  margin: 5px;
  border: 1px solid #e5e9f2;
  background-color: #fff;
  cursor: pointer;
}
.o-price {
  color: #58b7ff;
}
.goods-type {
  clear: both;
}
.cookList li {
  list-style: none;
  width: 30%;
  height: auto;
  float: left;
  padding: 2px;
  margin: 2px;
  background: #fff;
  border: 1px solid #e5e9f2;
  overflow: hidden;
  cursor: pointer;
}
.cookList li span {
  display: block;
  text-align: left;
}
.foodImg {
  width: 50%;
  float: left;
}
.foodImg img {
  width: 90%;
  height: 70px;
}
.foodName {
  font-size: 18px;
  /* padding-left: 10px; */
  color: brown;
}
.foodPrice {
  font-size: 16px;
  /* padding-left: 10px; */
  padding-top: 10px;
}
.totalDiv {
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #d3dce6;
}
</style>
