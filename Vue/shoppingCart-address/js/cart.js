var vm = new Vue({
    el: '#app',
    data: {
        list: [],
        totalMoney: 0,
        checkAllFlag: false,
        delFlag: false,
        // curProduct: '',
        productIndex: '',
    },
    filters: {
        formatMoney(value) {
            return '￥' + value.toFixed(2) + '元';
        }
    },
    mounted: function () {
        this.getList()
    },
    methods: {
        getList() {
            this.$http.get('data/cartData.json').then(function (res) {
                this.list = res.body.list;
                console.log(this);
            });
        },
        changeMoney(product, way) {
            if (way > 0) {
                product.productQuentity++
            } else {
                product.productQuentity--;
                if (product.productQuentity < 1) {
                    product.productQuentity = 1;
                }
            }
            this.calcToTalPrice();
        },
        selectedProduct(item) {
            // console.log(item.checked);
            if (item.checked === undefined) {
                Vue.set(item, 'checked', true);
                // this.$set(item, 'checked', true);
            } else {
                item.checked = !item.checked;
            }
            this.calcToTalPrice();
        },
        checkAll(flag) {
            this.checkAllFlag = flag;
            this.list.forEach((item, index) => {
                if (item.checked === undefined) {
                    this.$set(item, 'checked', true);
                } else {
                    item.checked = this.checkAllFlag;
                }
            })
            this.calcToTalPrice();
        },
        // 使用方法渲染的数据，双向数据绑定并不会自动更新，必须再次调用才行
        calcToTalPrice() {
            this.totalMoney = 0;
            this.list.forEach((item, index) => {
                if (item.checked) {
                    this.totalMoney += item.productPrice * item.productQuentity;
                }
            })
        },
        delConfirm(index) {
            this.delFlag = true;
            // this.curProduct = item;
            this.productIndex = index;
        },
        delProduct() {
            // var index = this.list.indexOf(this.curProduct);
            // console.log(index);
            this.list.splice(this.index, 1);
            this.delFlag = false;
        }
    }
});
    // Vue.filter('formatMoney2', (value, type)=>{
    //     return '￥' + value.toFixed(2) + type;
    // });
