console.log("💞 Línea del Tiempo cargada");

// Música
const music = document.getElementById("love-music");
const toggle = document.getElementById("music-toggle");
let musicPlaying = true;
toggle.addEventListener("click", () => {
  if (musicPlaying) { music.pause(); toggle.textContent = "🔇"; } 
  else { music.play(); toggle.textContent = "🔊"; }
  musicPlaying = !musicPlaying;
});

// Mantener el título fijo y responsive
const mainTitle = document.getElementById("main-title");
mainTitle.style.position = "fixed";
mainTitle.style.top = "20px";
mainTitle.style.left = "50%";
mainTitle.style.transform = "translateX(-50%)";
mainTitle.style.zIndex = "1000";
mainTitle.style.fontSize = window.innerWidth < 768 ? "1.5rem" : "2rem";

// Eventos timeline responsive
const events = document.querySelectorAll(".event");
const timelineContainer = document.getElementById("timeline-container");

function positionEvents() {
  const minSpacing = 150;
  const timelineWidth = Math.max(events.length * minSpacing, 3000);
  timelineContainer.style.width = `${timelineWidth}px`;
  events.forEach((e, index) => {
    e.style.left = `${index * (timelineWidth / events.length) + 50}px`;
  });
}
positionEvents();
window.addEventListener("resize", positionEvents);

// Tarjeta
const cardOverlay = document.getElementById("card-overlay");
const cardImg = document.getElementById("card-img");
const cardTitle = document.getElementById("card-title");
const cardDate = document.getElementById("card-date");
const cardText = document.getElementById("card-text");
const closeCard = document.getElementById("close-card");

// Abrir tarjeta
events.forEach(ev => {
  ev.addEventListener("click", () => {
    cardImg.src = ev.dataset.img;
    cardTitle.textContent = ev.dataset.title;
    cardDate.textContent = ev.dataset.date;
    cardText.textContent = ev.dataset.text;
    cardOverlay.style.display = "flex";
    gsap.to(window, {duration: 1, scrollTo: {x: ev.offsetLeft - window.innerWidth/2 + ev.offsetWidth/2}});
  });
});

// Cerrar tarjeta
closeCard.addEventListener("click", () => { cardOverlay.style.display = "none"; });
cardOverlay.addEventListener("click", e => { if(e.target===cardOverlay) cardOverlay.style.display = "none"; });

// Scroll horizontal y gestos táctiles
let scrollMultiplier = window.innerWidth < 768 ? 1.5 : 2.5;
window.addEventListener("wheel", e => {
  e.preventDefault();
  window.scrollBy({ left: e.deltaY * scrollMultiplier, behavior:'smooth' });
},{passive:false});

let touchStartX = 0;
window.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; });
window.addEventListener("touchmove", e => {
  let touchEndX = e.touches[0].clientX;
  window.scrollBy({ left: (touchStartX - touchEndX) * scrollMultiplier });
  touchStartX = touchEndX;
});

// Click sostenido para arrastrar
let isDragging = false;
let dragStartX = 0;
window.addEventListener("mousedown", e => {
  isDragging = true;
  dragStartX = e.clientX;
  document.body.style.cursor = "grabbing";
});
window.addEventListener("mousemove", e => {
  if(isDragging){
    let delta = dragStartX - e.clientX;
    window.scrollBy({ left: delta * scrollMultiplier });
    dragStartX = e.clientX;
  }
});
window.addEventListener("mouseup", e => {
  isDragging = false;
  document.body.style.cursor = "default";
});

// ------------------- FUEGOS ARTIFICIALES -------------------
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.3; // 30% de pantalla
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor(x, y, color, vx, vy, life, size){
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.size = size;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.03;
    this.life -= 1;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(this.life/50,0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let particles = [];

function spawnFirework(){
  let x = Math.random() * canvas.width;
  let y = canvas.height - 50 - Math.random() * 50;
  let colors = ["#FFD700","#FFE066","#FFEB99","#FFF5CC"];
  let particleCount = 40;
  for(let i=0;i<particleCount;i++){
    let angle = Math.random()*Math.PI*2;
    let speed = Math.random()*5+2;
    let size = Math.random()*4+3;
    particles.push(new Particle(
      x, y,
      colors[Math.floor(Math.random()*colors.length)],
      Math.cos(angle)*speed,
      Math.sin(angle)*-speed,
      50,
      size
    ));
  }
}

setInterval(spawnFirework, 500);

function animateFireworks(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=particles.length-1;i>=0;i--){
    particles[i].update();
    particles[i].draw();
    if(particles[i].life<=0) particles.splice(i,1);
  }
  requestAnimationFrame(animateFireworks);
}
animateFireworks();
