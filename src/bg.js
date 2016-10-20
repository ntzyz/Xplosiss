function startbg() {
    let canvas = document.getElementById('canvas'), ctx;
    let trigList = Array.apply(null, Array(100)).map(Number.prototype.valueOf,0);
    let lastX = null, lastY = null;
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    else {
        return;
    }
    trigList = trigList.map(function (item) {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight * 1.2,
            a: Math.random() / 8 + 0.5,
            s: Math.random() * 0.5 + 0.25,
            r: Math.random() / 2 + 0.75,
            c: 'rgba(' + (Math.floor(220 + Math.random() * 35)) + ', ' + (Math.floor(220 + Math.random() * 35)) + ', ' + (Math.floor(220 + Math.random() * 35)) + ', ' + (0.4 + 0.1 * Math.random()) + ')'
        };
    });
    resize();
    setInterval(render, 12);
    window.onresize = () => { resize(); render(true); };
    function triangle(ctx, x, y, raito, fillStyle) {
        if (!ctx) return;
        let width = 80;
        let height = 96;
        
        // Set up the fill style.
        ctx.fillStyle = fillStyle;

        // Draw this triangle.
        ctx.beginPath();
        ctx.moveTo(x + 0.5 * width * raito, y);
        ctx.lineTo(x, y + height * raito);
        ctx.lineTo(x + width * raito, y + height * raito);
        ctx.lineTo(x + 0.5 * width * raito, y);
        ctx.fill();
    }
    function render(noUpdate) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let item of trigList) {
            triangle(ctx, item.x, item.y, item.r, item.c);
            if (noUpdate) {
                continue;
            }
            item.y -= item.s;
            if (item.y < -150) {
                item.y = canvas.height;
                item.x = Math.random() * window.innerWidth;
            }
        }
    }
    function resize() {
        let canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    }
    function adjuest(event) {
        if (lastX === null || lastY === null) {
            lastX = event.clientX;
            lastY = event.clientY;
            return;
        }
        let offsetX = lastX - event.clientX;
        let offsetY = lastY - event.clientY;
        let abs = arg => {
            return arg < 0 ? -arg: arg;
        }
        if (abs(offsetX) > 100 || abs(offsetY) > 100) {
            lastX = event.clientX;
            lastY = event.clientY;
            return;
        }
        for (let item of trigList) {
            item.x -= offsetX / 80;
            item.y -= offsetY / 80;
        }
        render(true);
        lastX = event.clientX;
        lastY = event.clientY;
    }
    document.onmousemove = adjuest;
}


module.exports = startbg;
