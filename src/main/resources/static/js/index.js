var chatWindow=$('.tomato_chat');
var username=$('.tomato_info>p').text();
var accepter='';
chatWindow.hide();
$('body').off('click').on('click','.tomato_friendlist>li',function () {
    if($('.chat_page').css('display')=='none'){
        $('.chat_page').show();
    }
    var selectName=$(this).text();
    accepter=selectName;
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
        $('.chat_page').append(chatWindow.clone(true).show().attr('id','chat'+selectName));
        $('#chat'+selectName+'>.tomato_chat_title>div>p').text(selectName);
    }else{
        ele2.show();
    }
    if($('.chat_list>div').length==1){
        $('.chat_list').hide();
        $('.chat_page').css({width:487});
    }else{
        $('.chat_list').show();
        $('.chat_page').css({width:651});
    }
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
                var t=$('.chat_list>div').eq(index-1).attr('id').split('list')[1];
                $('#chat'+t).show();
                $(this).prev().addClass('tomato_active');
            }
        }
        $(this).remove();
        $('#chat'+n).hide();
        if($('.chat_list>div').length==0){
            $('.chat_page').hide();
        }
    }else{
        $('.chat_list>div').removeClass('tomato_active');
        $('.chat_list>div').eq(index).addClass('tomato_active');
        $('.tomato_chat').hide();
        $('#chat'+n).show();
    }
    if($('.chat_list>div').length==1){
        $('.chat_list').hide();
        $('.chat_page').css({width:487});
    }else{
        $('.chat_list').show();
        $('.chat_page').css({width:651});
    }
});
$('.tomato_tools li:first-of-type').click(function () {

});
$('.tomato_tools>i').click(function () {
    var index=$(this).index();
    if(index==0){
        layer.prompt({
            title:'查找好友'
        },function (val,index) {
            if(val==username){
                layer.alert('不可添加自己为好友!');
                layer.close(index);
                return;
            }
            var flag=false;
            $('.tomato_content>ul>li').each(function (index) {
                if(this.innerText==val){
                    layer.alert(val+'已经是您的好友！！！');
                    flag=true;
                    return;
                }
            });
            layer.close(index);
            if(flag){
                return;
            }
            var message={'state':'add_friend','sender':username,'accepter':val};
            message=JSON.stringify(message);
            console.log('发送消息'+message);
            websocket.send(message);
        });
    }else if(index==1){
        layer.alert("换肤功能正在开发中。。。");
    }else{
        layer.confirm('确认退出账号？',{
            icon:3,
            title:'警告'
        },function (index) {
            websocket.close();
            location.href='login.html';
            layer.close(index);
        });
    }
});
$('.tomato_chat_title>div:last-child>span').click(function () {
    $('.chat_page').hide();
    $('.chat_list>div').remove();
});
$(document).on('mouseover','.chat_list>div',function () {
    $(this).children('div>span:last-of-type').show();
});
$(document).on('mouseout','.chat_list>div',function () {
    $('.chat_list>div>span:last-of-type').hide();
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
        if(ele.length==0){
            $('.chat_page').append(chatWindow.clone(true).attr('id','chat'+msg.accepter));
            $('#chat'+msg.accepter+'>.tomato_chat_title>div>p').text(msg.accepter);
        }
        addChatPanel(msg.sender,msg.message,1);
    }
    if(msg.state=='add_friend'){
        layer.confirm(msg.sender+'想要添加您为好友，是否同意？',{
            icon:3,
            title:'好友请求'
        },function (index) {
            if($('.tomato_content>ul').length==0){
                $('.tomato_content').append('<ul class="tomato_friendlist"></ul>')
            }
            $('.tomato_friendlist').append("<li>"+msg.sender+"</li>");
            var message={'state':'confirm_add_friend','sender':username,'accepter':msg.sender};
            message=JSON.stringify(message);
            console.log('发送消息'+message);
            websocket.send(message);
            layer.close(index);
        });
    }
    if(msg.state=='confirm_add_friend'){
        console.log($('.tomato_content>ul').length)
        if($('.tomato_content>ul').length==0){
            $('.tomato_content').append('<ul class="tomato_friendlist"></ul>')
        }
        $('.tomato_friendlist').append("<li>"+msg.sender+"</li>");
        layer.msg(msg.sender+'同意了您的好友请求！');
    }
    // if(msg.state=='userExit'){
    //     $('.tomato_content>ul>li').each(function (index) {
    //         if(this.innerText==msg.user){
    //             $(this).remove();
    //             return;
    //         }
    //     });
    // }
};
$(document).on('click','.layui-icon-face-smile-b>div>p',function () {
    var val=$('#chat'+accepter+' textarea').val()+this.innerText;
    $('#chat'+accepter+' textarea').val(val);
});
$(document).on('click','.layui-icon-face-smile-b',function () {
    $(this).children('div').toggle(100);
})
function sendMessage(){
    var message=$('#chat'+accepter+' textarea').val();
    $('#chat'+accepter+' textarea').val('');
    addChatPanel(username,message,0);
    message={'state':'chat','sender':username,'accepter':accepter,'message':message};
    message=JSON.stringify(message);
    console.log('发送消息'+message);
    websocket.send(message);
    var scrollTop = $(".tomato_chat_panel").get(1).scrollHeight;//自动滚动到最底部
    $(".tomato_chat_panel").eq(1).scrollTop(scrollTop);
}
function addChatPanel(name,message,flag){
    if(flag==0){
        message=' <div class="chat_panel_right"><span>:'+name+'</span><span>'+message+'</span><div></div></div>';
    }else{
        message=' <div class="chat_panel_left"><span>'+name+':</span><span>'+message+'</span><div></div></div>';
    }
    $('#chat'+accepter+' .tomato_chat_panel').append(message);
}
$(document).on('keypress', function(e) {
    if (e.key === 'Enter'){
        e.preventDefault();
        sendMessage();
    }else{
        $('textarea').focus();
    }
});
var str="<p>😀 😁 😂 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 " +
    "😇 😐 😑 😶 😏 😣 😥 😮 😯 😪 😫 😴 😌 😛 😜 😝 😒 😓 😔 " +
    "😕 😲 😷 😖 😞 😟 😤 😢 😭 😦 😧 😨 😬 😰 😱 😳 😵 😡 😠 " +
    "😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾 " +
    "👨‍🌾 👩‍🍳 👨‍🍳 👩‍🎓 👨‍🎓 👩‍🎤 👨‍🎤 👩‍🏫 👨‍🏫 👩‍🏭 👨‍🏭 👩‍💻 👨‍💻 👩‍💼 " +
    "👨‍💼 👩‍🔧 👨‍🔧 👩‍🔬 👨‍🔬 👩‍🎨 👨‍🎨 👩‍🚒 👨‍🚒 👩‍✈️ 👨‍✈️ 👩‍🚀 👨‍🚀 👩‍⚖️ " +
    " 👫 👭 👬 💑 👩‍❤️‍👩 " +
    "👨‍❤️‍👨 💏 👩‍❤️‍💋‍👩 👨‍❤️‍💋‍👨 👪 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 👨‍👩‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 " +
    " 👩‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👦 👩‍👧 👩‍👧‍👦 👩‍👦‍👦 👩‍👧‍👧 👨‍👦 👨‍👧 👨‍👧‍👦 👨‍👦‍👦 " +
    "👨‍👧‍👧 🤲 👐 🙌 👏 🤝 👍 👎 👊 ✊ 🤛 🤜 🤞 ✌️ 🤟 🤘 👌 👈 👉 👆 👇 ☝️ ✋ 🤚 🖐 🖖 👋 🤙 💪 " +
    "🙈 🙉 🙊 🐵 🐒 🐶 🐕 🐩 🐺 🐱 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🐈 🐯 🐅 🐆 🐴 🐎 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 " +
    "🐪 🐫 🐘 🐭 🐁 🐀 🐹 🐰 🐇 🐻 🐨 🐼 🐾 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🐸 🐊 🐢 🐍 🐲 🐉 🐳 🐋 🐬 🐟 🐠 🐡 🐙 🐚 🐌 🐛 🐜 🐝 🐞 🦋 " +
    "🍇 🍈 🍉 🍊 🍋 🍌 🍍 🍎 🍏 🍐 🍑 🍒 🍓 🍅 🍆 🌽 🍄 🌰 🍞 🍖 🍗 🍔 🍟 🍕 🍳 🍲 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 " +
    "🍥 🍡 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🍫 🍬 🍭 🍮 🍯 🍼 ☕ 🍵 🍶 🍷 🍸 🍹 🍺 🍻 🍴 " +
    "🌋 🗻 🏠 🏡 🏢 🏣 🏤 🏥 🏦 🏨 🏩 🏪 🏫 🏬 🏭 🏯 🏰 💒 🗼 🗽 ⛪ ⛲ 🌁 🌃 🌆 🌇 🌉 🌌 🎠 🎡 🎢 🚂 🚃 " +
    "🚄 🚅 🚆 🚇 🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚏 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚚 🚛 🚜 🚲 ⛽ 🚨 🚥 🚦 🚧 ⚓ ⛵ 🚤 " +
    "🚢 ✈ 💺 🚁 🚟 🚠 🚡 🚀 🎑 🗿 🛂 🛃 🛄 🛅 💌 💎 🔪 💈 🚪 🚽 🚿 🛁 ⌛ ⏳ ⌚ ⏰ 🎈 🎉 🎊 🎎 🎏 🎐 🎀 🎁 📯 📻 📱 " +
    "📲 ☎ 📞 📟 📠 🔋 🔌 💻 💽 💾 💿 📀 🎥 📺 📷 📹 📼 🔍 🔎 🔬 🔭 📡 💡 🔦 🏮 📔 📕 📖 📗 📘 📙 📚 📓 📃 📜 " +
    "📄 📰 📑 🔖 💰 💴 💵 💶 💷 💸 💳 ✉ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 ✏ ✒ 📝 📁 📂 📅 📆 📇 📈 📉 📊 " +
    "📋 📌 📍 📎 📏 📐 ✂ 🔒 🔓 🔏 🔐 🔑 🔨 🔫 🔧 🔩 🔗 💉 💊 🚬 🔮 🚩 🎌 💦 💨 " +
    "📱 📲 ☎ 📞 📟 📠 🔋 🔌 💻 💽 💾 💿 📀 🎥 📺 📷 📹 📼 🔍 🔎 🔬 🔭 📡 📔 📕 📖 📗 📘 📙 📚 📓 📃 📜 " +
    "📄 📰 📑 🔖 💳 ✉ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 ✏ ✒ 📝 📁 📂 📅 📆 📇 📈 📉 📊 📋 📌 📍 📎 📏 📐 ✂ 🔒 🔓 🔏 🔐 🔑" +
    "</p>";
str=str.split(' ').join('</p><p>');
$('.layui-icon-face-smile-b>div').append(str);