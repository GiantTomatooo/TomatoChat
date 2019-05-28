var dom=$('.tomato_chat');
var username=$('.tomato_info>p').text();
var accepter='';
// var friendID=0;
// for(;friendID<$('.tomato_friendlist>li').length;friendID++){
//     $('.tomato_friendlist>li').eq(friendID).attr('id',friendID);
// }
dom.hide();
$('body').off('click').on('click','.tomato_friendlist>li',function () {
    console.log('ppp');
    if($('.chat_page').css('display')=='none'){
        $('.chat_page').show();
    }
    var selectName=$(this).text();
    accepter=selectName;
    // var flag=-1;
    // var listLength=$('.chat_list>div').length;
    // for(var i=0;i<listLength;i++){
    //     if($('.chat_list>div').eq(i).text()==selectName){
    //         flag=i;break;
    //     }
    // }
    var ele1=$('#list'+selectName);
    $('.chat_list>div').removeClass('tomato_active');
    if(ele1.length==0){
        $('.chat_list').append('<div class="tomato_active" id="list'+selectName+'"><span>'+selectName+'</span><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></div>');
    }else{
        ele1.addClass('tomato_active');
    }
    var ele2=$('#chat'+selectName);
    $('.tomato_chat').hide();
    if(ele2.length==0){
        $('.chat_page').append(dom.clone(true).show().attr('id','chat'+selectName));
        $('#chat'+selectName+'>.tomato_chat_title>div>p').text(selectName);
    }else{
        ele2.show();
    }
    //
    // if(flag==-1){
    //     $('.chat_list>div').removeClass('tomato_active');
    //     $('.chat_list').append('<div class="tomato_active"><span>'+selectName+'</span><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></div>');
    // }else{
    //     $('.chat_list>div').removeClass('tomato_active');
    //     $('.chat_list>div').eq(flag).addClass('tomato_active').show();
    // }
    // if(flag==-1){
    //     $('.tomato_chat').hide();
    //     $('.chat_page').append(dom.clone(true).show());
    //     $('.tomato_chat_title>div>p').eq(listLength+1).text(selectName);
    // }else{
    //     $('.tomato_chat').hide();
    //     $('.tomato_chat').eq(flag+1).show();
    // }
});
$('body').on('click','.chat_list>div',function(e){
    accepter=$(this).text();
    var n=$(this).attr('id').split('list')[1];
    var index=$(this).index();
    console.log(index);
    if($(e.target).hasClass('glyphicon')){//点击×时
        if($(this).hasClass('tomato_active')){//正在使用的窗口被关闭时，开启另一个窗口
            if(index==0){//第一个窗口被关闭打开打开下一个窗口
                if($('.chat_list>div').length>1){//两个以上窗口
                    var t=$('.chat_list>div').eq(1).attr('id').split('list')[1];
                    $('#chat'+t).show();
                    $('.chat_list>div').eq(1).addClass('tomato_active');
                }
            }else{//否则打开上一个窗口
                // var t=$(this).pre().attr('id').split('list')[1];
                var t=$('.chat_list>div').eq(index-1).attr('id').split('list')[1];
                // $('.tomato_chat').eq(index).show();
                $('#chat'+t).show();
                $(this).prev().addClass('tomato_active');
            }
        }
        $(this).remove();
        $('#chat'+n).hide();
        if($('.chat_list>div').length==0){
            $('.chat_page').hide();
        }
        // for(var i=0;i<$('.chat_list>div').length;i++){
        //     if($('.chat_list>div').eq(i).css('display')!='none'){
        //         return;
        //     }
        // }
    }else{//
        $('.chat_list>div').removeClass('tomato_active');
        $('.chat_list>div').eq(index).addClass('tomato_active');
        $('.tomato_chat').hide();
        $('#chat'+n).show();
    }
});
$('.tomato_tools li:first-of-type').click(function () {
    layer.prompt({
        title:'请输入用户名'
    },function (val,index) {
        layer.msg('用户添加成功');
        layer.close(index);
    });
});
$('.tomato_tools li:last-of-type').click(function () {
    layer.confirm('确认退出账号？',{
        icon:3,
        title:'警告'
    },function (index) {
        layer.msg('退出成功');
        layer.close(index);
    });
});
function dragPanelMove(downDiv,moveDiv) {
    $(downDiv).mousedown(function (e) {
        var isMove = true;
        var div_x = e.pageX - $(moveDiv).offset().left;
        var div_y = e.pageY - $(moveDiv).offset().top;
        $(document).mousemove(function (e) {
            if (isMove) {
                var obj = $(moveDiv);
                obj.css({"left": e.pageX - div_x, "top": e.pageY - div_y});
            }
        }).mouseup(
            function () {
                isMove = false;
            });
    });
}
dragPanelMove('.tomato_info','.tomato_IM');
dragPanelMove('.tomato_chat_title','.chat_page');

websocket = new WebSocket("ws://localhost:8080/websocket/"+username);
websocket.onopen = function (ev) {
    console.log("websocket已开启:"+websocket.url);
}
websocket.onmessage=function (ev) {
    console.log("接收到消息："+ev.data);
    var msg=JSON.parse(ev.data);
    if(msg.state=='chat'){
        console.log(msg);
        var ele=$('#chat'+msg.accepter);
        // $('.tomato_chat').hide();
        if(ele.length==0){
            $('.chat_page').append(dom.clone(true).attr('id','chat'+msg.accepter));
            $('#chat'+msg.accepter+'>.tomato_chat_title>div>p').text(msg.accepter);
        }
        // else{
        //     ele.show();
        // }
        addChatPanel(msg.accepter,msg.message,1);
    }
};
function sendMessage(){
    console.log('accepter'+accepter);
    var message=$('#chat'+accepter+' textarea').val();
    addChatPanel(username,message,0);
    message={'state':'chat','sender':username,'accepter':accepter,'message':message};
    message=JSON.stringify(message);
    console.log('发送消息'+message);
    websocket.send(message);
    var scrollTop = $(".tomato_chat_panel").get(1).scrollHeight;//自动滚动到最底部
    $(".tomato_chat_panel").eq(1).scrollTop(scrollTop);
}
function addChatPanel(name,message,flag){
    console.log('添加消息到panel');
    console.log(name);
    if(flag==0){
        message=' <div class="chat_panel_right"><span>:'+name+'</span><span>'+message+'</span><div></div></div>';
    }else{
        message=' <div class="chat_panel_left"><span>:'+name+'</span><span>'+message+'</span><div></div></div>';
    }
    $('#chat'+accepter+' .tomato_chat_panel').append(message);
    $('textarea').val('');
}
$('body').off('keypress').on('keypress', function(e) {
    if (e.key === 'Enter'){
        sendMessage();
    }else{
        $('textarea').focus();
    }
});