// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };

  p.draw = function () {
    p.background(245, 245, 240);

    let progress = (p.frameCount % 300) / 300;

    // shadow
    p.noStroke();
    p.fill(200, 200, 200, 90);
    p.ellipse(p.width / 2, 470, 500, 60);

    // fill color
    p.fill(90);

    // filled part from left to right
    let fillEnd = 145 + 510 * progress;

    // side weights: darker gray
    drawFillPart(145, 330, 45, 135, fillEnd, 90);
    drawFillPart(190, 310, 70, 175, fillEnd, 90);

    // middle bar: lighter gray
    drawFillPart(260, 380, 280, 35, fillEnd, 150);

    // side weights: darker gray
    drawFillPart(540, 310, 70, 175, fillEnd, 90);
    drawFillPart(610, 330, 45, 135, fillEnd, 90);

    // dumbbell outline
    p.noFill();
    p.stroke(60);
    p.strokeWeight(6);

    p.rect(145, 330, 45, 135, 12);
    p.rect(190, 310, 70, 175, 15);
    p.rect(260, 380, 280, 35, 18);
    p.rect(540, 310, 70, 175, 15);
    p.rect(610, 330, 45, 135, 12);

    // percentage text
    p.noStroke();
    p.fill(60);
    p.textSize(36);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(Math.floor(progress * 100) + "%", p.width / 2, 560);

    // frame
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  function drawFillPart(x, y, w, h, fillEnd, fillColor) {
    let filledWidth = fillEnd - x;
  
    if (filledWidth <= 0) {
      return;
    }
  
    if (filledWidth > w) {
      filledWidth = w;
    }
  
    p.noStroke();
    p.fill(fillColor);
    p.rect(x, y, filledWidth, h, 12);
  }
  
  p.windowResized = function () {
    p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };
});
