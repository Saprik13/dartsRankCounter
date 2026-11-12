/* ═══════════════════════════════════════
   n01darts IMPORT
   Loads a finished tournament from n01darts.com, derives each player's final
   place from the group stage and playoff bracket, and matches n01 names
   (surnames / nicknames) to players in the rating sheet.
   Loaded after app.js and sheets.js; uses their globals.
═══════════════════════════════════════ */
const n01Api = 'https://lbc.n01darts.com/n01/tournament/n01_tournament.php';

/* ── Pure helpers (also used by tests) ── */
const n01Core = (function(){
    function parseTournamentDate(item){
        const match = String(item.title || '').match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if(match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
        const seconds = Number(item.t_date) || Number(item.createTime) || 0;
        if(!seconds) return '';
        const date = new Date(seconds * 1000);
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    }

    function dayMonth(isoDate){
        const [, month, day] = String(isoDate).split('-');
        return day && month ? `${day}.${month}` : '';
    }

    // rr_result / t_result rounds may come as an array or as an object keyed "0","1",...
    function byIndex(container, index){
        if(!container) return null;
        return container[index] ?? container[String(index)] ?? null;
    }

    function legs(results, a, b){
        const value = results?.[a]?.[b]?.r;
        return typeof value === 'number' ? value : null;
    }

    function groupStandings(data, groupIndex){
        const members = (byIndex(data.rr_table, groupIndex) || []).filter(Boolean);
        const results = byIndex(data.rr_result, groupIndex) || {};
        const stats = Object.fromEntries(members.map(id => [id, { id, wins:0, losses:0, legsFor:0, legsAgainst:0 }]));
        for(let i = 0; i < members.length; i++){
            for(let j = i + 1; j < members.length; j++){
                const a = members[i], b = members[j];
                const ab = legs(results, a, b), ba = legs(results, b, a);
                if(ab === null || ba === null || ab === ba) continue;
                const winner = ab > ba ? a : b, loser = ab > ba ? b : a;
                stats[winner].wins++; stats[loser].losses++;
                stats[a].legsFor += ab; stats[a].legsAgainst += ba;
                stats[b].legsFor += ba; stats[b].legsAgainst += ab;
            }
        }
        const key = s => [s.wins, s.wins - s.losses, s.legsFor - s.legsAgainst];
        const sorted = Object.values(stats).sort((x, y) => {
            const kx = key(x), ky = key(y);
            for(let i = 0; i < kx.length; i++) if(kx[i] !== ky[i]) return ky[i] - kx[i];
            return 0;
        });
        sorted.forEach((s, index) => {
            const previous = sorted[index - 1];
            s.rank = previous && key(previous).join() === key(s).join() ? previous.rank : index + 1;
        });
        return sorted;
    }

    // Returns { id → { round, stage } } for every player in the bracket.
    function bracketPlaces(data){
        const rounds = Array.isArray(data.t_table) ? data.t_table : [];
        const places = {};
        if(rounds.length === 0) return places;
        const last = rounds.length - 1;
        const champion = (rounds[last] || []).find(Boolean);
        if(champion) places[champion] = { stage:'winner' };
        for(let k = 0; k < last; k++){
            const slots = rounds[k] || [];
            const next = rounds[k + 1] || [];
            for(let pair = 0; pair * 2 < slots.length; pair++){
                const a = slots[pair * 2], b = slots[pair * 2 + 1];
                if(!a || !b) continue; // bye
                const winner = next[pair];
                const loser = winner === a ? b : winner === b ? a : null;
                if(!loser) continue;
                const distance = last - 1 - k; // 0 = final, 1 = semi, 2 = quarter
                places[loser] = { stage: distance === 0 ? 'finalist' : distance === 1 ? 'semi' : distance === 2 ? 'quarter' : 'early' };
            }
        }
        return places;
    }

    /**
     * Final places for the app.
     * Returns { type:'se'|'sg', groupCount, players:[{ id, name, place, group, groupRank }], warnings:[] }
     * place is an app place key: winner/finalist/semi/quarter/group3..5 for 'se', 1..7 for 'sg', or '' if unknown.
     */
    function computePlaces(data){
        const entries = Array.isArray(data.entry_list) ? data.entry_list : [];
        const names = Object.fromEntries(entries.map(e => [e.tpid, String(e.name || '').trim()]));
        const groupCount = (data.rr_table || []).filter(g => Array.isArray(g) && g.length).length;
        const groupInfo = {};
        for(let g = 0; g < groupCount; g++){
            groupStandings(data, g).forEach(s => { groupInfo[s.id] = { group:g, rank:s.rank }; });
        }
        const bracket = bracketPlaces(data);
        const hasBracket = Object.keys(bracket).length > 0;
        const type = hasBracket || groupCount > 1 ? 'se' : 'sg';
        const warnings = [];
        // Importing a tournament JSON into n01 more than once appends a fresh copy of every
        // player to entry_list, so one person can own several tpids (e.g. the group stage
        // under one and the playoff under another). Skip entries that never played and
        // merge the rest by name.
        const seated = new Set([data.rr_table, data.t_table, data.t3_table]
            .flatMap(table => Array.isArray(table) ? table.flat() : []).filter(Boolean));
        const people = new Map();
        entries.forEach(entry => {
            if(seated.size && !seated.has(entry.tpid)) return;
            const key = names[entry.tpid].toLowerCase();
            if(!people.has(key)) people.set(key, []);
            people.get(key).push(entry.tpid);
        });
        const players = [...people.values()].map(ids => {
            const groupId = ids.find(id => groupInfo[id]);
            const bracketId = ids.find(id => bracket[id]);
            const id = bracketId || groupId || ids[0];
            const name = names[id];
            const info = groupInfo[groupId] || {};
            let place = '';
            if(type === 'sg'){
                place = info.rank && info.rank <= 7 ? String(info.rank) : '';
            } else if(bracketId){
                place = bracket[bracketId].stage === 'early' ? '' : bracket[bracketId].stage;
                if(bracket[bracketId].stage === 'early') warnings.push({ code:'early_round', name });
            } else if(info.rank >= 3 && info.rank <= 5){
                place = 'group' + info.rank;
            } else {
                warnings.push({ code:'no_place', name });
            }
            return { id, name, place, group:info.group, groupRank:info.rank, inBracket:Boolean(bracketId) };
        });
        // Tied group ranks for players who did not reach the playoff.
        const outside = players.filter(p => type === 'se' && !p.inBracket && p.groupRank);
        outside.forEach(p => {
            if(outside.some(o => o !== p && o.group === p.group && o.groupRank === p.groupRank)){
                warnings.push({ code:'group_tie', name:p.name });
            }
        });
        return { type, groupCount: Math.max(1, groupCount), players, warnings };
    }

    function normalize(name){
        return String(name || '').toLowerCase()
            .replace(/['’ʼ`]/g, '')
            .replace(/є/g, 'е').replace(/ё/g, 'е').replace(/ї/g, 'і')
            .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    /**
     * Match an n01 name to sheet players.
     * aliases: { normalizedAlias → sheetName }
     * Returns { status:'alias'|'exact'|'token'|'ambiguous'|'none', name?, candidates? }
     */
    function matchName(n01Name, sheetNames, aliases){
        const key = normalize(n01Name);
        if(aliases && aliases[key] && sheetNames.includes(aliases[key])) return { status:'alias', name:aliases[key] };
        const exact = sheetNames.filter(s => normalize(s) === key);
        if(exact.length === 1) return { status:'exact', name:exact[0] };
        const tokens = key.split(' ').filter(Boolean);
        const candidates = sheetNames.filter(s => {
            const sheetTokens = normalize(s).split(' ');
            return tokens.length > 0 && tokens.every(t => sheetTokens.includes(t));
        });
        if(candidates.length === 1) return { status:'token', name:candidates[0] };
        if(candidates.length > 1) return { status:'ambiguous', candidates };
        return { status:'none' };
    }

    return { parseTournamentDate, dayMonth, groupStandings, bracketPlaces, computePlaces, normalize, matchName };
})();

if(typeof module !== 'undefined') module.exports = n01Core;

/* ── UI ── */
if(typeof document !== 'undefined') (function(){
    const NEW_PLAYER = '__new__';
    const STORAGE_KEYWORD = 'dartsN01Keyword';
    let tournaments = [];
    let loaded = null; // { tdid, date, title, result, rows:[{ n01Name, place, choice, newName }] }

    Object.assign(i18n.uk,{
        tabN01:'n01darts',
        n01KeywordLabel:'Пошук турнірів',
        btnN01Find:'Знайти турніри',
        n01TournamentLabel:'Турнір',
        btnN01Load:'Завантажити результати',
        btnN01Apply:'Застосувати',
        n01Hint:'Спершу вкажіть адресу Apps Script у блоці «Google Таблиця»: звідти беруться гравці, ніки та остання дата.',
        n01Loading:'Завантаження…',
        n01Found:(n,last)=>`Знайдено завершених турнірів: ${n}.`+(last?` Остання дата в таблиці: ${last}.`:''),
        n01NextMarker:' — наступний',
        n01SavedMarker:' — уже в таблиці',
        n01None:'Турнірів не знайдено.',
        n01MatchTitle:'Гравці турніру',
        n01ColN01:'У n01',
        n01ColPlace:'Місце',
        n01ColSheet:'У таблиці',
        n01NewPlayer:'+ Новий гравець…',
        n01Choose:'— Хто це? —',
        n01NewNamePlaceholder:'Прізвище Імʼя',
        n01Summary:(n,type,groups)=>`${n} гравців, ${type}, груп: ${groups}.`,
        n01Unresolved:n=>`Не співставлено: ${n}. Оберіть гравця зі списку або додайте нового.`,
        n01Applied:n=>`Додано ${n} гравців з місцями. Перевірте й переходьте до розподілу місць.`,
        n01WarnEarly:name=>`${name}: вибув раніше за 1/4 — оберіть місце вручну.`,
        n01WarnNoPlace:name=>`${name}: не вдалося визначити місце — оберіть вручну.`,
        n01WarnTie:name=>`${name}: ділить місце в групі з іншим гравцем — перевірте.`,
        n01Error:'Не вдалося завантажити дані з n01darts.',
        n01MatchAlias:'нік', n01MatchExact:'точно', n01MatchToken:'за прізвищем',
    });
    Object.assign(i18n.en,{
        tabN01:'n01darts',
        n01KeywordLabel:'Tournament search',
        btnN01Find:'Find tournaments',
        n01TournamentLabel:'Tournament',
        btnN01Load:'Load results',
        btnN01Apply:'Apply',
        n01Hint:'First enter the Apps Script URL in the “Google Sheet” block: players, nicknames and the last date come from there.',
        n01Loading:'Loading…',
        n01Found:(n,last)=>`Finished tournaments found: ${n}.`+(last?` Last date in the sheet: ${last}.`:''),
        n01NextMarker:' — next',
        n01SavedMarker:' — already in sheet',
        n01None:'No tournaments found.',
        n01MatchTitle:'Tournament players',
        n01ColN01:'In n01',
        n01ColPlace:'Place',
        n01ColSheet:'In sheet',
        n01NewPlayer:'+ New player…',
        n01Choose:'— Who is this? —',
        n01NewNamePlaceholder:'Surname Name',
        n01Summary:(n,type,groups)=>`${n} players, ${type}, groups: ${groups}.`,
        n01Unresolved:n=>`Not matched: ${n}. Pick a player from the list or add a new one.`,
        n01Applied:n=>`Added ${n} players with places. Check them and go on to place assignment.`,
        n01WarnEarly:name=>`${name}: knocked out before the quarter-final — choose the place manually.`,
        n01WarnNoPlace:name=>`${name}: could not determine the place — choose it manually.`,
        n01WarnTie:name=>`${name}: shares a group place with another player — please check.`,
        n01Error:'Could not load data from n01darts.',
        n01MatchAlias:'nickname', n01MatchExact:'exact', n01MatchToken:'by surname',
    });

    const $ = id => document.getElementById(id);

    function setStatus(kind, message){
        const el = $('n01Status');
        el.className = 'alert ' + (kind === 'error' ? 'alert-error' : kind === 'success' ? 'alert-success' : 'alert-info');
        el.textContent = message;
        setHidden(el, !message);
    }

    async function postJson(url){
        const response = await fetch(url, { method:'POST', body:'{}' });
        return response.json();
    }

    async function findTournaments(){
        if(!$('sheetsUrl').value.trim()){ setStatus('error', t('n01Hint')); return; }
        const keyword = $('n01Keyword').value.trim() || 'Lutsk';
        try{ localStorage.setItem(STORAGE_KEYWORD, keyword); }catch(e){}
        setStatus('info', t('n01Loading'));
        $('n01FindButton').disabled = true;
        try{
            await dartsSheets.fetchRatings();
            const all = [];
            for(let skip = 0; skip < 300; skip += 30){
                const page = await postJson(`${n01Api}?cmd=get_list&skip=${skip}&count=30&keyword=${encodeURIComponent(keyword)}`);
                if(!Array.isArray(page) || page.length === 0) break;
                all.push(...page);
                if(page.length < 30) break;
            }
            tournaments = all.filter(item => item.status === 40)
                .map(item => ({ tdid:item.tdid, title:item.title, date:n01Core.parseTournamentDate(item) }))
                .sort((a, b) => a.date.localeCompare(b.date));
            renderTournamentSelect();
            setStatus(tournaments.length ? 'success' : 'error',
                tournaments.length ? t('n01Found', tournaments.length, dartsSheets.lastDate()) : t('n01None'));
        }catch(error){
            setStatus('error', t('n01Error'));
        }finally{
            $('n01FindButton').disabled = false;
        }
    }

    function nextTournamentIndex(){
        const saved = new Set(dartsSheets.savedDates());
        const last = dartsSheets.lastDate();
        let lastIndex = -1;
        if(last){
            tournaments.forEach((item, index) => { if(n01Core.dayMonth(item.date) === last) lastIndex = index; });
        }
        for(let index = lastIndex + 1; index < tournaments.length; index++){
            if(!saved.has(n01Core.dayMonth(tournaments[index].date))) return index;
        }
        return tournaments.length - 1;
    }

    function renderTournamentSelect(){
        const select = $('n01Tournament');
        const saved = new Set(dartsSheets.savedDates());
        const next = nextTournamentIndex();
        select.replaceChildren(...tournaments.map((item, index) => {
            const option = document.createElement('option');
            option.value = item.tdid;
            const marker = index === next ? t('n01NextMarker') : saved.has(n01Core.dayMonth(item.date)) ? t('n01SavedMarker') : '';
            option.textContent = item.title + marker;
            return option;
        }).reverse());
        if(next >= 0) select.value = tournaments[next].tdid;
        setHidden($('n01PickRow'), tournaments.length === 0);
    }

    async function loadTournament(){
        const tdid = $('n01Tournament').value;
        const item = tournaments.find(entry => entry.tdid === tdid);
        if(!item) return;
        setStatus('info', t('n01Loading'));
        $('n01LoadButton').disabled = true;
        try{
            const response = await fetch(`${n01Api}?cmd=get_data&tdid=${encodeURIComponent(tdid)}`);
            const data = await response.json();
            if(!data || data.result === -1) throw new Error('not_found');
            const result = n01Core.computePlaces(data);
            const sheetNames = [...dartsSheets.ratings().values()].map(p => p.name);
            const aliases = dartsSheets.aliases();
            loaded = {
                tdid, date:item.date, title:item.title, result,
                rows: result.players.map(p => {
                    const match = n01Core.matchName(p.name, sheetNames, aliases);
                    return { n01Name:p.name, place:p.place, match, choice: match.name || '', newName:'' };
                })
            };
            renderMatching();
            const warnings = result.warnings.map(w => t(w.code === 'early_round' ? 'n01WarnEarly' : w.code === 'group_tie' ? 'n01WarnTie' : 'n01WarnNoPlace', w.name));
            const typeLabel = result.type === 'se' ? t('typeSE') : t('typeSG');
            setStatus(warnings.length ? 'error' : 'success', [t('n01Summary', result.players.length, typeLabel, result.groupCount), ...warnings].join(' '));
        }catch(error){
            setStatus('error', t('n01Error'));
        }finally{
            $('n01LoadButton').disabled = false;
        }
    }

    function placeLabel(type, place){
        if(!place) return '—';
        return t((type === 'se' ? 'se_' : 'sg_') + place);
    }

    function renderMatching(){
        const list = $('n01MatchList');
        const sheetNames = [...dartsSheets.ratings().values()].map(p => p.name).sort((a, b) => a.localeCompare(b, 'uk'));
        list.replaceChildren(...loaded.rows.map((row, index) => {
            const item = document.createElement('li');
            item.className = 'n01-row' + (row.choice ? '' : ' n01-row-unresolved');

            const n01 = document.createElement('div');
            n01.className = 'n01-name';
            n01.textContent = row.n01Name;

            const place = document.createElement('div');
            place.className = 'n01-place';
            place.textContent = placeLabel(loaded.result.type, row.place);

            const pick = document.createElement('div');
            pick.className = 'n01-pick';
            const label = document.createElement('label');
            label.className = 'visually-hidden';
            label.htmlFor = `n01Pick_${index}`;
            label.textContent = `${t('n01ColSheet')}: ${row.n01Name}`;
            const select = document.createElement('select');
            select.id = `n01Pick_${index}`;
            const options = [['', t('n01Choose')], ...sheetNames.map(name => [name, name]), [NEW_PLAYER, t('n01NewPlayer')]];
            options.forEach(([value, text]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                select.appendChild(option);
            });
            select.value = row.choice;
            const newName = document.createElement('input');
            newName.type = 'text';
            newName.className = 'n01-new-name';
            newName.placeholder = t('n01NewNamePlaceholder');
            newName.value = row.newName || row.n01Name;
            newName.setAttribute('aria-label', `${t('n01NewNamePlaceholder')}: ${row.n01Name}`);
            setHidden(newName, row.choice !== NEW_PLAYER);
            select.addEventListener('change', () => {
                row.choice = select.value;
                if(row.choice === NEW_PLAYER && !row.newName) row.newName = row.n01Name;
                item.classList.toggle('n01-row-unresolved', !row.choice);
                setHidden(newName, row.choice !== NEW_PLAYER);
                if(row.choice === NEW_PLAYER) newName.focus();
                updateUnresolved();
            });
            newName.addEventListener('input', () => { row.newName = newName.value; });
            pick.append(label, select, newName);

            const how = document.createElement('div');
            how.className = 'n01-how';
            how.textContent = row.match.status === 'alias' ? t('n01MatchAlias') : row.match.status === 'exact' ? t('n01MatchExact') : row.match.status === 'token' ? t('n01MatchToken') : '';

            item.append(n01, place, pick, how);
            return item;
        }));
        setHidden($('n01MatchBlock'), false);
        updateUnresolved();
    }

    function updateUnresolved(){
        const unresolved = loaded.rows.filter(row => !row.choice).map(row => row.n01Name);
        const el = $('n01Unresolved');
        el.textContent = unresolved.length ? t('n01Unresolved', unresolved.join(', ')) : '';
        setHidden(el, unresolved.length === 0);
        $('n01ApplyButton').disabled = unresolved.length > 0;
    }

    function selectCountOption(selectId, count){
        const select = $(selectId);
        const values = [...select.options].map(o => Number(o.value)).sort((a, b) => a - b);
        const fit = values.filter(v => v <= count).pop() ?? values[0];
        select.value = String(fit);
    }

    function applyTournament(){
        if(!loaded) return;
        const rows = loaded.rows.filter(row => row.choice);
        if(rows.length !== loaded.rows.length) return;
        const ratings = dartsSheets.ratings();
        const aliases = [];
        selectType(loaded.result.type);
        if(loaded.result.type === 'se'){
            selectCountOption('playerCountSE', rows.length);
            $('groupCount').value = String(loaded.result.groupCount);
        } else {
            selectCountOption('playerCountSG', rows.length);
        }
        players = rows.map(row => {
            const isNew = row.choice === NEW_PLAYER;
            const name = isNew ? (row.newName || row.n01Name).trim() : row.choice;
            const found = isNew ? null : ratings.get(n01Core.normalize(name)) || [...ratings.values()].find(p => p.name === name);
            if(n01Core.normalize(row.n01Name) !== n01Core.normalize(name)) aliases.push({ alias:row.n01Name, name });
            const rating = found ? found.rating : 0;
            return { name, originalName:name, rating, points:0, newRating:rating, placeValue:row.place };
        });
        dartsSheets.setPendingAliases(aliases);
        dartsSheets.setDate(loaded.date);
        renderImportedPlayers();
        updateTournamentInfo();
        clearPlayerSetupError();
        activateInputTab($('inputManualTab'));
        announce(t('n01Applied', players.length));
        showSuccess(t('n01Applied', players.length));
    }

    // Show points for pre-filled places as soon as step 2 renders.
    function fillPointsOnRender(){
        players.forEach((player, index) => {
            if(player.placeValue && document.getElementById('place_' + index)) updatePlayerPoints(index);
        });
    }

    function init(){
        try{ $('n01Keyword').value = localStorage.getItem(STORAGE_KEYWORD) || 'Lutsk'; }catch(e){ $('n01Keyword').value = 'Lutsk'; }
        $('n01FindButton').addEventListener('click', findTournaments);
        $('n01LoadButton').addEventListener('click', loadTournament);
        $('n01ApplyButton').addEventListener('click', applyTournament);
        new MutationObserver(fillPointsOnRender).observe($('placeList'), { childList:true });
        setLang(currentLang);
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init, { once:true });
    } else {
        init();
    }
})();
