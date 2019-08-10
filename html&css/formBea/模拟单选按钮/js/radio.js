var dd = document.querySelector('.type').getElementsByTagName('dd');

function show(index) {
    // for ( (item, index) of dd ) {
    //     if (index == currIndex) {
    //         item.className = 'checked';
    //     } else {
    //         item.className = '';
    //     }
    // }
    // for (let i=0; i<dd.length; i++) {
    //     // dd.onclick = function() {

    //     // }
    //     if (i === index) {
    //         dd[i].className='checked';
    //         // dd[i].setAttribute('class', 'checked');
    //     }else {
    //         dd[i].className='';
    //         // dd[i].setAttribute('class', '');
    //     }
    // }
}

$('.type dd').click(function() {
    $(this).addClass('checked').siblings().removeClass('checked');
})