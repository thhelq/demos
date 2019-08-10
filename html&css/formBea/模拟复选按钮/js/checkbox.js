function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}


// 创建b标签
function createTag() {
    let lis = document.querySelector('.checkbox').getElementsByTagName('li');
    let label;
    for (item of lis) {
        // console.log(item);
        label = item.getElementsByTagName('label')[0];
        let bTag = document.createElement('b');
        label.parentNode.insertBefore(bTag, label);
    }
}

// 点击li，如果没有checked 类就给它添加，有就移除
function checked() {
    let lis = document.querySelector('.checkbox').getElementsByTagName('div');
    for (item of lis) {
        item.onclick=function() {
            if (this.parentNode.className == 'checked') {
                this.parentNode.className = '';
            } else {
                this.parentNode.className = 'checked';
            }    
        }
    }
}

function more() {
    document.querySelector('.checkbox').style.height = '60px';
}
addLoadEvent(createTag);
addLoadEvent(checked);