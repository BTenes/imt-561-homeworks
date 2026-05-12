// Instance-mode sketch for tab 15
registerSketch("sk15", function (p) {
  let pacersTable;
  let knicksTable;

  let pacers = [];
  let knicks = [];

  let selectedPacers = 0;
  let selectedKnicks = 0;

  let pacersLogo = null;
  let knicksLogo = null;
  let playerImages = {};

  const CANVAS_W = 1320;
  const CANVAS_H = 1280;

  const metrics = ["PTS", "TRB", "AST", "STL", "BLK", "FG%", "3P%"];
  let maxValues = {};

  p.preload = function () {
    pacersTable = p.loadTable(
      "data/Pacers VS Knicks Basic Stats - Pacers.csv",
      "csv",
      "header"
    );

    knicksTable = p.loadTable(
      "data/Pacers VS Knicks Basic Stats - Knicks.csv",
      "csv",
      "header"
    );

    pacersLogo = p.loadImage(
      "images/Indiana_Pacers.svg.png",
      function () {},
      function () {
        pacersLogo = null;
      }
    );

    knicksLogo = p.loadImage(
      "images/New_York_Knicks_logo.svg",
      function () {},
      function () {
        knicksLogo = null;
      }
    );

    loadPlayerPhotos();
  };

  p.setup = function () {
    p.createCanvas(CANVAS_W, CANVAS_H);
    p.textFont("Arial");
    loadPlayers();
    calculateMaxValues();
    p.noLoop();
  };

  p.draw = function () {
    p.background("#f8fafc");

    drawTitle();

    drawTeamPanel({
      x: 40,
      y: 185,
      w: 600,
      h: 1080,
      teamName: "PACERS",
      teamColor: "#FDBB30",
      darkColor: "#002D62",
      logo: pacersLogo,
      players: pacers,
      selectedIndex: selectedPacers,
      side: "left",
    });

    drawTeamPanel({
      x: 680,
      y: 185,
      w: 600,
      h: 1080,
      teamName: "KNICKS",
      teamColor: "#F58426",
      darkColor: "#006BB6",
      logo: knicksLogo,
      players: knicks,
      selectedIndex: selectedKnicks,
      side: "right",
    });
  };

  p.mousePressed = function () {
    checkPlayerButtons(pacers, "left");
    checkPlayerButtons(knicks, "right");
  };

  function loadPlayerPhotos() {
    const photoFiles = {
      "Tyrese Haliburton": "images/Tyrese Haliburton.png",
      "Andrew Nembhard": "images/Andrew Nembhard.png",
      "Aaron Nesmith": "images/Aaron Nesmith.png",
      "Pascal Siakam": "images/Pascal Siakam.png",
      "Myles Turner": "images/Myles Turner.png",

      "Jalen Brunson": "images/Jalen Brunson.png",
      "Mikal Bridges": "images/Mikal Bridges.png",
      "OG Anunoby": "images/OG Anunoby.png",
      "Josh Hart": "images/Josh Hart.png",
      "Karl-Anthony Towns": "images/Karl-Anthony Towns.png",
    };

    for (const name in photoFiles) {
      playerImages[name] = p.loadImage(
        photoFiles[name],
        function () {},
        function () {
          playerImages[name] = null;
        }
      );
    }
  }

  function loadPlayers() {
    pacers = [];
    knicks = [];

    const pacersStarters = [
      { name: "Tyrese Haliburton", position: "PG" },
      { name: "Andrew Nembhard", position: "SG" },
      { name: "Aaron Nesmith", position: "SF" },
      { name: "Pascal Siakam", position: "PF" },
      { name: "Myles Turner", position: "C" },
    ];

    const knicksStarters = [
      { name: "Jalen Brunson", position: "PG" },
      { name: "Mikal Bridges", position: "SG" },
      { name: "OG Anunoby", position: "SF" },
      { name: "Josh Hart", position: "PF/SF" },
      { name: "Karl-Anthony Towns", position: "C" },
    ];

    for (let r = 0; r < pacersTable.getRowCount(); r++) {
      const row = pacersTable.getRow(r);
      const player = makePlayer(row, "Pacers");
      const starter = findStarter(pacersStarters, player.name);

      if (starter) {
        player.position = starter.position;
        player.photo = playerImages[player.name] || null;
        pacers.push(player);
      }
    }

    for (let r = 0; r < knicksTable.getRowCount(); r++) {
      const row = knicksTable.getRow(r);
      const player = makePlayer(row, "Knicks");
      const starter = findStarter(knicksStarters, player.name);

      if (starter) {
        player.position = starter.position;
        player.photo = playerImages[player.name] || null;
        knicks.push(player);
      }
    }

    pacers.sort(function (a, b) {
      return (
        getStarterIndex(pacersStarters, a.name) -
        getStarterIndex(pacersStarters, b.name)
      );
    });

    knicks.sort(function (a, b) {
      return (
        getStarterIndex(knicksStarters, a.name) -
        getStarterIndex(knicksStarters, b.name)
      );
    });
  }

  function findStarter(list, name) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === name) {
        return list[i];
      }
    }
    return null;
  }

  function getStarterIndex(list, name) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === name) {
        return i;
      }
    }
    return 999;
  }

  function makePlayer(row, teamName) {
    return {
      team: teamName,
      name: cleanText(row.getString("Player")),
      position: "",
      photo: null,
      age: cleanNumber(row.getString("Age")),
      fg: cleanNumber(row.getString("FG%")),
      three: cleanNumber(row.getString("3P%")),
      ft: cleanNumber(row.getString("FT%")),
      mp: cleanNumber(row.getString("MP")),
      pts: cleanNumber(row.getString("PTS")),
      trb: cleanNumber(row.getString("TRB")),
      ast: cleanNumber(row.getString("AST")),
      stl: cleanNumber(row.getString("STL")),
      blk: cleanNumber(row.getString("BLK")),
    };
  }

  function cleanText(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).trim();
  }

  function cleanNumber(value) {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const cleaned = String(value).replace("%", "").replace(",", "").trim();
    const num = Number(cleaned);

    if (isNaN(num)) {
      return 0;
    }

    return num;
  }

  function calculateMaxValues() {
    const allPlayers = pacers.concat(knicks);

    maxValues = {
      PTS: 0,
      TRB: 0,
      AST: 0,
      STL: 0,
      BLK: 0,
      "FG%": 0,
      "3P%": 0,
    };

    for (const player of allPlayers) {
      maxValues["PTS"] = Math.max(maxValues["PTS"], player.pts);
      maxValues["TRB"] = Math.max(maxValues["TRB"], player.trb);
      maxValues["AST"] = Math.max(maxValues["AST"], player.ast);
      maxValues["STL"] = Math.max(maxValues["STL"], player.stl);
      maxValues["BLK"] = Math.max(maxValues["BLK"], player.blk);
      maxValues["FG%"] = Math.max(maxValues["FG%"], player.fg);
      maxValues["3P%"] = Math.max(maxValues["3P%"], player.three);
    }
  }

  function drawTitle() {
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);

    p.fill("#111827");
    p.textStyle(p.BOLD);
    p.textSize(60);
    p.text("Pacers vs Knicks", p.width / 2, 72);

    p.textSize(30);
    p.fill("#374151");
    p.text("2025 East Finals Starter Showdown", p.width / 2, 123);

    p.textStyle(p.NORMAL);
    p.textSize(21);
    p.fill("#6b7280");
    p.text(
      "Click one starter from each team to compare their performance.",
      p.width / 2,
      155
    );
  }

  function drawTeamPanel(config) {
    const x = config.x;
    const y = config.y;
    const w = config.w;
    const h = config.h;
    const teamName = config.teamName;
    const teamColor = config.teamColor;
    const darkColor = config.darkColor;
    const logo = config.logo;
    const players = config.players;
    const selectedIndex = config.selectedIndex;
    const side = config.side;

    p.noStroke();
    p.fill("#ffffff");
    p.rect(x, y, w, h, 28);

    p.fill(darkColor);
    p.rect(x, y, w, 20, 28, 28, 0, 0);

    drawLogoWatermark(x, y, w, h, logo, teamName, darkColor);

    p.noStroke();
    p.fill(darkColor);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(40);
    p.text(teamName, x + w / 2, y + 65);

    if (players.length === 0) {
      p.fill("#111827");
      p.textSize(24);
      p.text("No starter data loaded", x + w / 2, y + h / 2);
      return;
    }

    const selectedPlayer = players[selectedIndex];

    drawPlayerButtons(
      players,
      x + 40,
      y + 110,
      w - 80,
      selectedIndex,
      side,
      teamColor,
      darkColor
    );

    p.noStroke();
    p.fill("#111827");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(28);
    p.text(
      selectedPlayer.name + " (" + selectedPlayer.position + ")",
      x + w / 2,
      y + 395
    );

    // Photo and radar chart are placed in the same row.
    // The photo uses bottom alignment, so different player photos stay visually consistent.
    drawPlayerPhoto(selectedPlayer, x + 165, y + 840, 330, 360);

    drawRadarChart(
      selectedPlayer,
      x + 430,
      y + 645,
      155,
      teamColor,
      darkColor
    );

    drawAllStatsGrid(selectedPlayer, x + 40, y + 875, w - 80);
  }

  function drawLogoWatermark(x, y, w, h, logo, teamName, darkColor) {
    p.push();

    if (logo) {
      p.tint(255, 18);
      p.imageMode(p.CENTER);
      p.image(logo, x + w / 2, y + h / 2 + 20, 330, 330);
      p.noTint();
    } else {
      p.fill(hexToR(darkColor), hexToG(darkColor), hexToB(darkColor), 18);
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(70);
      p.text(teamName, x + w / 2, y + h / 2 + 20);
    }

    p.pop();
  }

  function drawPlayerButtons(
    players,
    x,
    y,
    w,
    selectedIndex,
    side,
    teamColor,
    darkColor
  ) {
    const buttonH = 38;
    const gap = 10;

    for (let i = 0; i < players.length; i++) {
      const buttonY = y + i * (buttonH + gap);
      const label = players[i].name + " (" + players[i].position + ")";

      if (i === selectedIndex) {
        p.fill(teamColor);
        p.stroke(darkColor);
        p.strokeWeight(2);
      } else {
        p.fill("#ffffff");
        p.stroke("#d1d5db");
        p.strokeWeight(1);
      }

      p.rect(x, buttonY, w, buttonH, 18);

      p.noStroke();
      p.fill("#111827");
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.textStyle(i === selectedIndex ? p.BOLD : p.NORMAL);
      p.text(label, x + w / 2, buttonY + buttonH / 2);

      players[i].button = {
        x: x,
        y: buttonY,
        w: w,
        h: buttonH,
        side: side,
        index: i,
      };
    }
  }

  function checkPlayerButtons(players, side) {
    for (let i = 0; i < players.length; i++) {
      const b = players[i].button;

      if (
        b &&
        p.mouseX >= b.x &&
        p.mouseX <= b.x + b.w &&
        p.mouseY >= b.y &&
        p.mouseY <= b.y + b.h
      ) {
        if (side === "left") {
          selectedPacers = i;
        } else {
          selectedKnicks = i;
        }

        p.redraw();
      }
    }
  }

  function drawPlayerPhoto(player, cx, bottomY, maxW, maxH) {
    if (!player.photo) {
      p.fill("#9ca3af");
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(18);
      p.text("No photo", cx, bottomY - maxH / 2);
      return;
    }

    const img = player.photo;
    const imgRatio = img.width / img.height;
    const boxRatio = maxW / maxH;

    let drawW;
    let drawH;

    if (imgRatio > boxRatio) {
      drawW = maxW;
      drawH = maxW / imgRatio;
    } else {
      drawH = maxH;
      drawW = maxH * imgRatio;
    }

    p.imageMode(p.CENTER);
    p.image(img, cx, bottomY - drawH / 2, drawW, drawH);
  }

  function drawRadarChart(player, cx, cy, radius, fillColor, lineColor) {
    const levels = 5;
    const angleStep = p.TWO_PI / metrics.length;

    p.stroke("#d1d5db");
    p.strokeWeight(1);
    p.noFill();

    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      p.beginShape();

      for (let i = 0; i < metrics.length; i++) {
        const angle = -p.HALF_PI + i * angleStep;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        p.vertex(px, py);
      }

      p.endShape(p.CLOSE);
    }

    for (let i = 0; i < metrics.length; i++) {
      const angle = -p.HALF_PI + i * angleStep;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;

      p.stroke("#e5e7eb");
      p.line(cx, cy, px, py);

      const labelX = cx + Math.cos(angle) * (radius + 40);
      const labelY = cy + Math.sin(angle) * (radius + 40);

      p.noStroke();
      p.fill("#374151");
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(16);
      p.text(metrics[i], labelX, labelY);
    }

    p.beginShape();

    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i];
      const rawValue = getMetricValue(player, metric);
      const normalizedValue =
        maxValues[metric] === 0 ? 0 : rawValue / maxValues[metric];

      const r = normalizedValue * radius;
      const angle = -p.HALF_PI + i * angleStep;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      p.fill(hexToR(fillColor), hexToG(fillColor), hexToB(fillColor), 90);
      p.stroke(lineColor);
      p.strokeWeight(3);
      p.vertex(px, py);
    }

    p.endShape(p.CLOSE);

    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i];
      const rawValue = getMetricValue(player, metric);
      const normalizedValue =
        maxValues[metric] === 0 ? 0 : rawValue / maxValues[metric];

      const r = normalizedValue * radius;
      const angle = -p.HALF_PI + i * angleStep;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      p.noStroke();
      p.fill(lineColor);
      p.circle(px, py, 8);
    }
  }

  function drawAllStatsGrid(player, x, y, w) {
    const items = [
      ["PTS", formatValue(player.pts, 1)],
      ["TRB", formatValue(player.trb, 1)],
      ["AST", formatValue(player.ast, 1)],
      ["STL", formatValue(player.stl, 1)],
      ["BLK", formatValue(player.blk, 1)],
      ["FG%", formatValue(player.fg, 3)],
      ["3P%", formatValue(player.three, 3)],
    ];

    const colsTop = 4;
    const colsBottom = 3;
    const gap = 12;
    const boxH = 68;

    const boxWTop = (w - gap * (colsTop - 1)) / colsTop;
    const boxWBottom = (w - gap * (colsBottom - 1)) / colsBottom;

    for (let i = 0; i < 4; i++) {
      const bx = x + i * (boxWTop + gap);
      drawStatBox(bx, y, boxWTop, boxH, items[i][0], items[i][1]);
    }

    for (let i = 0; i < 3; i++) {
      const bx = x + i * (boxWBottom + gap);
      drawStatBox(
        bx,
        y + boxH + 14,
        boxWBottom,
        boxH,
        items[i + 4][0],
        items[i + 4][1]
      );
    }
  }

  function drawStatBox(x, y, w, h, label, value) {
    p.noStroke();
    p.fill("#f3f4f6");
    p.rect(x, y, w, h, 14);

    p.fill("#6b7280");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.NORMAL);
    p.textSize(13);
    p.text(label, x + w / 2, y + 21);

    p.fill("#111827");
    p.textStyle(p.BOLD);
    p.textSize(18);
    p.text(value, x + w / 2, y + 47);
  }

  function formatValue(value, digits) {
    return Number(value).toFixed(digits);
  }

  function getMetricValue(player, metric) {
    if (metric === "PTS") return player.pts;
    if (metric === "TRB") return player.trb;
    if (metric === "AST") return player.ast;
    if (metric === "STL") return player.stl;
    if (metric === "BLK") return player.blk;
    if (metric === "FG%") return player.fg;
    if (metric === "3P%") return player.three;
    return 0;
  }

  function drawInsight() {
    if (pacers.length === 0 || knicks.length === 0) {
      return;
    }

    const pPlayer = pacers[selectedPacers];
    const kPlayer = knicks[selectedKnicks];

    const pBest = getBestMetric(pPlayer);
    const kBest = getBestMetric(kPlayer);

    const scoringWinner =
      pPlayer.pts > kPlayer.pts ? pPlayer.name : kPlayer.name;

    const insight =
      pBest.name +
      " leads in " +
      pBest.label +
      ", while " +
      kBest.name +
      " leads in " +
      kBest.label +
      ". " +
      scoringWinner +
      " has the higher scoring average.";

    p.noStroke();
    p.fill("#111827");
    p.textAlign(p.CENTER, p.CENTER);

    p.textStyle(p.BOLD);
    p.textSize(30);
    p.text("Comparison insight", p.width / 2, 1350);

    p.fill("#374151");
    p.textStyle(p.NORMAL);
    p.textSize(23);
    p.text(insight, p.width / 2, 1398, 980);
  }

  function getBestMetric(player) {
    let bestMetric = metrics[0];
    let bestScore = 0;

    for (const metric of metrics) {
      const value = getMetricValue(player, metric);
      const score = maxValues[metric] === 0 ? 0 : value / maxValues[metric];

      if (score > bestScore) {
        bestScore = score;
        bestMetric = metric;
      }
    }

    let label = bestMetric;

    if (bestMetric === "PTS") label = "scoring";
    if (bestMetric === "TRB") label = "rebounding";
    if (bestMetric === "AST") label = "playmaking";
    if (bestMetric === "STL") label = "steals";
    if (bestMetric === "BLK") label = "shot blocking";
    if (bestMetric === "FG%") label = "field goal efficiency";
    if (bestMetric === "3P%") label = "three-point shooting";

    return {
      name: player.name,
      label: label,
    };
  }

  function drawFootnote() {
    p.noStroke();
    p.fill("#6b7280");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.NORMAL);

    p.textSize(16);
    p.text(
      "Radar values are scaled for fair comparison across different metrics.",
      p.width / 2,
      1445,
      980
    );

    p.textSize(14);
    p.text(
      "Data: Pacers vs Knicks basic player stats. Click player names to compare starters.",
      p.width / 2,
      1480
    );
  }

  function hexToR(hex) {
    return parseInt(hex.slice(1, 3), 16);
  }

  function hexToG(hex) {
    return parseInt(hex.slice(3, 5), 16);
  }

  function hexToB(hex) {
    return parseInt(hex.slice(5, 7), 16);
  }
});