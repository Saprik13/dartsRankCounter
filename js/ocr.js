(function () {
  "use strict";

  const moduleUrl =
    document.currentScript?.src || new URL("./js/ocr.js", document.baseURI).href;
  const projectRoot = new URL("../", moduleUrl);
  const OCR_PATHS = {
    workerPath: new URL("vendor/tesseract/worker.min.js", projectRoot).href,
    corePath: new URL("vendor/tesseract-core", projectRoot).href,
    langPath: new URL("vendor/tessdata", projectRoot).href,
  };

  let workerPromise = null;
  let progressHandler = null;
  let lastWorkerError = "";

  async function analyze(options) {
    if (window.location.protocol === "file:") {
      const error = new Error(
        "Tesseract.js requires the application to be opened through HTTP or HTTPS.",
      );
      error.code = "FILE_PROTOCOL";
      throw error;
    }

    const {
      imageData,
      players,
      nicknameMappings = {},
      tournamentType,
      playerCount,
      groupCount,
      onProgress,
    } = options;

    if (!imageData || !Array.isArray(players) || players.length === 0) {
      throw new Error("An image and a player list are required for OCR.");
    }

    progressHandler = onProgress;

    try {
      const [worker, processedImage] = await Promise.all([
        getWorker(),
        preprocessImage(imageData),
      ]);

      const recognition = await worker.recognize(
        processedImage,
        {},
        { text: true, tsv: true },
      );
      const lines = buildLines(recognition.data);
      const results = matchPlayersToLines({
        players,
        nicknameMappings,
        lines,
        tournamentType,
        playerCount,
        groupCount,
      });

      return {
        results,
        rawText: recognition.data.text || "",
        lines,
      };
    } catch (cause) {
      const error =
        cause instanceof Error
          ? cause
          : new Error(
              String(cause?.message || cause || lastWorkerError || "OCR worker failed."),
            );
      if (/fetch|network|load failed|failed to load|importscripts/i.test(error.message)) {
        error.code = "ASSET_FETCH_FAILED";
      }
      throw error;
    } finally {
      progressHandler = null;
    }
  }

  async function getWorker() {
    if (!window.Tesseract?.createWorker) {
      throw new Error("Tesseract.js engine is not loaded.");
    }

    if (!workerPromise) {
      workerPromise = window.Tesseract.createWorker(["ukr", "eng"], 1, {
        ...OCR_PATHS,
        gzip: true,
        workerBlobURL: false,
        logger(message) {
          if (!progressHandler) return;
          const phase = message.status === "recognizing text" ? "recognizing" : "loading";
          progressHandler({
            phase,
            progress: Number.isFinite(message.progress) ? message.progress : 0,
            status: message.status || "",
          });
        },
        errorHandler(error) {
          lastWorkerError = String(error?.message || error || "OCR worker failed.");
          console.error("Tesseract worker error", error);
        },
      })
        .then(async (worker) => {
          lastWorkerError = "";
          await worker.setParameters({
            tessedit_pageseg_mode: "11",
            preserve_interword_spaces: "1",
          });
          return worker;
        })
        .catch((error) => {
          workerPromise = null;
          throw error;
        });
    }

    return workerPromise;
  }

  async function preprocessImage(imageData) {
    const image = await loadImage(imageData);
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    const scale =
      longestSide < 1800
        ? Math.min(2, 1800 / longestSide)
        : Math.min(1, 3000 / longestSide);

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    let luminanceTotal = 0;
    const sampleStep = Math.max(4, Math.floor(pixels.data.length / 40000 / 4) * 4);
    let sampleCount = 0;

    for (let index = 0; index < pixels.data.length; index += sampleStep) {
      luminanceTotal +=
        pixels.data[index] * 0.299 +
        pixels.data[index + 1] * 0.587 +
        pixels.data[index + 2] * 0.114;
      sampleCount += 1;
    }

    const invert = sampleCount > 0 && luminanceTotal / sampleCount < 105;

    for (let index = 0; index < pixels.data.length; index += 4) {
      let gray =
        pixels.data[index] * 0.299 +
        pixels.data[index + 1] * 0.587 +
        pixels.data[index + 2] * 0.114;
      if (invert) gray = 255 - gray;
      gray = Math.max(0, Math.min(255, (gray - 128) * 1.28 + 128));
      pixels.data[index] = gray;
      pixels.data[index + 1] = gray;
      pixels.data[index + 2] = gray;
    }

    context.putImageData(pixels, 0, 0);
    return canvas;
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not decode the selected image."));
      image.src = source;
    });
  }

  function buildLines(data) {
    const lines = parseTsv(data.tsv || "");
    if (lines.length > 0) return lines;

    return String(data.text || "")
      .split(/\r?\n/)
      .map((text, index) => ({
        text: text.trim(),
        normalized: normalizeText(text),
        confidence: Number(data.confidence) || 0,
        top: index * 20,
        left: 0,
        words: [],
      }))
      .filter((line) => line.text);
  }

  function parseTsv(tsv) {
    const rows = String(tsv).split(/\r?\n/);
    if (rows.length < 2) return [];

    const grouped = new Map();
    for (const row of rows.slice(1)) {
      if (!row.trim()) continue;
      const columns = row.split("\t");
      if (columns.length < 12 || columns[0] !== "5") continue;

      const text = columns.slice(11).join("\t").trim();
      if (!text) continue;

      const key = `${columns[1]}:${columns[2]}:${columns[3]}:${columns[4]}`;
      const word = {
        text,
        normalized: normalizeText(text),
        left: Number(columns[6]) || 0,
        top: Number(columns[7]) || 0,
        width: Number(columns[8]) || 0,
        height: Number(columns[9]) || 0,
        confidence: Math.max(0, Number(columns[10]) || 0),
      };

      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(word);
    }

    return Array.from(grouped.values())
      .map((words) => {
        words.sort((left, right) => left.left - right.left);
        const confidentWords = words.filter((word) => word.confidence > 0);
        const confidence = confidentWords.length
          ? confidentWords.reduce((sum, word) => sum + word.confidence, 0) /
            confidentWords.length
          : 0;
        const text = words.map((word) => word.text).join(" ");
        return {
          text,
          normalized: normalizeText(text),
          confidence,
          top: Math.min(...words.map((word) => word.top)),
          left: Math.min(...words.map((word) => word.left)),
          words,
        };
      })
      .sort((left, right) => left.top - right.top || left.left - right.left);
  }

  function matchPlayersToLines(options) {
    const {
      players,
      nicknameMappings,
      lines,
      tournamentType,
      playerCount,
      groupCount,
    } = options;

    const matches = players.map((player) => {
      const aliases = buildAliases(player.name, nicknameMappings);
      let best = null;

      for (const line of lines) {
        const score = scoreLine(line, aliases);
        if (!best || score > best.score) best = { line, score };
      }

      if (!best || best.score < 0.58) {
        return {
          name: player.name,
          detectedAs: "",
          place: "",
          confidence: "low",
          top: Number.POSITIVE_INFINITY,
          matchScore: best?.score || 0,
        };
      }

      const place = detectPlace(best.line, {
        tournamentType,
        playerCount,
        groupCount,
      });
      const combinedScore = best.score * 0.78 + (best.line.confidence / 100) * 0.22;
      let confidence = combinedScore >= 0.84 ? "high" : "mid";
      if (!place && confidence === "high") confidence = "mid";

      return {
        name: player.name,
        detectedAs: best.line.text.slice(0, 120),
        place,
        confidence,
        top: best.line.top,
        matchScore: best.score,
      };
    });

    if (tournamentType === "single_group") {
      inferSingleGroupOrder(matches, playerCount);
    }

    return matches.map(({ top, matchScore, ...result }) => result);
  }

  function buildAliases(playerName, nicknameMappings) {
    const aliases = [playerName];
    const nameParts = normalizeText(playerName).split(" ").filter(Boolean);
    if (nameParts[0]?.length >= 4) aliases.push(nameParts[0]);

    for (const [nickname, realName] of Object.entries(nicknameMappings)) {
      if (normalizeText(realName) === normalizeText(playerName)) aliases.push(nickname);
    }

    return [...new Set(aliases.map(normalizeText).filter(Boolean))];
  }

  function scoreLine(line, aliases) {
    let bestScore = 0;
    const lineWords = line.normalized.split(" ").filter(Boolean);

    for (const alias of aliases) {
      if (containsPhrase(line.normalized, alias)) {
        bestScore = Math.max(bestScore, alias.includes(" ") ? 1 : 0.96);
        continue;
      }

      const aliasWords = alias.split(" ").filter(Boolean);
      if (aliasWords.length === 0 || lineWords.length === 0) continue;

      const wordScores = aliasWords.map((aliasWord) =>
        Math.max(...lineWords.map((lineWord) => similarity(aliasWord, lineWord))),
      );
      const average =
        wordScores.reduce((sum, score) => sum + score, 0) / wordScores.length;
      const weakest = Math.min(...wordScores);
      const score = aliasWords.length === 1 ? average * 0.93 : average * 0.8 + weakest * 0.2;
      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  function containsPhrase(text, phrase) {
    return ` ${text} `.includes(` ${phrase} `);
  }

  function detectPlace(line, tournament) {
    const text = line.normalized;
    const groupPlace =
      text.match(/(?:group|груп\w*)\s*[a-zа-я]?\s*(3|4|5)\s*(?:place|місце)?/) ||
      text.match(/(3|4|5)\s*(?:place|місце)\s*(?:in\s*)?(?:group|груп\w*)/);
    if (groupPlace) return `group${groupPlace[1]}`;

    if (/перемож|winner|champion/.test(text)) return "winner";
    if (/фіналіст|finalist|runner up/.test(text)) return "finalist";
    if (/півфінал|semifinal|semi final|1\s*\/\s*2/.test(text)) return "semi";
    if (/чвертьфінал|quarterfinal|quarter final|1\s*\/\s*4/.test(text)) {
      return "quarter";
    }
    if (/1\s*\/\s*8|round of 16/.test(text)) return "eighth";
    if (/1\s*\/\s*16|round of 32/.test(text)) return "sixteenth";

    const rank = extractLeadingRank(line, tournament.playerCount);
    if (!rank) return "";
    if (tournament.tournamentType === "single_group") return String(rank);
    return rankToPlayoffPlace(rank, tournament.groupCount);
  }

  function extractLeadingRank(line, playerCount) {
    const firstWords = line.words.length
      ? line.words.slice(0, 2).map((word) => word.text)
      : line.text.split(/\s+/).slice(0, 2);

    for (const word of firstWords) {
      const match = String(word).match(/^#?(\d{1,2})(?:[.)]|st|nd|rd|th)?$/i);
      if (!match) continue;
      const rank = Number(match[1]);
      if (rank >= 1 && rank <= Math.max(7, Number(playerCount) || 0)) return rank;
    }
    return 0;
  }

  function rankToPlayoffPlace(rank, groupCount) {
    if (rank === 1) return "winner";
    if (rank === 2) return "finalist";
    if (rank <= 4) return "semi";
    if (rank <= 8) return "quarter";
    if (groupCount === 1 && rank <= 16) return "eighth";
    return "";
  }

  function inferSingleGroupOrder(matches, playerCount) {
    const recognized = matches
      .filter((match) => match.confidence !== "low" && Number.isFinite(match.top))
      .sort((left, right) => left.top - right.top);
    const minimumMatches = Math.max(2, Math.ceil(matches.length * 0.6));
    if (recognized.length < minimumMatches) return;

    recognized.slice(0, Math.min(Number(playerCount) || 7, 7)).forEach((match, index) => {
      if (!match.place) match.place = String(index + 1);
    });
  }

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase("uk-UA")
      .replace(/[’'`]/g, "")
      .replace(/[^a-zа-яіїєґ0-9/]+/giu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function similarity(left, right) {
    if (left === right) return 1;
    if (!left || !right) return 0;
    const distance = levenshtein(left, right);
    return 1 - distance / Math.max(left.length, right.length);
  }

  function levenshtein(left, right) {
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    const current = new Array(right.length + 1);

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      current[0] = leftIndex;
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
        current[rightIndex] = Math.min(
          current[rightIndex - 1] + 1,
          previous[rightIndex] + 1,
          previous[rightIndex - 1] + cost,
        );
      }
      for (let index = 0; index < current.length; index += 1) {
        previous[index] = current[index];
      }
    }

    return previous[right.length];
  }

  window.DartsOCR = {
    analyze,
    paths: { ...OCR_PATHS },
  };
})();
