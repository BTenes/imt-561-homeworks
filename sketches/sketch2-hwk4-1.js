// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  const CANVAS_SIZE = 800;

  let calorieGoal = 2000;
  let caloriesPerMinute = 9.3;

  let exerciseMinutes = 0;
  let caloriesBurned = 0;
  let pizzasBurned = 0;

  let isRunning = false;
  let isFinished = false;
  let lastTime = 0;

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };

  p.draw = function () {
    p.background(255, 248, 238);

    let centerX = p.width / 2;
    let centerY = p.height / 2 - 100;
    let size = 360;

    if (isRunning && !isFinished) {
      let currentTime = p.millis();
      let elapsedSeconds = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
    
      exerciseMinutes += elapsedSeconds / 60;
      caloriesBurned += caloriesPerMinute * (elapsedSeconds / 60);
    
      if (caloriesBurned >= calorieGoal) {
        caloriesBurned = 0;
        pizzasBurned += 1;
      }
    }

    let progress = caloriesBurned / calorieGoal;
    progress = p.constrain(progress, 0, 1);

    let startAngle = -p.HALF_PI;
    let endAngle = startAngle + progress * p.TWO_PI;

    p.noStroke();
    p.fill(70, 40, 20);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(40);
    p.text("Pizza Calorie Clock", centerX, 50);

    // plate
    p.fill(235, 230, 220);
    p.stroke(120, 90, 60);
    p.strokeWeight(5);
    p.ellipse(centerX, centerY, size, size);

    // crust
    p.noFill();
    p.stroke(170, 100, 40);
    p.strokeWeight(20);
    p.ellipse(centerX, centerY, size, size);

    // pizza fill
    p.fill(255, 190, 80);
    p.stroke(190, 90, 40);
    p.strokeWeight(3);
    p.arc(centerX, centerY, size - 25, size - 25, startAngle, endAngle, p.PIE);

    p.fill(255, 215, 120, 180);
    p.noStroke();
    p.arc(centerX, centerY, size - 60, size - 60, startAngle, endAngle, p.PIE);

    drawToppings(centerX, centerY, progress);
    drawRunner(centerX, centerY, size, progress);

    // center text on top
    p.fill(70, 40, 20);
    p.textSize(17);
    p.text("Calories Burned", centerX, centerY - 20);

    p.textSize(42);
    p.text(Math.round(caloriesBurned), centerX, centerY + 28);

    p.textSize(17);
    p.text("/ " + calorieGoal + " kcal", centerX, centerY + 62);

    // message
    p.noStroke();
    p.fill(70, 40, 20);
    p.textSize(20);

    if (isFinished) {
      p.text("Click Start to begin training.", centerX, 515);
    } else if (!isRunning && exerciseMinutes > 0) {
      p.text("Click Resume to continue training.", centerX, 515);
    } else if (pizzasBurned > 0) {
      let pizzaText = pizzasBurned === 1 ? "pizza" : "pizzas";
      p.text(
        "Congrats! You burned enough calories for " + pizzasBurned + " " + pizzaText + "!",
        centerX,
        515
      );
    } else if (isRunning) {
      p.text("Keep going! Your pizza is filling up!", centerX, 515);
    } else {
      p.text("Click Start to begin training.", centerX, 515);
    }

    drawInfoCard(180, 590, "calories", Math.round(totalCalories()) + " kcal", "total burned");
    drawInfoCard(400, 590, "exercise", formatTime(exerciseMinutes), "duration");
    drawInfoCard(620, 590, "progress", Math.round(progress * 100) + "%", "completed");

    drawButton(250, 705, "Start");
    drawButton(400, 705, isRunning ? "Pause" : "Resume");
    drawButton(550, 705, "End");

    if (isFinished) {
      drawSummary(centerX, 760);
    }

    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.mousePressed = function () {
    if (insideButton(250, 725)) {
      exerciseMinutes = 0;
      caloriesBurned = 0;
      pizzasBurned = 0;
      isRunning = true;
      isFinished = false;
      lastTime = p.millis();
    }

    if (insideButton(400, 725)) {
      if (!isFinished) {
        isRunning = !isRunning;
    
        if (isRunning) {
          lastTime = p.millis();
        }
      }
    }

    if (insideButton(550, 705)) {
      isRunning = false;
      isFinished = true;
    }
  };

  function totalCalories() {
    return pizzasBurned * calorieGoal + caloriesBurned;
  }

  function pizzaCountText() {
    let totalPizza = totalCalories() / calorieGoal;
    return totalPizza.toFixed(2) + " pizzas";
  }

  function drawSummary(x, y) {
    p.noStroke();
    p.fill(70, 40, 20);
    p.textSize(16);
    p.text(
      "You exercised for " +
        Math.round(exerciseMinutes) +
        " minutes and burned " +
        Math.round(totalCalories()) +
        " kcal.",
      x,
      y
    );
  }

  function drawButton(x, y, label) {
    p.fill(255);
    p.stroke(180);
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.rect(x, y, 110, 44, 12);

    p.noStroke();
    p.fill(70, 40, 20);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, x, y);

    p.rectMode(p.CORNER);
  }

  function insideButton(x, y) {
    return p.mouseX > x - 55 && p.mouseX < x + 55 && p.mouseY > y - 22 && p.mouseY < y + 22;
  }

  function drawRunner(cx, cy, size, progress) {
    let angle = -p.HALF_PI + progress * p.TWO_PI;
    let r = size / 2 + 38;
    let x = cx + Math.cos(angle) * r;
    let y = cy + Math.sin(angle) * r;

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);
    p.text("🏃", x, y);
  }

  function drawToppings(cx, cy, progress) {
    let toppings = [
      [-60, -120], [60, -110], [110, -20], [40, 80],
      [-90, 40], [10, -30], [100, 90], [-120, -40],
      [-20, 120], [130, 40], [-140, 80], [30, -150]
    ];

    let maxAngle = progress * p.TWO_PI;

    for (let i = 0; i < toppings.length; i++) {
      let x = cx + toppings[i][0];
      let y = cy + toppings[i][1];

      let angle = Math.atan2(y - cy, x - cx) + p.HALF_PI;
      if (angle < 0) angle += p.TWO_PI;

      if (angle <= maxAngle) {
        p.noStroke();
        p.fill(200, 40, 35);
        p.ellipse(x, y, 35, 35);

        p.fill(240, 90, 70);
        p.ellipse(x - 5, y - 5, 10, 10);
      }
    }
  }

  function formatTime(minutes) {
    let totalSeconds = Math.floor(minutes * 60);
  
    let hours = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;
  
    let h = String(hours).padStart(2, "0");
    let m = String(mins).padStart(2, "0");
    let s = String(secs).padStart(2, "0");
  
    return h + ":" + m + ":" + s;
  }
  
  function drawInfoCard(x, y, labelTop, mainText, labelBottom) {
    p.fill(255);
    p.stroke(220);
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.rect(x, y, 170, 75, 15);

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);

    p.fill(120);
    p.textSize(13);
    p.text(labelTop, x, y - 22);

    p.fill(70, 40, 20);
    p.textSize(20);
    p.text(mainText, x, y);

    p.fill(120);
    p.textSize(14);
    p.text(labelBottom, x, y + 22);

    p.rectMode(p.CORNER);
  }

  p.windowResized = function () {
    p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };
});