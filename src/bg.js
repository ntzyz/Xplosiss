function startbg() {
    var canvas = document.getElementById('canvas'), ctx;
    var trigList = (new Array(100)).fill(0);
    if (canvas.getContext)
        ctx = canvas.getContext('2d');
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
    window.onresize = resize;
    function triangle(ctx, x, y, raito, fillStyle) {
        if (!ctx) return;
        var width = 80;
        var height = 96;
        
        // Set up the fill style.
        ctx.fillStyle = fillStyle;

        ctx.beginPath();
        ctx.moveTo(x + 0.5 * width * raito, y);
        ctx.lineTo(x, y + height * raito);
        ctx.lineTo(x + width * raito, y + height * raito);
        ctx.lineTo(x + 0.5 * width * raito, y);
        ctx.fill();
    }
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let item of trigList) {
            triangle(ctx, item.x, item.y, item.r, item.c);
            item.y -= item.s;
            if (item.y < -150) {
                item.y = canvas.height;
                item.x = Math.random() * window.innerWidth;
            }
        }
    }
    function resize() {
        var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    }
}


module.exports = startbg;
