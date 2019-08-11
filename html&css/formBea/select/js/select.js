// 需求
// 1.点击span，ul显示，字体颜色变黑，背景箭头图片向上
// 2.点击UL子项，span内容换成UL子项的内容，UL消失，字体颜色还原
// 3.点击遮罩层，UL消失
// 应该可以使用js获取span中的值并格式化，然后使用ajax发送出去

function getDom(id) {
    return document.getElementById(id);
}
let span = getDom('selectProvince'),
    ul = getDom('allProvince'),
    layer = document.querySelector('.layer');


function selectProvince() {
    let arrA = ul.getElementsByTagName('a');

    for (item of arrA) {
        item.onclick = function() {
            span.innerHTML = this.innerHTML;
            ul.style.display = 'none';
            span.className = '';
            layer.style.display = 'none';
        }
    }
}

selectProvince()
span.onclick = function() {
    this.className = 'show';
    ul.style.display = 'block';
    layer.style.display = 'block';
}
layer.onclick = function() {
    this.style.display = 'none';
    ul.style.display = 'none';
    span.className = '';
}