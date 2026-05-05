// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  let selectedTime = 0;
  let startTime = 0;
  let isRunning = false;
  let progress = 0;

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };

  p.draw = function () {
    p.background(245, 245, 240);

    if (isRunning) {
      let elapsed = (p.millis() - startTime) / 1000;
      progress = elapsed / selectedTime;

      if (progress >= 1) {
        progress = 1;
        isRunning = false;
      }
    }

    // shadow
    p.noStroke();
    p.fill(200, 200, 200, 90);
    p.ellipse(p.width / 2, 470, 500, 60);

    // dumbbell fill
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

    // instruction / status text
    p.noStroke();
    p.fill(60);
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(28);
    if (selectedTime === 0) {
      p.text("Choose your rest time", p.width / 2, 560);
    } else if (progress === 1) {
      p.text("Time for the next set!", p.width / 2, 560);
    } else {
      p.text(Math.floor(progress * 100) + "%", p.width / 2, 560);
    }

    // buttons
    drawButton(230, 630, 90, 50, "30s");
    drawButton(355, 630, 90, 50, "60s");
    drawButton(480, 630, 90, 50, "90s");

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

  function drawButton(x, y, w, h, label) {
    p.stroke(60);
    p.strokeWeight(3);

    if (
      p.mouseX > x &&
      p.mouseX < x + w &&
      p.mouseY > y &&
      p.mouseY < y + h
    ) {
      p.fill(220);
    } else {
      p.fill(245);
    }

    p.rect(x, y, w, h, 15);

    p.noStroke();
    p.fill(60);
    p.textSize(22);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, x + w / 2, y + h / 2);
  }

  p.mousePressed = function () {
    if (buttonClicked(230, 630, 90, 50)) {
      startTimer(30);
    }

    if (buttonClicked(355, 630, 90, 50)) {
      startTimer(60);
    }

    if (buttonClicked(480, 630, 90, 50)) {
      startTimer(90);
    }
  };

  function buttonClicked(x, y, w, h) {
    return (
      p.mouseX > x &&
      p.mouseX < x + w &&
      p.mouseY > y &&
      p.mouseY < y + h
    );
  }

  function startTimer(seconds) {
    selectedTime = seconds;
    startTime = p.millis();
    progress = 0;
    isRunning = true;
  }

  p.windowResized = function () {
    p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };
});