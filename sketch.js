<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cyber Ethics Game FINAL+</title>
<script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js"></script>
</head>
<body>
<script>

let scene = 0;
let questionIndex = 0;
let username = "";
let inputBox;
let score = 0;
let leaderboard = [];

let displayText = "";
let charIndex = 0;

let confetti = [];
let pixels = [];

// NEXT PLAYER BUTTON
let nextBtn = {x:0,y:0,w:200,h:50};

// QUESTIONS
const questionsRaw = [
{
text:"A classmate sends you answers to a quiz.",
options:["Use it","Ignore it","Report it","Share it"],
scores:[0,3,5,0]
},
{
text:"Fake FB account using your friend’s photo.",
options:["Ignore","Report","Message it","Follow it"],
scores:[3,5,0,0]
},
{
text:"Groupmate copies from Google.",
options:["Let it pass","Tell teacher","Ask to cite","Copy too"],
scores:[0,3,5,0]
},
{
text:"Someone asks your password.",
options:["Give it","Ignore","Report","Change password"],
scores:[0,3,5,3]
},
{
text:"You see cyberbullying.",
options:["Join","Ignore","Report","Laugh"],
scores:[0,3,5,0]
}
];

let questions=[];

function shuffleOptions(q){
let combined = q.options.map((opt,i)=>({opt:opt, score:q.scores[i]}));
for(let i=combined.length-1;i>0;i--){
let j = floor(random(i+1));
[combined[i],combined[j]]=[combined[j],combined[i]];
}
return {
text:q.text,
options:combined.map(x=>x.opt),
scores:combined.map(x=>x.score)
};
}

// ---------------- SETUP ----------------
function setup(){
createCanvas(windowWidth,windowHeight);
textAlign(CENTER,CENTER);

initGame();

let saved = localStorage.getItem("leaderboardFinal");
if(saved) leaderboard = JSON.parse(saved);

inputBox = createInput();
inputBox.position(width/2-100,height/2);
inputBox.size(200);

// pixels
for(let i=0;i<120;i++){
pixels.push({
x: random(width),
y: random(height),
size: random(3,6),
speed: random(0.3,1),
col: color(random(200,255), random(100,200), 255,150)
});
}

// next button position
nextBtn.x = width/2 - 100;
nextBtn.y = height - 120;
}

// RESET GAME
function initGame(){
questions = questionsRaw.map(q=>shuffleOptions(q));
questionIndex = 0;
score = 0;
displayText = "";
charIndex = 0;
}

// ---------------- DRAW ----------------
function draw(){
drawBackground();
drawPixels();
drawConfetti();

if(scene===0) usernameScreen();
else if(scene===1) questionScreen();
else if(scene===2) leaderboardScreen();
}

// ---------------- BACKGROUND ----------------
function drawBackground(){
for(let y=0;y<height;y++){
let inter = map(y,0,height,0,1);
let c = lerpColor(color(255,150,230),color(180,120,255),inter);
stroke(c);
line(0,y,width,y);
}
noStroke();
}

function drawPixels(){
for(let p of pixels){
fill(p.col);
rect(p.x,p.y,p.size,p.size);
p.y -= p.speed;
if(p.y<0){ p.y = height; p.x = random(width); }
}
}
et i=0;i<150;i++){
let col = points===5 ? color(0,255,150) :
          points===3 ? color(255,220,0) :
                       color(255,80,150);

confetti.push({
x: random(width),
y: random(-50,0),
vx: random(-2,2),
vy: random(2,6),
size: random(5,10),
color: col,
life: 255
});
}
}

function drawConfetti(){
for(let i=confetti.length-1;i>=0;i--){
let c = confetti[i];
fill(c.color);
rect(c.x,c.y,c.size,c.size);
c.x += c.vx;
c.y += c.vy;
c.life -= 4;
if(c.life<=0) confetti.splice(i,1);
}
}

// ---------------- USERNAME ----------------
function usernameScreen(){
fill(255);
textSize(40);
text("Cyber Ethics Game",width/2,height/3);

textSize(20);
text("Enter username and press ENTER",width/2,height/3+40);
}

// ---------------- QUESTIONS ----------------
function questionScreen(){
let q = questions[questionIndex];

if(frameCount % 2 === 0 && charIndex < q.text.length){
displayText += q.text.charAt(charIndex);
charIndex++;
}

fill(255);
textSize(26);
text(displayText,width/2,height/3);

for(let i=0;i<q.options.length;i++){
drawButton(width/2-150,height/2 + i*60,300,50,String.fromCharCode(65+i)+": "+q.options[i]);
}
}

// ---------------- BUTTON ----------------
function drawButton(x,y,w,h,label){
if(mouseX>x && mouseX<x+w && mouseY>y && mouseY<y+h){
fill(255,120,220);
}else{
fill(255,150,230);
}
rect(x,y,w,h,12);
fill(255);
text(label,x+w/2,y+h/2);
}

// ---------------- LEADERBOARD ----------------
function leaderboardScreen(){

background(200,150,255);

// save/update
let existing = leaderboard.find(p=>p.name===username);
if(existing){
if(score > existing.score) existing.score = score;
}else{
leaderboard.push({name:username,score:score});
}
leaderboard.sort((a,b)=>b.score-a.score);
localStorage.setItem("leaderboardFinal",JSON.stringify(leaderboard));

// title
fill(255);
textSize(40);
text("🏆 Leaderboard",width/2,80);

textSize(22);
text("Your Score: "+score,width/2,140);

// list
for(let i=0;i<leaderboard.length;i++){
text(`${i+1}. ${leaderboard[i].name} - ${leaderboard[i].score}`,width/2,200 + i*30);
}

// NEXT PLAYER BUTTON
fill(255,120,220);
rect(nextBtn.x,nextBtn.y,nextBtn.w,nextBtn.h,12);

fill(255);
textSize(18);
text("Next Player",nextBtn.x + nextBtn.w/2, nextBtn.y + nextBtn.h/2);
}

// ---------------- INPUT ----------------
function mousePressed(){

// QUESTIONS
if(scene===1){
let q = questions[questionIndex];

for(let i=0;i<q.options.length;i++){
let y = height/2 + i*60;

if(mouseY>y && mouseY<y+50){
let pts = q.scores[i];
score += pts;
createConfetti(pts);

questionIndex++;
displayText="";
charIndex=0;

if(questionIndex>=questions.length){
scene=2;
}
}
}
}
// ---------------- CONFETTI ----------------
function createConfetti(points){
for(l

// NEXT PLAYER CLICK
if(scene===2){
if(mouseX>nextBtn.x && mouseX<nextBtn.x+nextBtn.w &&
   mouseY>nextBtn.y && mouseY<nextBtn.y+nextBtn.h){

// RESET EVERYTHING
username = "";
inputBox.value("");
inputBox.show();
scene = 0;
initGame();

}
}
}

// ENTER
function keyPressed(){
if(scene===0 && keyCode===ENTER){
let val = inputBox.value().trim();
if(val!==""){
username = val;
scene=1;
inputBox.hide();
}
}
}

</script>
</body>
</html>