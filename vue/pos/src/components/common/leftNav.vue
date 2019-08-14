<template>
    <div class="left-nav">
        <ul>
            <li>
                <i class="icon iconfont icon-wodezichan"></i>
                <div>收银</div>
            </li>
            <li>
                <i class="icon iconfont icon-dianpu"></i>
                <div>店铺</div>
            </li>
            <li>
                <i class="icon iconfont icon-hanbao"></i>
                <div>商品</div>
            </li>
            <li>
                <i class="icon iconfont icon-huiyuanqia"></i>
                <div>会员</div>
            </li>
            <li>
                <i class="icon iconfont icon-tongji"></i>
                <div>统计</div>
            </li>
        </ul>
    </div>
</template>

<style>
    .left-nav {
        width: 5%;
        height: 100%;
        float: left;
        font-size: 10px;
        color: #fff;
        background-color: #1D8ce0;
    }
    .iconfont {
        font-size: 24px;
    }
    .left-nav ul {
        margin: 0;
        padding: 0;
    }
    .left-nav li {
        list-style: none;
        text-align: center;
        border-bottom: 1px solid #20a0ff;
        padding: 10px;
    }
</style>

<script>
export default {
    name: 'leftNav',
    date() {
        return {
            
        }
    }
}
</script>
