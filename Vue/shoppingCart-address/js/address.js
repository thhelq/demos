var vm = new Vue({
    el:'.container',
    data: {
        addressList:[],
        limitNum: 3,
        currentIndex: 0,
        shippingMethod: 1
    },
    mounted: function() {
        this.$nextTick(function() {
            this.getAddressList();
        })
    },
    computed: {
        filterAddress: function () {
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods: {
        getAddressList() {
            this.$http.get('data/address.json').then((res)=>{
                this.addressList = res.body.result;
            });
        },
        loadMore() {
            this.limitNum = this.addressList.length;
        },
        setDefault(addressId) {
            this.addressList.forEach((item, index) => {
                if (item.addressId === addressId) {
                    item.isDefault = true;
                } else {
                    item.isDefault = false;
                }
            });
        }
    }
});