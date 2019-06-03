var canvas=document.createElement('canvas');
canvas.innerText="您的浏览器不支持 canvas，请升级你的浏览器。";
canvas.setAttribute('style','position:fixed;z-index:-100;top:0;left:0;');
function resize() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
resize();
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
window.onresize = resize;
window.onmousemove = function (e) {
    e = e || window.event;
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
};
window.onmouseout = function (e) {
    mousePosition.x = -100000;
    mousePosition.y = -100000;
};
window.onmousedown = function (e) {
    e = e || window.event;
}

function drawBubble(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    ctx.arc(x, y, 3, 2 * Math.PI, 0);
    ctx.fill();
}

var mousePosition = {x: 0, y: 0, max: 20000};
var dots = [];
for (var i = 0; i < 50; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var xa = Math.random() * 2 - 1;
    var ya = Math.random() * 2 - 1;
    xa = xa == 0 ? 1 : xa;
    var R = parseInt(Math.random() * 255);
    var G = parseInt(Math.random() * 255);
    var B = parseInt(Math.random() * 255);
    var color = {R: R, G: G, B: B};
    dots.push({x: x, y: y, xa: xa, ya: ya, color: color});
}
dots.push(mousePosition);

function move(dot) {
    dot.x += dot.xa;
    dot.y += dot.ya;
    // 遇到边界将速度反向
    dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1;
    dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1;
    // 绘制点
    drawBubble(dot.x, dot.y, dot.color);
}

var maxDistance = 20000;//最大距离的平方
function drawBubleLine() {
    for (var i = 0; i < dots.length - 1; i++) {//排除最后一个点，鼠标
        var dotA = dots[i];
        move(dotA);
        for (var j = i + 1; j < dots.length; j++) {
            var dotB = dots[j];
            var x = dotB.x - dotA.x;
            var y = dotB.y - dotA.y;
            var distance = x * x + y * y;
            // 如果粒子距离超过max,则不做处理,或者为鼠标另外判断
            if (distance < maxDistance || (j == (dots.length - 1) && dotB.max > distance)) {
                // 如果是鼠标，则让粒子向鼠标的位置移动
                if (j == (dots.length - 1) && distance > (maxDistance / 2)) {
                    dotA.x += x * 0.05;
                    dotA.y += y * 0.05
                }
                // 计算距离比
                var ratio = (maxDistance - distance) / maxDistance;
                // 粒子间连线
                ctx.beginPath();
                ctx.lineWidth = ratio * 1.2;
                ctx.strokeStyle = "rgba(255,255,255," + (ratio + 0.2) + ")";
                ctx.moveTo(dotA.x, dotA.y);
                ctx.lineTo(dotB.x, dotB.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBubleLine();
    requestAnimationFrame(animate);
}
animate();