// MENU
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");

menuBtn.onclick = () => {
  mobileMenu.classList.toggle("active");
  menuIcon.textContent = mobileMenu.classList.contains("active") ? "✕" : "☰";
};

// NAVIGATION
function showSection(id){
  document.querySelectorAll("section").forEach(sec=>{
    sec.classList.add("hidden");
    sec.classList.remove("show");
  });

  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("show");
}

// FLOW
function startPlan(){
  showSection("dashboard");
}

// FLOW
function startPlan(){
  showSection("dashboard");
}

function completeSLAP(){
  showSection("declareSection");
  setTimeout(generateCard, 50);
}

// 🎨 CANVAS CARD GENERATOR
function generateCard(){
  const canvas = document.getElementById("cardCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const nameInput = document.getElementById("userName");
  const name = nameInput ? nameInput.value.trim() : "";
  const verseEl = document.getElementById("declareVerse");
  const verse = verseEl ? verseEl.innerText.trim() : "For God so loved the world - John 3:16";

  const W = canvas.width || 400;
  const H = canvas.height || 500;

  // Background
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    renderCanvasContent(img);
  };
  img.onerror = () => {
    renderCanvasContent(null);
  };
  img.src = "./web-client/public/bg-sanctuary.png";

  function renderCanvasContent(bgImg) {
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, W, H);
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(0, 0, W, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#120d08");
      grad.addColorStop(0.5, "#241a10");
      grad.addColorStop(1, "#0e0a06");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // Top Header: ISPEAK & IDECLARE
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 18px Inter, serif";
    ctx.fillStyle = "#e5c07b";
    ctx.fillText("ISPEAK & IDECLARE", W / 2, 45);

    ctx.strokeStyle = "rgba(212, 160, 23, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, 53);
    ctx.lineTo(W / 2 + 60, 53);
    ctx.stroke();
    ctx.restore();

    // Inner Card Container Frame
    const cardTop = 68;
    const cardBottom = H - 55;
    const cardMarginX = 25;
    const cardWidth = W - (cardMarginX * 2);
    const cardHeight = cardBottom - cardTop;

    ctx.save();
    ctx.fillStyle = "rgba(18, 14, 10, 0.75)";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, 14);
    } else {
      ctx.rect(cardMarginX, cardTop, cardWidth, cardHeight);
    }
    ctx.fill();
    ctx.strokeStyle = "rgba(212, 160, 23, 0.55)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Quotation Marks
    ctx.save();
    ctx.font = "italic 28px serif";
    ctx.fillStyle = "rgba(212, 160, 23, 0.6)";
    ctx.textAlign = "left";
    ctx.fillText("“", cardMarginX + 15, cardTop + 35);
    ctx.textAlign = "right";
    ctx.fillText("”", cardMarginX + cardWidth - 15, cardBottom - 45);
    ctx.restore();

    // Scripture Declaration / Verse
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic bold 17px Georgia, serif";
    wrapText(ctx, verse, W / 2, cardTop + 60, cardWidth - 35, 26);
    ctx.restore();

    // Declarant: [Name] - ONLY rendered when declarant enters His/Her Name
    if (name) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 15px Inter, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Declarant: " + name, W / 2, cardBottom - 20);
      ctx.restore();
    }

    // Bottom Footer Outside Card
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillStyle = "#f0eeeb";
    ctx.fillText("SLAP BIBLE PATTERN CHALLENGE", W / 2, H - 30);
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = "rgba(235, 230, 222, 0.7)";
    ctx.fillText("Daily Scripture Declaration & Faith Formation", W / 2, H - 14);
    ctx.restore();
  }
}

// Auto-trigger on input
document.addEventListener("DOMContentLoaded", () => {
  const userNameInput = document.getElementById("userName");
  if (userNameInput) {
    userNameInput.addEventListener("input", generateCard);
  }
  generateCard();
});

// TEXT WRAP FUNCTION
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  let words = text.split(" ");
  let line = "";

  for(let n = 0; n < words.length; n++){
    let testLine = line + words[n] + " ";
    let metrics = ctx.measureText(testLine);
    let width = metrics.width;

    if(width > maxWidth && n > 0){
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// DOWNLOAD
function downloadCard(){
  const canvas = document.getElementById("cardCanvas");
  const link = document.createElement("a");

  link.download = "slap-declaration.png";
  link.href = canvas.toDataURL();
  link.click();
}

// VIDEO
let videos = [
  "https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1&mute=1",
  "https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=1&mute=1"
];

let currentVideo = 0;

function updateVideo(){
  document.getElementById("videoPlayer").src = videos[currentVideo];
}

function nextVideo(){
  currentVideo = (currentVideo + 1) % videos.length;
  updateVideo();
}

function prevVideo(){
  currentVideo = (currentVideo - 1 + videos.length) % videos.length;
  updateVideo();
}