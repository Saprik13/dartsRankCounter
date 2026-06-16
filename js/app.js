  /* ─── i18n ─── */
    let currentLang = 'uk';
 
    const i18n = {
        uk: {
            appTitle: 'Рейтинг дартс',
            appSubtitle: 'Калькулятор турнірних очок',
            step1Label: 'Гравці', step2Label: 'Фото', step3Label: 'Місця', step4Label: 'Результат', litestep1Label: 'Гравці', litestep2Label: 'Місця', litestep3Label: 'Результат',
            s1Title: 'Імпорт гравців з поточним рейтингом',
            nicknameTitle: '🔗 Відповідність нікнеймів',
            btnEditNicknames: '✏️ Редагувати нікнейми',
            btnAddMapping: '+ Додати',
            btnSaveMappings: '💾 Зберегти',
            nicknamePlaceholderNick: 'Нікнейм',
            nicknamePlaceholderReal: "Повне ім'я",
            importFormatTitle: '📋 Формат вставки з Google Sheets:',
            importFormatDesc: "Прізвище Ім'я\u00a0\u00a0Tab\u00a0\u00a0Рейтинг",
            importFormatExample: 'Приклад:',
            importLabel: '📋 Вставте дані з Google Sheets:',
            importPlaceholder: "Виділіть комірки → Ctrl+C → Ctrl+V сюди",
            tournamentTypeLabel: 'Тип турніру',
            typeGroupsPlayoff: 'Кілька груп + плей-офф',
            typeSingleGroup: '1 група (до 7 гравців)',
            typeSingleGroupPlayoff: '1 група + плей-офф',
            playerCountLabel: 'Кількість учасників',
            groupCountLabel: 'Кількість груп',
            group1: '1 група', group2: '2 групи', group3opt: '3 групи', group4opt: '4 групи',
            thirdPlaceLabel: 'Треті місця у плей-офф',
            thirdAuto: 'Авто (2 групи — виходять, 3 групи — 2 кращих)',
            thirdYes: 'Виходять (всі треті місця)',
            thirdNo: 'Не виходять',
            coefLabel: 'Коефіцієнт турніру',
            schemeTitle: '📊 Схема нарахування балів',
            btnImport: '📥 Імпортувати гравців',
            btnClear: '🗑️ Очистити',
            importedTitle: '📋 Імпортовані гравці:',
            colPlayer: 'Гравець', colRating: 'Рейтинг', colPlace: 'Місце',
            colPoints: 'Бали', colNewRating: 'Новий рейтинг',
            colDetectedAs: 'Розпізнане ім\'я', colConfidence: 'Впевненість',
            colTournamentPlace: 'Місце в турнірі', colCurrentRating: 'Поточний рейтинг',
            colEarned: 'Отримано балів', colChange: 'Зміна',
            s2Title: 'Завантаження результатів (зображення)',
            s2InfoTitle: '📸 Завантажте зображення з результатами турніру',
            s2InfoDesc: 'AI (Claude Vision) автоматично розпізнає імена та місця гравців',
            s2InfoTip: 'Якщо AI не впевнений — місце можна виправити вручну на кроці 3',
            uploadTitle: 'Натисніть або перетягніть зображення сюди',
            uploadFormats: 'JPG, PNG, GIF, WebP',
            imagePreviewTitle: '🖼️ Завантажене зображення:',
            btnAnalyzeAI: '🤖 Розпізнати місця через AI',
            btnSkipAI: '⏭️ Пропустити (вручну)',
            aiStatusSending: 'Надсилаємо зображення до Claude Vision...',
            aiStatusAnalyzing: 'Claude Vision аналізує зображення...',
            aiStatusProcessing: 'Обробляємо відповідь...',
            detectedTitle: '🔍 Розпізнані місця:',
            detectedCheckTitle: '⚠️ Перевірте результати перед переходом до кроку 3',
            detectedCheckDesc: 'Місця будуть автоматично підставлені — ви зможете виправити будь-яке вручну',
            btnGoToStep3: '✅ Перейти до розподілу місць',
            btnBack: '⬅️ Назад',
            s3Title: 'Визначення місць у турнірі',
            s3InfoTitle: '🎯 Оберіть місце для кожного гравця:',
            s3InfoDesc: 'Місце визначає кількість отриманих рейтингових балів',
            s3InfoWarn: 'Якщо місце не обрано — гравець отримає 0 балів',
            scheme2Groups1: '• 1-і місця груп → одразу в <strong>півфінал</strong>',
            scheme2Groups2: '• 2-3 місця груп → в <strong>чвертьфінал</strong>',
            scheme4Groups1: '• 1-і місця (4 гравці) → одразу в <strong>чвертьфінал</strong>',
            scheme4Groups2: '• 2-3 місця → в <strong>1/8 фіналу</strong>',
            schemeThirdNote: '⚠️ При 2 групах треті місця виходять за замовчуванням',
            qfWinner: '🏆 Переможець', qfFinalist: '🥈 Фіналіст', qfSemi: '🥉 Півфіналісти',
            qfQuarter: '⚔️ 1/4 фіналу', qfEighth: '⚔️ 1/8 фіналу',
            qfGroup3: '📊 Група 3 місце', qfGroup4: '📊 Група 4 місце', qfGroup5: '📊 Група 5 місце', qfClearAll: '🗑️ Очистити всі',
            btnCalculate: '🎯 Розрахувати рейтинг',
            s4Title: 'Новий рейтинг',
            btnExportCSV: '📊 Експорт в CSV',
            btnCopy: '📋 Копіювати',
            btnNewTournament: '🔄 Новий турнір',
            copiedMsg: '✅ Скопійовано!',
            // dynamic strings
            importedCount: (n) => `✅ Імпортовано ${n} гравців!`,
            importEmpty: '❌ Введіть дані для імпорту!',
            importFailed: '❌ Не вдалося розпізнати гравців. Перевірте формат даних!',
            aiError: (msg) => '❌ Помилка AI: ' + msg,
            aiParseError: 'Не вдалося розібрати відповідь AI. Спробуйте ще раз.',
            detectedCount: (h, t, p) => `Розпізнано: ${h}/${t} (${p}%)`,
            confHigh: '✅ Впевнено', confMid: '⚠️ Частково', confLow: '❓ Не знайдено',
            notDefined: '— не визначено —',
            savedMsg: '✅ Нікнейми збережено!',
            summaryType: 'Тип', summaryPlayers: 'Гравців', summaryGroups: 'Груп',
            summaryThird: 'Треті місця', summaryCoef: 'Коефіцієнт',
            third2groups: 'виходять (2 групи)', third3groups: '2 кращих (3 групи)',
            thirdNo4: 'не виходять (4+ групи)', thirdAllYes: 'виходять всі', thirdAllNo: 'не виходять',
            placeWinner: '🏆 Переможець', placeFinalist: '🥈 Фіналіст', placeSemi: '🥉 Півфіналіст',
            placeQuarter: '⚔️ 1/4 фіналу', placeEighth: '⚔️ 1/8 фіналу', placeSixteenth: '⚔️ 1/16 фіналу',
            placeGroup: (n) => `📊 Група - ${n} місце`,
            placeSelectDefault: '— Оберіть місце —',
            place1: '🏆 1 місце (переможець)', place2: '🥈 2 місце', place3: '🥉 3 місце',
            placeN: (n) => `${n} місце`,
            semiNote1: '🥉 Півфіналіст (1-е місце групи)',
            quarterNote: '⚔️ 1/4 фіналу (2-3 місця груп)',
            quarterNote4: '⚔️ 1/4 фіналу (1-і місця 4 груп)',
            eighthNote: '⚔️ 1/8 фіналу (2-3 місця груп)',
            notExit: ' (не виходить)',
            schemeCoefLine: (n, c) => `Точні бали (${n} гравців, коеф=${c})`,
            schemeWinner: '🏆 Переможець', schemeFinalist: '🥈 Фіналіст',
            schemeSemi: '🥉 Півфіналісти', schemeQuarter: '⚔️ 1/4 фіналу',
            schemeGroup3: '📊 Група - 3 місце', schemeGroup4: '📊 Група - 4 місце', schemeGroup5: '📊 Група - 5 місце',
            schemeThirdOut: ' <em style="color:var(--muted)">(не виходить)</em>',
            thirdNote2: 'При 2 групах треті місця виходять в плей-офф',
            thirdNote3: 'При 3 групах виходять 2 кращих третіх',
            thirdNote4: 'При 4 групах треті місця не виходять',
            csvHeader: '№,Гравець,Попередній рейтинг,Місце,Отримано балів,Новий рейтинг,Зміна\n',
            csvTitle: 'НОВИЙ РЕЙТИНГ ДАРТС',
            copyAlt: 'Новий рейтинг скопійовано!',
            imageWrongType: '❌ Будь ласка, завантажте зображення (JPG, PNG, GIF, WebP)',
            aiPromptIntro: (n) => `Ти — асистент для розпізнавання результатів турніру з дартсу.\n\nНа зображенні — таблиця результатів турніру з дартсу.\n\nСписок зареєстрованих гравців (${n} осіб):`,
            aiPromptParticipants: (count, groups) => `Кількість учасників: ${count}, груп: ${groups}.`,
            aiPromptPlaces: 'Допустимі значення місць:',
            aiPromptTask: 'Твоє завдання:\n1. Знайди кожного гравця зі списку на зображенні (або за прізвищем, або за нікнеймом).\n2. Визнач його місце у турнірі.\n3. Для кожного гравця вкажи confidence: "high" (впевнений), "mid" (частково), "low" (не знайдений).\n\nВідповідай ТІЛЬКИ у форматі JSON (без markdown, без пояснень):',
        },
        en: {
            appTitle: 'Darts Rating',
            appSubtitle: 'Tournament Points Calculator',
            step1Label: 'Players', step2Label: 'Photo', step3Label: 'Places', step4Label: 'Results', litestep1Label: 'Players', litestep2Label: 'Places', litestep3Label: 'Results',
            s1Title: 'Import Players with Current Rating',
            nicknameTitle: '🔗 Nickname Mappings',
            btnEditNicknames: '✏️ Edit Nicknames',
            btnAddMapping: '+ Add',
            btnSaveMappings: '💾 Save',
            nicknamePlaceholderNick: 'Nickname',
            nicknamePlaceholderReal: 'Full name',
            importFormatTitle: '📋 Paste format from Google Sheets:',
            importFormatDesc: 'Last First\u00a0\u00a0Tab\u00a0\u00a0Rating',
            importFormatExample: 'Example:',
            importLabel: '📋 Paste data from Google Sheets:',
            importPlaceholder: "Select cells → Ctrl+C → Ctrl+V here",
            tournamentTypeLabel: 'Tournament type',
            typeGroupsPlayoff: 'Multiple groups + playoff',
            typeSingleGroup: '1 group (up to 7 players)',
            typeSingleGroupPlayoff: '1 group + playoff',
            playerCountLabel: 'Number of players',
            groupCountLabel: 'Number of groups',
            group1: '1 group', group2: '2 groups', group3opt: '3 groups', group4opt: '4 groups',
            thirdPlaceLabel: '3rd places in playoff',
            thirdAuto: 'Auto (2 groups — advance, 3 groups — 2 best)',
            thirdYes: 'Advance (all 3rd places)',
            thirdNo: 'Do not advance',
            coefLabel: 'Tournament coefficient',
            schemeTitle: '📊 Points scheme',
            btnImport: '📥 Import Players',
            btnClear: '🗑️ Clear',
            importedTitle: '📋 Imported players:',
            colPlayer: 'Player', colRating: 'Rating', colPlace: 'Place',
            colPoints: 'Points', colNewRating: 'New rating',
            colDetectedAs: 'Detected as', colConfidence: 'Confidence',
            colTournamentPlace: 'Tournament place', colCurrentRating: 'Current rating',
            colEarned: 'Points earned', colChange: 'Change',
            s2Title: 'Upload Results (Image)',
            s2InfoTitle: '📸 Upload tournament results image',
            s2InfoDesc: 'AI (Claude Vision) will automatically detect player names and places',
            s2InfoTip: 'If AI is not confident — you can correct places manually in step 3',
            uploadTitle: 'Click or drag image here',
            uploadFormats: 'JPG, PNG, GIF, WebP',
            imagePreviewTitle: '🖼️ Uploaded image:',
            btnAnalyzeAI: '🤖 Detect Places with AI',
            btnSkipAI: '⏭️ Skip (manual)',
            aiStatusSending: 'Sending image to Claude Vision...',
            aiStatusAnalyzing: 'Claude Vision is analyzing the image...',
            aiStatusProcessing: 'Processing response...',
            detectedTitle: '🔍 Detected places:',
            detectedCheckTitle: '⚠️ Review results before going to step 3',
            detectedCheckDesc: 'Places will be auto-filled — you can correct any of them manually',
            btnGoToStep3: '✅ Go to place assignment',
            btnBack: '⬅️ Back',
            s3Title: 'Assign Tournament Places',
            s3InfoTitle: '🎯 Select a place for each player:',
            s3InfoDesc: 'The place determines how many rating points the player earns',
            s3InfoWarn: 'If no place is selected — player earns 0 points',
            scheme2Groups1: '• Group winners → directly to <strong>semi-final</strong>',
            scheme2Groups2: '• 2nd–3rd places → to <strong>quarter-final</strong>',
            scheme4Groups1: '• Group winners (4 players) → directly to <strong>quarter-final</strong>',
            scheme4Groups2: '• 2nd–3rd places → to <strong>round of 16</strong>',
            schemeThirdNote: '⚠️ With 2 groups, 3rd places advance by default',
            qfWinner: '🏆 Winner', qfFinalist: '🥈 Finalist', qfSemi: '🥉 Semi-finalists',
            qfQuarter: '⚔️ Quarter-final', qfEighth: '⚔️ Round of 16',
            qfGroup3: '📊 Group 3rd place', qfGroup4: '📊 Group 4th place', qfGroup5: '📊 Group 5th place', qfClearAll: '🗑️ Clear all',
            btnCalculate: '🎯 Calculate Rating',
            s4Title: 'New Rating',
            btnExportCSV: '📊 Export to CSV',
            btnCopy: '📋 Copy',
            btnNewTournament: '🔄 New Tournament',
            copiedMsg: '✅ Copied!',
            importedCount: (n) => `✅ Imported ${n} players!`,
            importEmpty: '❌ Please enter data to import!',
            importFailed: '❌ Could not parse players. Check the data format!',
            aiError: (msg) => '❌ AI error: ' + msg,
            aiParseError: 'Failed to parse AI response. Please try again.',
            detectedCount: (h, t, p) => `Detected: ${h}/${t} (${p}%)`,
            confHigh: '✅ Confident', confMid: '⚠️ Partial', confLow: '❓ Not found',
            notDefined: '— not assigned —',
            savedMsg: '✅ Nicknames saved!',
            summaryType: 'Type', summaryPlayers: 'Players', summaryGroups: 'Groups',
            summaryThird: '3rd places', summaryCoef: 'Coefficient',
            third2groups: 'advance (2 groups)', third3groups: '2 best (3 groups)',
            thirdNo4: 'do not advance (4+ groups)', thirdAllYes: 'all advance', thirdAllNo: 'do not advance',
            placeWinner: '🏆 Winner', placeFinalist: '🥈 Finalist', placeSemi: '🥉 Semi-finalist',
            placeQuarter: '⚔️ Quarter-final', placeEighth: '⚔️ Round of 16', placeSixteenth: '⚔️ Round of 32',
            placeGroup: (n) => `📊 Group - ${n}${n===1?'st':n===2?'nd':n===3?'rd':'th'} place`,
            placeSelectDefault: '— Select place —',
            place1: '🏆 1st place (winner)', place2: '🥈 2nd place', place3: '🥉 3rd place',
            placeN: (n) => `${n}${n===4?'th':n===5?'th':n===6?'th':'th'} place`,
            semiNote1: '🥉 Semi-finalist (group winner)',
            quarterNote: '⚔️ Quarter-final (2nd–3rd group)',
            quarterNote4: '⚔️ Quarter-final (group winners × 4)',
            eighthNote: '⚔️ Round of 16 (2nd–3rd group)',
            notExit: ' (does not advance)',
            schemeCoefLine: (n, c) => `Points breakdown (${n} players, coef=${c})`,
            schemeWinner: '🏆 Winner', schemeFinalist: '🥈 Finalist',
            schemeSemi: '🥉 Semi-finalists', schemeQuarter: '⚔️ Quarter-final',
            schemeGroup3: '📊 Group - 3rd place', schemeGroup4: '📊 Group - 4th place', schemeGroup5: '📊 Group - 5th place',
            schemeThirdOut: ' <em style="color:var(--muted)">(does not advance)</em>',
            thirdNote2: 'With 2 groups, 3rd places advance to playoff',
            thirdNote3: 'With 3 groups, top 2 third places advance',
            thirdNote4: 'With 4 groups, 3rd places do not advance',
            csvHeader: '#,Player,Previous rating,Place,Points earned,New rating,Change\n',
            csvTitle: 'NEW DARTS RATING',
            copyAlt: 'New rating copied!',
            imageWrongType: '❌ Please upload an image (JPG, PNG, GIF, WebP)',
            aiPromptIntro: (n) => `You are an assistant for recognizing darts tournament results.\n\nThe image shows a darts tournament results table.\n\nRegistered players list (${n} players):`,
            aiPromptParticipants: (count, groups) => `Number of participants: ${count}, groups: ${groups}.`,
            aiPromptPlaces: 'Valid place values:',
            aiPromptTask: 'Your task:\n1. Find each player from the list in the image (by surname or nickname).\n2. Determine their tournament place.\n3. For each player specify confidence: "high" (certain), "mid" (partial), "low" (not found).\n\nRespond ONLY in JSON format (no markdown, no explanation):',
        }
    };
 
    function t(key, ...args) {
        const val = i18n[currentLang]?.[key] ?? i18n['uk'][key] ?? key;
        return typeof val === 'function' ? val(...args) : val;
    }
 
    function setLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.title = t('appTitle') + ' — ' + t('appSubtitle');
        document.getElementById('btnUA').classList.toggle('active', lang === 'uk');
        document.getElementById('btnEN').classList.toggle('active', lang === 'en');
        // Update all static data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (el.innerHTML !== val) el.innerHTML = val;
        });
        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
        });
        // Re-render dynamic parts that depend on language
        updateTournamentInfo();
        if (!document.getElementById('step3').classList.contains('hidden')) renderPlaceAssignment();
        if (!document.getElementById('step4').classList.contains('hidden')) renderResults();
    }
 
    let nicknameMappings = {
        'Elvis': 'Корпусов Андрій',
        'Saprik': 'Сапронов Петро',
        'Чубатий': 'Матвійчук Олександр',
        'Юля': 'Софлюк Юлія'
    };
 
    let players = [];
    let detectedPlayersFromImage = [];
 
    const coefficients = {
        3: 0.5,
        4: 0.75, 5: 0.75, 6: 0.75,
        7: 1.0, 8: 1.0,
        9: 1.25, 10: 1.25, 11: 1.25,
        12: 1.5
    };
 
    const basePlayoffPoints = {
        winner: 100, finalist: 75, semi: 50,
        quarter: 35, eighth: 25, sixteenth: 15
    };
 
    const baseGroupPoints = { 3: 25, 4: 15, 5: 10 };
 
    const tournamentPoints = {
        3:  { winner: 112.5, finalist: 84.375, semi: 56.25, quarter: 39.375 },
        4:  { winner: 75, finalist: 56.25, semi: 37.5, quarter: 26.25, group3: 18.75 },
        5:  { winner: 75, finalist: 56.25, semi: 37.5, quarter: 26.25, group3: 18.75 },
        6:  { winner: 75, finalist: 56.25, semi: 37.5, quarter: 26.25, group3: 18.75 },
        7:  { winner: 100, finalist: 75, semi: 50, quarter: 35, group3: 25, group4: 15, group5: 10 },
        8:  { winner: 100, finalist: 75, semi: 50, quarter: 35, group3: 25, group4: 15, group5: 10 },
        9:  { winner: 125, finalist: 93.75, semi: 62.5, quarter: 43.75, group3: 31.25, group4: 18.75, group5: 12.5 },
        10: { winner: 125, finalist: 93.75, semi: 62.5, quarter: 43.75, group3: 31.25, group4: 18.75, group5: 12.5 },
        11: { winner: 125, finalist: 93.75, semi: 62.5, quarter: 43.75, group3: 31.25, group4: 18.75, group5: 12.5 },
        12: { winner: 150, finalist: 112.5, semi: 75, quarter: 52.5, group3: 37.5, group4: 22.5, group5: 15 }
    };
 
    const singleGroupPoints = {
        3: { 1: 50, 2: 37.5, 3: 25 },
        4: { 1: 75, 2: 56.25, 3: 37.5, 4: 25 },
        5: { 1: 100, 2: 75, 3: 50, 4: 35, 5: 25 },
        6: { 1: 100, 2: 75, 3: 50, 4: 35, 5: 25, 6: 15 },
        7: { 1: 100, 2: 75, 3: 50, 4: 35, 5: 25, 6: 15, 7: 10 }
    };
 
    /* ─── HELPERS ─── */
    function getCount() {
        return parseInt(document.getElementById('playerCount').value, 10) || 10;
    }
 
    function normalizeName(name) {
        name = name.trim();
        for (let [nickname, realName] of Object.entries(nicknameMappings)) {
            if (name.toLowerCase() === nickname.toLowerCase()) return realName;
        }
        return name;
    }
 
    function parseRating(str) {
        if (!str) return 0;
        let clean = String(str).replace(/\s/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
    }
 
    function formatRating(val) {
        return Number(val).toFixed(2).replace('.', ',');
    }
 
    function showError(msg) {
        const el = document.getElementById('importError');
        el.textContent = msg;
        el.classList.remove('hidden');
        document.getElementById('importSuccess').classList.add('hidden');
    }
 
    function showSuccess(msg) {
        const el = document.getElementById('importSuccess');
        el.textContent = msg;
        el.classList.remove('hidden');
        document.getElementById('importError').classList.add('hidden');
    }
 
    /* ─── STEP NAV ─── */
    function setActiveStep(step) {
        [1, 2, 3].forEach(i => {
            const nav = document.getElementById('nav' + i);
            if (!nav) return;
            nav.classList.remove('active', 'done');
            if (i < step) nav.classList.add('done');
            if (i === step) nav.classList.add('active');
        });
        [1, 2].forEach(i => {
            const conn = document.getElementById('conn' + i);
            if (!conn) return;
            conn.classList.toggle('done', i < step);
        });
    }
 
    /* ─── NICKNAME EDITOR ─── */
    function toggleMappingEdit() {
        const el = document.getElementById('mappingEdit');
        el.classList.toggle('hidden');
        if (!el.classList.contains('hidden')) renderMappingEdit();
    }
 
    function renderMappingEdit() {
        const list = document.getElementById('mappingList');
        list.innerHTML = '';
        for (let [nick, real] of Object.entries(nicknameMappings)) {
            const row = document.createElement('div');
            row.className = 'mapping-row';
            row.innerHTML = `<input type="text" value="${nick}" placeholder="${t('nicknamePlaceholderNick')}" class="mapping-nick">
                             <input type="text" value="${real}" placeholder="${t('nicknamePlaceholderReal')}" class="mapping-real">
                             <button class="remove-btn" onclick="removeMapping(this)">×</button>`;
            list.appendChild(row);
        }
    }
 
    function addMapping() {
        const list = document.getElementById('mappingList');
        const row = document.createElement('div');
        row.className = 'mapping-row';
        row.innerHTML = `<input type="text" placeholder="${t('nicknamePlaceholderNick')}" class="mapping-nick">
                         <input type="text" placeholder="${t('nicknamePlaceholderReal')}" class="mapping-real">
                         <button class="remove-btn" onclick="removeMapping(this)">×</button>`;
        list.appendChild(row);
    }
 
    function removeMapping(btn) { btn.parentElement.remove(); }
 
    function saveMappings() {
        const newM = {};
        document.querySelectorAll('.mapping-row').forEach(row => {
            const nick = row.querySelector('.mapping-nick').value.trim();
            const real = row.querySelector('.mapping-real').value.trim();
            if (nick && real) newM[nick] = real;
        });
        nicknameMappings = newM;
        const display = document.getElementById('mappingDisplay');
        display.innerHTML = '';
        for (let [nick, real] of Object.entries(nicknameMappings)) {
            display.innerHTML += `<div class="mapping-tag"><strong>${nick}</strong> → ${real}</div>`;
        }
        document.getElementById('mappingEdit').classList.add('hidden');
        showSuccess(t('savedMsg'));
    }
 
    /* ─── TOURNAMENT INFO (FIXED: parseInt with radix, correct coef lookup) ─── */
    function updateTournamentInfo() {
        const type      = document.getElementById('tournamentType').value;
        const count     = parseInt(document.getElementById('playerCount').value, 10);
        const groupCount = parseInt(document.getElementById('groupCount').value, 10);
        const thirdPlaceOption = document.getElementById('thirdPlaceOption').value;
 
        // FIX: coefficients keys are Numbers — use count directly after parseInt
        const coef = coefficients[count] !== undefined ? coefficients[count] : 1.5;
        document.getElementById('coefDisplay').textContent = coef;
 
        let thirdPlaceOut = false;
        let thirdPlaceNote = '';
        if (groupCount === 1) {
            thirdPlaceOut = true;
            thirdPlaceNote = currentLang === 'en' ? 'Single group — no playoff' : 'При 1 групі — турнір без плей-офф';
        } else if (thirdPlaceOption === 'auto') {
            if (groupCount === 2) { thirdPlaceOut = false; thirdPlaceNote = t('thirdNote2'); }
            else if (groupCount === 3) { thirdPlaceOut = false; thirdPlaceNote = t('thirdNote3'); }
            else { thirdPlaceOut = true; thirdPlaceNote = t('thirdNote4'); }
        } else if (thirdPlaceOption === 'yes') {
            thirdPlaceOut = false; thirdPlaceNote = t('thirdNote2');
        } else {
            thirdPlaceOut = true; thirdPlaceNote = t('thirdNote4');
        }
 
        const schemeList = document.getElementById('schemeList');
        let html = '';
 
        if (type === 'single_group') {
            const table = singleGroupPoints[Math.min(count, 7)] || singleGroupPoints[7];
            for (let place = 1; place <= Math.min(count, 7); place++) {
                const pts = table[place];
                const medal = place===1?'🏆':place===2?'🥈':place===3?'🥉':'';
                html += `<li><strong>${medal} ${place} ${currentLang==='en'?(place===1?'st':place===2?'nd':place===3?'rd':'th')+' place':'місце'}:</strong> ${pts} ${currentLang==='en'?'pts':'балів'}</li>`;
            }
        } else {
            const table = tournamentPoints[count] || tournamentPoints[12];
            html += `<li style="color:var(--accent2);margin-bottom:8px;"><strong>${t('schemeCoefLine', count, coef)}</strong></li>`;
            if (table.winner)   html += `<li><strong>${t('schemeWinner')}:</strong> <span style="color:var(--accent2)">${table.winner.toFixed(2)}</span></li>`;
            if (table.finalist) html += `<li><strong>${t('schemeFinalist')}:</strong> <span style="color:#c0c0c0">${table.finalist.toFixed(2)}</span></li>`;
            if (table.semi)     html += `<li><strong>${t('schemeSemi')}:</strong> <span style="color:#cd7f32">${table.semi.toFixed(2)}</span></li>`;
            if (table.quarter)  html += `<li><strong>${t('schemeQuarter')}:</strong> ${table.quarter.toFixed(2)}</li>`;
            if (table.group3)   html += `<li><strong>${t('schemeGroup3')}:</strong> ${table.group3.toFixed(2)}${thirdPlaceOut && count >= 7 ? t('schemeThirdOut') : ''}</li>`;
            if (table.group4)   html += `<li><strong>${t('schemeGroup4')}:</strong> ${table.group4.toFixed(2)}</li>`;
            if (table.group5)   html += `<li><strong>${t('schemeGroup5')}:</strong> ${table.group5.toFixed(2)}</li>`;
            html += `<li style="margin-top:8px;color:var(--accent3);"><strong>⚠️ ${thirdPlaceNote}</strong></li>`;
        }
 
        schemeList.innerHTML = html;
    }
 
    /* ─── IMPORT (FIXED: robust tab/whitespace parsing) ─── */
    function importPlayers() {
        const raw = document.getElementById('importData').value;
        if (!raw.trim()) { showError(t('importEmpty')); return; }
 
        players = [];
        const lines = raw.split(/\r?\n/);
 
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
 
            // FIX: split on tab character OR 2+ spaces OR multiple whitespace
            // Using \u0009 (tab code point) to avoid any encoding issue
            let parts;
            if (line.includes('\u0009')) {
                // Has real tab — split on tabs
                parts = line.split('\u0009').map(p => p.trim()).filter(p => p);
            } else {
                // Fallback: split on 2+ spaces
                parts = line.split(/\s{2,}/).map(p => p.trim()).filter(p => p);
                // If still only 1 part, try splitting last "word" that looks like a number
                if (parts.length === 1) {
                    const m = line.match(/^(.+?)\s+([\d,.\s]+)$/);
                    if (m) parts = [m[1].trim(), m[2].trim()];
                }
            }
 
            if (parts.length >= 1) {
                const originalName = parts[0];
                const name = normalizeName(originalName);
                let rating = 0;
                if (parts.length >= 2) {
                    rating = parseRating(parts[1]);
                }
                players.push({
                    name, originalName, rating,
                    place: 0, points: 0,
                    newRating: rating, placeValue: ''
                });
            }
        }
 
        if (players.length === 0) {
            showError(t('importFailed'));
            return;
        }
 
        showSuccess(t('importedCount', players.length));
        renderImportedPlayers();
        document.getElementById('importedPlayers').classList.remove('hidden');
 
        setTimeout(() => { goToStep3(); }, 900);
    }
 
    function renderImportedPlayers() {
        const list = document.getElementById('playersList');
        list.innerHTML = '';
        players.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'player-row-item';
            row.innerHTML = `
                <div class="pname">${player.name}</div>
                <div class="prating">${formatRating(player.rating)}</div>
                <div style="color:var(--muted);font-size:0.9em;">—</div>
                <div class="ppoints">+0,00</div>
                <div class="pnew">${formatRating(player.newRating)}</div>
                <button class="remove-btn" onclick="removePlayer(${index})">×</button>`;
            list.appendChild(row);
        });
    }
 
    function removePlayer(index) {
        players.splice(index, 1);
        renderImportedPlayers();
        if (players.length === 0) document.getElementById('importedPlayers').classList.add('hidden');
    }
 
    function clearImport() {
        document.getElementById('importData').value = '';
        players = [];
        document.getElementById('importedPlayers').classList.add('hidden');
        document.getElementById('importError').classList.add('hidden');
        document.getElementById('importSuccess').classList.add('hidden');
    }
 
    /* ─── NAVIGATION ─── */
    function backToStep1() {
        document.getElementById('step1').classList.remove('hidden');
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('step4').classList.add('hidden');
        setActiveStep(1);
    }
 
    function backToStep3() {
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step3').classList.remove('hidden');
        document.getElementById('step4').classList.add('hidden');
        setActiveStep(2);
    }
 
    function goToStep3() {
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step3').classList.remove('hidden');
        document.getElementById('step4').classList.add('hidden');
        setActiveStep(2);
        const groupCount = parseInt(document.getElementById('groupCount').value, 10);
        if (groupCount >= 4) {
            document.getElementById('schemeText2Groups').classList.add('hidden');
            document.getElementById('schemeText2Groups2').classList.add('hidden');
            document.getElementById('schemeText4Groups').classList.remove('hidden');
            document.getElementById('schemeText4Groups2').classList.remove('hidden');
        } else {
            document.getElementById('schemeText2Groups').classList.remove('hidden');
            document.getElementById('schemeText2Groups2').classList.remove('hidden');
            document.getElementById('schemeText4Groups').classList.add('hidden');
            document.getElementById('schemeText4Groups2').classList.add('hidden');
        }
        renderPlaceAssignment();
    }
 
 
    /* ─── PLACE ASSIGNMENT ─── */
    function renderPlaceAssignment() {
        const list = document.getElementById('placeList');
        list.innerHTML = '';
        const type = document.getElementById('tournamentType').value;
        const count = parseInt(document.getElementById('playerCount').value, 10);
        const groupCount = parseInt(document.getElementById('groupCount').value, 10);
        const thirdPlaceOption = document.getElementById('thirdPlaceOption').value;
 
        let thirdPlaceOut = false;
        if (thirdPlaceOption === 'auto') thirdPlaceOut = groupCount >= 4;
        else if (thirdPlaceOption === 'yes') thirdPlaceOut = false;
        else thirdPlaceOut = true;
 
        let placeOptions = `<option value="">${t('placeSelectDefault')}</option>`;
        if (type === 'single_group') {
            for (let i = 1; i <= Math.min(count, 7); i++) {
                const m = i===1?'🏆 ':i===2?'🥈 ':i===3?'🥉 ':'';
                placeOptions += `<option value="${i}">${m}${i}${currentLang==='en'?(i===1?' st':i===2?' nd':i===3?' rd':' th'):''} ${currentLang==='en'?'place':'місце'}</option>`;
            }
        } else {
            const table = tournamentPoints[count] || tournamentPoints[12];
            if (groupCount === 1) {
                placeOptions += `<option value="winner">${t('place1')}</option>`;
                placeOptions += `<option value="finalist">${t('place2')}</option>`;
                placeOptions += `<option value="semi">${t('place3')}</option>`;
                if (count >= 4) placeOptions += `<option value="quarter">${t('placeN', 4)}</option>`;
                if (count >= 5) placeOptions += `<option value="eighth">${t('placeN', 5)}</option>`;
                if (count >= 6) placeOptions += `<option value="sixteenth">${t('placeN', 6)}</option>`;
            } else {
                if (table.winner)   placeOptions += `<option value="winner">${t('placeWinner')}</option>`;
                if (table.finalist) placeOptions += `<option value="finalist">${t('placeFinalist')}</option>`;
                if (groupCount <= 3) {
                    if (table.semi)    placeOptions += `<option value="semi">${t('semiNote1')}</option>`;
                    if (table.quarter) placeOptions += `<option value="quarter">${t('quarterNote')}</option>`;
                } else {
                    if (table.quarter) placeOptions += `<option value="quarter">${t('quarterNote4')}</option>`;
                    if (table.eighth)  placeOptions += `<option value="eighth">${t('eighthNote')}</option>`;
                }
            }
            for (let i = 3; i <= 5; i++) {
                const key = 'group' + i;
                if (table[key]) {
                    const note = (i === 3 && thirdPlaceOut) ? t('notExit') : '';
                    placeOptions += `<option value="${key}">${t('placeGroup', i)}${note}</option>`;
                }
            }
        }
 
        players.forEach((player, index) => {
            let detectedPlace = '';
            const row = document.createElement('div');
            row.className = 'place-row';
            row.innerHTML = `
                <div class="pname">${player.name}</div>
                <div class="prating">${formatRating(player.rating)}</div>
                <div><select id="place_${index}" onchange="updatePlayerPoints(${index})" class="place-select">${placeOptions}</select></div>
                <div class="ppoints" id="points_${index}">+0,00</div>
                <div class="pnew" id="newRating_${index}">${formatRating(player.rating)}</div>
                <div></div>`;
            list.appendChild(row);
            if (detectedPlace) {
                document.getElementById('place_' + index).value = detectedPlace;
                updatePlayerPoints(index);
            }
        });
    }
 
    function fillPlaces(placeValue) {
        for (let i = 0; i < players.length; i++) {
            const sel = document.getElementById('place_' + i);
            if (sel && !sel.value) {
                sel.value = placeValue;
                updatePlayerPoints(i);
                break;
            }
        }
    }
 
    function clearAllPlaces() {
        for (let i = 0; i < players.length; i++) {
            const sel = document.getElementById('place_' + i);
            if (sel) { sel.value = ''; updatePlayerPoints(i); }
        }
    }
 
    function updatePlayerPoints(index) {
        const placeValue = document.getElementById('place_' + index).value;
        const type  = document.getElementById('tournamentType').value;
        const count = parseInt(document.getElementById('playerCount').value, 10);
        let points  = 0;
 
        if (!placeValue) {
            points = 0;
        } else if (type === 'single_group') {
            const table = singleGroupPoints[Math.min(count, 7)] || singleGroupPoints[7];
            points = table[parseInt(placeValue, 10)] || 0;
        } else {
            const table = tournamentPoints[count] || tournamentPoints[12];
            if (table && table[placeValue] !== undefined && table[placeValue] !== null) {
                points = table[placeValue];
            } else {
                const coef = coefficients[count] !== undefined ? coefficients[count] : 1.5;
                if (placeValue.startsWith('group')) {
                    const gp = parseInt(placeValue.replace('group', ''), 10);
                    points = (baseGroupPoints[gp] || 0) * coef;
                } else {
                    points = (basePlayoffPoints[placeValue] || 0) * coef;
                }
            }
        }
 
        players[index].points    = points;
        players[index].newRating = players[index].rating + points;
        players[index].placeValue = placeValue;
        document.getElementById('points_' + index).textContent = '+' + formatRating(points);
        document.getElementById('newRating_' + index).textContent = formatRating(players[index].newRating);
    }
 
    /* ─── CALCULATE ─── */
    function calculateRating() {
        players.forEach((_, i) => updatePlayerPoints(i));
        players.sort((a, b) => b.newRating - a.newRating);
 
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('step4').classList.remove('hidden');
        setActiveStep(3);
        renderResults();
    }
 
    function renderResults() {
        const tbody = document.getElementById('resultTable');
        tbody.innerHTML = '';
        const count = parseInt(document.getElementById('playerCount').value, 10);
        const groupCount = parseInt(document.getElementById('groupCount').value, 10);
        const thirdPlaceOption = document.getElementById('thirdPlaceOption').value;
        const coef = coefficients[count] !== undefined ? coefficients[count] : 1.5;
 
        let thirdPlaceText = '';
        if (thirdPlaceOption === 'auto') {
            if (groupCount === 2) thirdPlaceText = t('third2groups');
            else if (groupCount === 3) thirdPlaceText = t('third3groups');
            else thirdPlaceText = t('thirdNo4');
        } else if (thirdPlaceOption === 'yes') thirdPlaceText = t('thirdAllYes');
        else thirdPlaceText = t('thirdAllNo');
 
        const typeEl = document.getElementById('tournamentType');
        const typeTxt = typeEl.options[typeEl.selectedIndex].text;
        document.getElementById('tournamentSummary').innerHTML =
            `<strong>${t('summaryType')}:</strong> ${typeTxt} &nbsp;|&nbsp; <strong>${t('summaryPlayers')}:</strong> ${count} &nbsp;|&nbsp; <strong>${t('summaryGroups')}:</strong> ${groupCount} &nbsp;|&nbsp; <strong>${t('summaryThird')}:</strong> ${thirdPlaceText} &nbsp;|&nbsp; <strong>${t('summaryCoef')}:</strong> ×${coef}`;
 
        players.forEach((player, index) => {
            const change = player.newRating - player.rating;
            const changeClass = change > 0 ? 'r-pos' : change < 0 ? 'r-neg' : '';
            let placeText = '—', badgeClass = '';
            if (player.placeValue) {
                const map = {
                    winner:    [t('placeWinner'), 'badge-winner'],
                    finalist:  [t('placeFinalist'), 'badge-finalist'],
                    semi:      [t('placeSemi'), 'badge-semi'],
                    quarter:   [t('placeQuarter'), 'badge-quarter'],
                    eighth:    [t('placeEighth'), 'badge-quarter'],
                    sixteenth: [t('placeSixteenth'), 'badge-quarter'],
                };
                if (map[player.placeValue]) { placeText = map[player.placeValue][0]; badgeClass = map[player.placeValue][1]; }
                else if (player.placeValue.startsWith('group')) {
                    placeText = t('placeGroup', parseInt(player.placeValue.replace('group',''), 10));
                    badgeClass = 'badge-group';
                } else {
                    placeText = t('placeN', player.placeValue);
                }
            }
            const nameClass = index === 0 ? 'r-gold' : index === 1 ? 'r-silver' : index === 2 ? 'r-bronze' : '';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="${nameClass}">${index + 1}</td>
                <td><strong>${player.name}</strong></td>
                <td style="font-family:'Rajdhani',sans-serif;font-size:1.05em">${formatRating(player.rating)}</td>
                <td><span class="badge ${badgeClass}">${placeText}</span></td>
                <td class="r-pos">+${formatRating(player.points)}</td>
                <td class="r-new">${formatRating(player.newRating)}</td>
                <td class="${changeClass}">${change > 0 ? '+' : ''}${formatRating(change)}</td>`;
            tbody.appendChild(tr);
        });
    }
 
    /* ─── EXPORT ─── */
    function exportToCSV() {
        let csv = '\uFEFF' + t('csvHeader');
        players.forEach((p, i) => {
            const change = p.newRating - p.rating;
            csv += `${i+1},"${p.name}",${formatRating(p.rating)},${p.placeValue||'—'},${formatRating(p.points)},${formatRating(p.newRating)},${formatRating(change)}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'darts_rating_' + new Date().toISOString().slice(0,10) + '.csv';
        link.click();
    }
 
    function copyToClipboard() {
        let text = t('csvTitle') + '\n========================\n\n';
        players.forEach((p, i) => {
            text += `${i+1}. ${p.name}: ${formatRating(p.newRating)} (+${formatRating(p.points)})\n`;
        });
        navigator.clipboard.writeText(text).then(() => {
            const el = document.getElementById('copyAlert');
            el.classList.remove('hidden');
            setTimeout(() => el.classList.add('hidden'), 2000);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
            const el = document.getElementById('copyAlert');
            el.classList.remove('hidden');
            setTimeout(() => el.classList.add('hidden'), 2000);
        });
    }
 
    /* ─── RESET ─── */
    function resetAll() {
        players = []; detectedPlayersFromImage = [];
        document.getElementById('importData').value = '';
        document.getElementById('importedPlayers').classList.add('hidden');
        document.getElementById('step1').classList.remove('hidden');
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('step4').classList.add('hidden');
        document.getElementById('importError').classList.add('hidden');
        document.getElementById('importSuccess').classList.add('hidden');
        setActiveStep(1);
    }
 
    // Init
    setLang('uk');
    setActiveStep(1);