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

function completeSLAP(){
  showSection("declareSection");
}

// 🎨 CANVAS CARD GENERATOR
function generateCard(){
  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");

  const name = document.getElementById("userName").value || "I";
  const verse = document.getElementById("declareVerse").innerText;

  // background
  ctx.fillStyle = "#f43f5e";
  ctx.fillRect(0,0,400,500);

  // title
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Inter";
  ctx.fillText("I SPEAK & DECLARE", 50, 60);

  // verse
  ctx.font = "16px Inter";
  wrapText(ctx, verse, 40, 150, 320, 22);

  // name
  ctx.font = "bold 18px Inter";
  ctx.fillText("- " + name, 150, 400);
}

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