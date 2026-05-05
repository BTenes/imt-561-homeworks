// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };

  p.draw = function () {
    p.background(245, 245, 240);
  
    // title
    p.fill(40);
    p.noStroke();
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Dumbbell Timer", p.width / 2, 120);
  
    // dumbbell shadow
    p.fill(200, 200, 200, 100);
    p.noStroke();
    p.ellipse(p.width / 2, 460, 450, 55);
  
    // dumbbell bar
    p.fill(90);
    p.rect(260, 380, 280, 35, 18);
  
    // left weights
    p.fill(60);
    p.rect(145, 330, 45, 135, 12);
    p.rect(190, 310, 70, 175, 15);
  
    // right weights
    p.rect(540, 310, 70, 175, 15);
    p.rect(610, 330, 45, 135, 12);
  
    // highlights
    p.fill(120);
    p.rect(158, 345, 8, 105, 5);
    p.rect(210, 330, 10, 135, 5);
    p.rect(565, 330, 10, 135, 5);
    p.rect(625, 345, 8, 105, 5);
  
    // frame
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});
