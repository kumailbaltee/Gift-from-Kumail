const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
const launchBtn = document.getElementById('launch-btn');
const landingStage = document.getElementById('landing-stage');
const celebrationStage = document.getElementById('celebration-stage');
let particles = [];
let fireworks = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.destX = this.x;
        this.destY = Math.random() * (canvas.height / 2);
        this.speed = 4 + Math.random() * 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.done = false;
    }
    update() {
        this.y -= this.speed;
        if (this.y <= this.destY) {
            this.explode();
            this.done = true;
        }
    }
    explode() {
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 1;
        this.friction = 0.95;
        this.gravity = 0.15;
        this.alpha = 1;
        this.decay = 0.01 + Math.random() * 0.02;
    }
    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() < 0.05 && celebrationStage.classList.contains('active')) {
        fireworks.push(new Firework());
    }
    
    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.done) fireworks.splice(index, 1);
    });
    
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(index, 1);
    });
    
    requestAnimationFrame(animate);
}

const bgMusic = document.getElementById('bg-music');
launchBtn.addEventListener('click', () => {
    landingStage.classList.remove('active');
    
    // Play music
    bgMusic.play().catch(error => {
        console.log("Music play failed:", error);
    });
    
    setTimeout(() => {
        landingStage.classList.add('hidden');
        celebrationStage.classList.remove('hidden');
        
        setTimeout(() => {
            celebrationStage.classList.add('active');
            // Trigger initial burst
            for (let i = 0; i < 5; i++) {
                setTimeout(() => fireworks.push(new Firework()), i * 200);
            }
        }, 50);
    }, 1500);
});

animate();
