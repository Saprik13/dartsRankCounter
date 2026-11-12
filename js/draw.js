/* ═══════════════════════════════════════
   GROUP DRAW (ported from Saprik13/randomizer)
   Picks tonight's players from the rating sheet and splits them into groups
   that are close in strength, then copies the result for n01darts.
   Loaded after app.js, sheets.js and n01.js; uses their globals.
═══════════════════════════════════════ */

/* ── Pure helpers (also used by tests) ── */
const drawCore = (function(){
    // Every group gets floor(n/g) slots. Group 1 takes the first extra slot,
    // the next extras go to groups 3, 4, ... so group 1 stays larger than group 2.
    function groupCapacities(playerCount, groupCount){
        const capacities = Array(groupCount).fill(Math.floor(playerCount / groupCount));
        let remainder = playerCount % groupCount;
        if(remainder > 0){ capacities[0]++; remainder--; }
        for(let i = 2; remainder > 0 && i < groupCount; i++, remainder--) capacities[i]++;
        return capacities;
    }

    function sortByRating(players){
        return players
            .map((player, index) => ({ player, index }))
            .sort((a, b) => b.player.rating - a.player.rating || a.index - b.index)
            .map(({ player }) => player);
    }

    // Group index for each rating position: 1→N, N→1, ... skipping full groups.
    function serpentineTargets(playerCount, groupCount){
        const capacities = groupCapacities(playerCount, groupCount);
        const assigned = Array(groupCount).fill(0);
        let groupIndex = 0, direction = 1;
        const step = () => {
            if(groupCount === 1) return;
            if(direction === 1 && groupIndex === groupCount - 1) direction = -1;
            else if(direction === -1 && groupIndex === 0) direction = 1;
            else groupIndex += direction;
        };
        const targets = [];
        for(let i = 0; i < playerCount; i++){
            while(assigned[groupIndex] >= capacities[groupIndex]) step();
            targets.push(groupIndex);
            assigned[groupIndex]++;
            step();
        }
        return targets;
    }

    // Rating positions i (never the top seed) whose neighbour i+1 lands in another group.
    function swapCandidates(targets){
        const candidates = [];
        for(let i = 1; i < targets.length - 1; i++) if(targets[i] !== targets[i + 1]) candidates.push(i);
        return candidates;
    }

    function variantCount(playerCount, groupCount){
        if(!Number.isInteger(groupCount) || groupCount < 1) return 1;
        return swapCandidates(serpentineTargets(playerCount, groupCount)).length + 1;
    }

    // Variant 0 is the reference serpentine seed; variant k swaps the k-th adjacent
    // rating pair that sits in different groups, so balance stays close to the reference.
    function seedPlayersSerpentine(players, groupCount, variant = 0){
        if(!Number.isInteger(groupCount) || groupCount < 1) return [];
        const sorted = sortByRating(players);
        const targets = serpentineTargets(sorted.length, groupCount);
        const candidates = swapCandidates(targets);
        const phase = (Number.isInteger(variant) && variant > 0 ? variant : 0) % (candidates.length + 1);
        const seeded = [...sorted];
        if(phase > 0){
            const i = candidates[phase - 1];
            [seeded[i], seeded[i + 1]] = [seeded[i + 1], seeded[i]];
        }
        const groups = Array.from({ length: groupCount }, () => []);
        seeded.forEach((player, index) => groups[targets[index]].push(player));
        return groups;
    }

    // Pot draw: sort by rating, cut into pots of `groupCount` players (pot 1 = the strongest),
    // then deal every pot to the groups in random order. Each group gets one player per pot,
    // the last (smaller) pot goes to random distinct groups, so sizes differ by at most one.
    // Inside a group players stay ordered by rating, which is the seed used by the match order.
    function drawByPots(players, groupCount, random = Math.random){
        if(!Number.isInteger(groupCount) || groupCount < 1) return [];
        const sorted = sortByRating(players);
        const groups = Array.from({ length: groupCount }, () => []);
        for(let start = 0, pot = 1; start < sorted.length; start += groupCount, pot++){
            const order = Array.from({ length: groupCount }, (_, i) => i);
            for(let i = order.length - 1; i > 0; i--){
                const j = Math.floor(random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }
            sorted.slice(start, start + groupCount).forEach((player, k) => groups[order[k]].push({ ...player, pot }));
        }
        return groups;
    }

    // Same rule the calculator uses for the minimum number of groups (≤5 per group).
    function suggestedGroupCount(playerCount){
        return Math.max(1, Math.ceil(playerCount / 5));
    }

    function average(members){
        return members.length ? members.reduce((sum, m) => sum + m.rating, 0) / members.length : 0;
    }

    // Name to enter in n01: the nickname from the "Ніки" sheet if there is one,
    // otherwise the surname (first word), unless another player tonight shares it.
    function n01Names(players, aliasList){
        const nickByName = new Map();
        (aliasList || []).forEach(a => {
            const key = String(a.name || '').trim().toLowerCase();
            if(key && a.alias && !nickByName.has(key)) nickByName.set(key, String(a.alias).trim());
        });
        const surname = name => String(name).trim().split(/\s+/)[0];
        const counts = new Map();
        players.forEach(p => {
            const key = surname(p.name).toLowerCase();
            counts.set(key, (counts.get(key) || 0) + 1);
        });
        const result = new Map();
        players.forEach(p => {
            const nick = nickByName.get(String(p.name).trim().toLowerCase());
            const short = surname(p.name);
            result.set(p.name, nick || (counts.get(short.toLowerCase()) > 1 ? String(p.name).trim() : short));
        });
        return result;
    }

    function formatGroups(groups, names, groupLabel){
        return groups.map((members, i) =>
            [`${groupLabel} ${i + 1}`, ...members.map(m => names.get(m.name) || m.name)].join('\n')
        ).join('\n\n');
    }

    /* ── Match order inside a group ──
       [a, b, m]: positions are 1-based by seed inside the group (1 = highest rating);
       m is the scorer ("маркер") from the club sheet, kept for reference only. Club order for 3–6 players. */
    const SCHEDULES = {
        2: [[1,2,0]],
        3: [[1,3,0],[2,3,0],[1,2,0]],
        4: [[1,3,4],[2,4,3],[1,4,1],[2,3,1],[3,4,3],[1,2,4]],
        5: [[2,5,3],[1,4,2],[3,5,1],[2,4,5],[1,3,4],[4,5,3],[2,3,1],[1,5,4],[3,4,2],[1,2,5]],
        6: [[1,4,6],[2,5,4],[3,6,1],[2,4,5],[1,6,3],[3,5,2],[4,6,5],[2,3,4],[1,5,6],[2,6,3],[4,5,6],[1,3,2],[5,6,1],[3,4,5],[1,2,4]]
    };

    // Fallback for 7+ players: circle method, no markers.
    function circleSchedule(size){
        const slots = Array.from({ length: size % 2 ? size + 1 : size }, (_, i) => i + 1);
        const games = [];
        for(let round = 0; round < slots.length - 1; round++){
            for(let i = 0; i < slots.length / 2; i++){
                const a = slots[i], b = slots[slots.length - 1 - i];
                if(a <= size && b <= size) games.push([Math.min(a, b), Math.max(a, b), 0]);
            }
            slots.splice(1, 0, slots.pop());
        }
        return games;
    }

    function groupSchedule(size){ return SCHEDULES[size] || circleSchedule(size); }

    function randomTpid(used){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id;
        do { id = Array.from({ length:4 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); } while(used.has(id));
        used.add(id);
        return id;
    }

    // Settings as on "Lutsk Pub Darts 12.11.2026": 501, 15-round limit, groups best of 3 legs;
    // playoff best of 3, semi-final best of 5, final best of 7, 3rd-place match best of 3.
    // game_setting rounds: -1 final, -2 semi-final, -3 3rd-place match; limit_leg_count = legs to win.
    const RR_SETTING = {
        round_robin:1, show_order:1, include_leg:0, limit:1, low_win:0, limit_leg_count:2, drawMode:0,
        limit_set_count:2, limit_set_leg_count:2, startScore:501, match_type:'01', limit_rounds:1, overkill:0,
        rounds:15, changeFirst:0, exitResult:0, autoNext:1, setOrder:0, schedule:[], point:0, point_w:2,
        point_d:1, point_l:0, include_set:0, include_set_leg:0, priority_win:0, exclude_from_stats:0, game_setting:[]
    };
    const T_SETTING = {
        tournament:1, t3:1, auto_continue:1, disp_no:1, sequential:0, show_no_all:0, show_badge:1, limit:1,
        low_win:0, limit_leg_count:2, limit_set_count:2, limit_set_leg_count:2,
        game_setting:[
            { round:-3, limit:1, match_type:'01', roundLimit:0, maxRound:15, overkill:0, limit_leg_count:2 },
            { round:-1, limit:1, match_type:'01', roundLimit:0, maxRound:15, overkill:0, limit_leg_count:4 },
            { round:-2, limit:1, match_type:'01', roundLimit:0, maxRound:15, overkill:0, limit_leg_count:3 }
        ],
        changeFirst:0, exitResult:1, autoNext:1, setOrder:0, schedule:[], startScore:501, match_type:'01',
        limit_rounds:1, overkill:0, rounds:15, exclude_from_stats:0
    };

    function dayMonthYear(isoDate){
        const [y, m, d] = String(isoDate).split('-');
        return `${d}.${m}.${y}`;
    }

    // Plain-text match order, e.g. "Група 1: Форманюк – Іра; ...".
    function scheduleText(groups, names, groupLabel){
        return groups.map((members, g) => {
            const name = i => names.get(members[i - 1].name) || members[i - 1].name;
            const games = groupSchedule(members.length).map(([a, b]) => `${name(a)} – ${name(b)}`);
            return `${groupLabel} ${g + 1}: ${games.join('; ')}`;
        }).join('\n');
    }

    // Tournament JSON in the format n01 exports/imports (admin "import settings").
    function buildN01Tournament(groups, names, { date, title, joinPass = '12345', details = '' } = {}){
        const used = new Set();
        const tpidByName = new Map();
        const entry_list = [];
        groups.flat().forEach((player, i) => {
            const tpid = randomTpid(used);
            tpidByName.set(player.name, tpid);
            entry_list.push({ name: names.get(player.name) || player.name, tpid, startScore:0, match_type:'01', index:i + 1 });
        });
        const groupSize = Math.max(...groups.map(g => g.length));
        const rr_table = groups.map(g => {
            const row = g.map(p => tpidByName.get(p.name));
            while(row.length < groupSize) row.push('');
            return row;
        });
        const rr_seq = groups.map(g => groupSchedule(g.length).map(([a, b]) => [tpidByName.get(g[a - 1].name), tpidByName.get(g[b - 1].name)]));
        const rr_order = {};
        [...new Set(groups.map(g => g.length))].forEach(size => {
            rr_order[String(size)] = groupSchedule(size).map(([a, b]) => [a - 1, b - 1]);
        });
        const withPlayoff = groups.length > 1;
        // The club always plays a top-8 playoff; the admin fills it by hand after the groups.
        const bracketSize = 8;
        const t_table = [];
        for(let n = bracketSize; n >= 1; n /= 2) t_table.push(Array(n).fill(''));
        return {
            status:20, kind:'darts',
            title: title || `Lutsk Pub Darts ${dayMonthYear(date)}`,
            t_date:0, details, image:'https://i.postimg.cc/FzvkvtSQ/Elvis.jpg', color:'#f8fafd',
            theme:'', theme_css:'', lang:'', chat:1, show_avg:1, auto_complete:1, confirm_start:0,
            dynamic_avg:0, lf:0, join_pass:joinPass, scorer_pass:'', game_type:5, individual_pass:0,
            hide_sns:0, common_join:1, show_entry_no:0, team_games:0, name_sep:'', private:0,
            select_first:0, win_lose:0, sd_legs:0, softdarts:0, oom:null,
            rr_setting: { ...RR_SETTING, robin_count:groups.length, robin_player_count:groupSize },
            rr_table, rr_result:[], rr_rank:[], rr_seq, rr_order,
            rr_board: groups.map(() => 1),
            t_setting: { ...T_SETTING, tournament: withPlayoff ? 1 : 0, t_player_count:bracketSize },
            t_table, t_result:[], t_title:['', ''],
            entry_list, t_player:[], t_order:[], t_order_fix:[], cricketOnly:0
        };
    }

    return { groupCapacities, serpentineTargets, variantCount, seedPlayersSerpentine, drawByPots, suggestedGroupCount, average, n01Names, formatGroups,
        groupSchedule, scheduleText, buildN01Tournament };
})();

if(typeof module !== 'undefined') module.exports = drawCore;

/* ── UI ── */
if(typeof document !== 'undefined') (function(){
    const STORAGE_SELECTED = 'dartsDrawSelected';
    const STORAGE_GUESTS = 'dartsDrawGuests';
    const $ = id => document.getElementById(id);
    let pool = [];             // [{ name, rating, guest }]
    let selected = new Set();  // names
    let lastGroups = null;

    Object.assign(i18n.uk, {
        viewTabsLabel:'Розділ',
        viewRating:'Рейтинг',
        viewDraw:'Жеребкування',
        drawTitle:'Жеребкування груп',
        drawHint:'Відмітьте, хто грає сьогодні. Гравці сортуються за рейтингом із таблиці й діляться на кошики (у кошику стільки гравців, скільки груп; кошик 1 — найсильніші). З кожного кошика гравці випадково розходяться по групах, по одному в кожну. «Пережеребкувати» робить новий випадковий розподіл.',
        btnDrawLoad:'Завантажити гравців з таблиці',
        drawPlayersTitle:'Хто грає сьогодні',
        drawSearchLabel:'Пошук гравця',
        btnDrawClearSelection:'Зняти всі',
        drawGuestLabel:'Новий гравець',
        btnDrawAddGuest:'Додати',
        drawGuestTag:'новий',
        btnDrawGenerate:'Жеребкувати',
        drawResultTitle:'Групи',
        btnDrawRepeat:'Пережеребкувати',
        btnDrawCopy:'Копіювати для n01',
        btnDrawToRating:'Перенести в розрахунок',
        drawGroup:'Група',
        drawAvg:'Ø',
        drawAvgLabel:'Середній рейтинг',
        drawPot:n=>`К${n}`,
        drawInfo:(n,g,sizes)=>`Гравців: ${n}. Груп: ${g}. У групах: ${sizes}.`,
        drawNeedTwo:'Відмітьте хоча б 2 гравців.',
        drawTooManyGroups:(g,n)=>`Груп (${g}) більше, ніж гравців (${n}).`,
        drawLoaded:n=>`Завантажено ${n} гравців з таблиці.`,
        drawCopied:'Скопійовано. Імена для n01: нік із листа «Ніки» або прізвище.',
        drawCopyFailed:'Не вдалося скопіювати. Виділіть текст вручну.',
        drawGuestExists:'Такий гравець уже є у списку.',
        drawReady:g=>`Готово: ${g} груп.`,
        drawMovedToRating:n=>`Перенесено ${n} гравців у розрахунок.`,
        drawSelectLabel:(name,rating)=>`${name}, рейтинг ${rating}`,
        drawOrderTitle:'Порядок ігор',
        drawExportTitle:'Турнір для n01',
        drawExportHint:'Файл містить гравців, групи й порядок ігор. Налаштування: 501, ліміт 15 раундів, у групах до 2 легів, півфінал до 3, фінал до 4, матч за 3-тє місце до 2. Плей-оф на 8 гравців порожній, його заповнюють після групового етапу. Імпортувати може адмін турніру.',
        btnDrawJson:'Завантажити JSON для n01',
        drawJsonSaved:name=>`Файл ${name} збережено.`,
    });
    Object.assign(i18n.en, {
        viewTabsLabel:'Section',
        viewRating:'Rating',
        viewDraw:'Group draw',
        drawTitle:'Group draw',
        drawHint:'Tick who is playing tonight. Players are sorted by sheet rating and cut into pots (one player per group in each pot; pot 1 is the strongest). Each pot is drawn into the groups at random, one player per group. “Redraw” makes a new random draw.',
        btnDrawLoad:'Load players from sheet',
        drawPlayersTitle:'Playing tonight',
        drawSearchLabel:'Find player',
        btnDrawClearSelection:'Clear all',
        drawGuestLabel:'New player',
        btnDrawAddGuest:'Add',
        drawGuestTag:'new',
        btnDrawGenerate:'Draw groups',
        drawResultTitle:'Groups',
        btnDrawRepeat:'Redraw',
        btnDrawCopy:'Copy for n01',
        btnDrawToRating:'Send to calculator',
        drawGroup:'Group',
        drawAvg:'Avg',
        drawAvgLabel:'Average rating',
        drawPot:n=>`P${n}`,
        drawInfo:(n,g,sizes)=>`Players: ${n}. Groups: ${g}. Group sizes: ${sizes}.`,
        drawNeedTwo:'Tick at least 2 players.',
        drawTooManyGroups:(g,n)=>`More groups (${g}) than players (${n}).`,
        drawLoaded:n=>`Loaded ${n} players from the sheet.`,
        drawCopied:'Copied. n01 names: nickname from the “Ніки” sheet, or surname.',
        drawCopyFailed:'Could not copy. Select the text manually.',
        drawGuestExists:'This player is already in the list.',
        drawReady:g=>`Done: ${g} groups.`,
        drawMovedToRating:n=>`Moved ${n} players to the calculator.`,
        drawSelectLabel:(name,rating)=>`${name}, rating ${rating}`,
        drawOrderTitle:'Match order',
        drawExportTitle:'Tournament for n01',
        drawExportHint:'The file holds players, groups and match order. Settings: 501, 15-round limit, groups best of 3 legs, semi-final best of 5, final best of 7, 3rd-place match best of 3. The top-8 playoff is left empty and filled after the group stage. Only the tournament admin can import it.',
        btnDrawJson:'Download JSON for n01',
        drawJsonSaved:name=>`Saved ${name}.`,
    });

    function storageGet(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){ return fallback; } }
    function storageSet(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){} }

    function setStatus(id, kind, message){
        const el = $(id);
        el.className = 'alert ' + (kind === 'error' ? 'alert-error' : kind === 'success' ? 'alert-success' : 'alert-info');
        el.textContent = message;
        setHidden(el, !message);
    }

    /* View switch (Rating ↔ Draw) */
    function activateView(tab, { focus = true } = {}){
        document.querySelectorAll('[data-view-tab]').forEach(candidate => {
            const isSelected = candidate === tab;
            candidate.classList.toggle('active', isSelected);
            candidate.setAttribute('aria-selected', String(isSelected));
            candidate.tabIndex = isSelected ? 0 : -1;
            setHidden($(candidate.getAttribute('aria-controls')), !isSelected);
        });
        if(focus) tab.focus();
        if(tab.id === 'viewDrawTab' && !pool.length) loadPlayers();
    }
    function handleViewKeydown(event){
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const tabs = [...document.querySelectorAll('[data-view-tab]')];
        const index = tabs.indexOf(event.currentTarget);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        activateView(tabs[next]);
    }

    /* Players */
    async function loadPlayers(){
        const button = $('drawLoadButton');
        button.disabled = true;
        setStatus('drawStatus', 'info', t('sheetsLoading'));
        try{
            if(!dartsSheets.ratings().size) await dartsSheets.fetchRatings();
            const guests = storageGet(STORAGE_GUESTS, []).filter(name => typeof name === 'string');
            const fromSheet = [...dartsSheets.ratings().values()].map(p => ({ name:p.name, rating:p.rating, guest:false }));
            const known = new Set(fromSheet.map(p => p.name.toLowerCase()));
            pool = [...fromSheet, ...guests.filter(g => !known.has(g.toLowerCase())).map(name => ({ name, rating:0, guest:true }))];
            const saved = storageGet(STORAGE_SELECTED, []);
            selected = new Set(pool.filter(p => saved.includes(p.name)).map(p => p.name));
            setStatus('drawStatus', 'success', t('drawLoaded', fromSheet.length));
            setHidden($('drawPickBlock'), false);
            renderPool();
            selectionChanged();
        }catch(error){
            setStatus('drawStatus', 'error', error instanceof TypeError || error instanceof SyntaxError ? t('sheetsNetworkError') : t('sheetsError', error.message));
        }finally{
            button.disabled = false;
        }
    }

    function sortedPool(){ return [...pool].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, 'uk')); }

    function renderPool(){
        const query = $('drawSearch').value.trim().toLowerCase();
        const items = sortedPool().filter(p => !query || p.name.toLowerCase().includes(query)).map(p => {
            const item = document.createElement('li');
            item.className = 'draw-player' + (selected.has(p.name) ? ' is-selected' : '');
            const label = document.createElement('label');
            const box = document.createElement('input');
            box.type = 'checkbox';
            box.checked = selected.has(p.name);
            box.setAttribute('aria-label', t('drawSelectLabel', p.name, fmt(p.rating)));
            box.addEventListener('change', () => {
                if(box.checked) selected.add(p.name); else selected.delete(p.name);
                item.classList.toggle('is-selected', box.checked);
                selectionChanged();
            });
            const name = document.createElement('span');
            name.className = 'draw-player-name';
            name.textContent = p.name;
            if(p.guest){
                const tag = document.createElement('span');
                tag.className = 'draw-guest-tag';
                tag.textContent = t('drawGuestTag');
                name.append(' ', tag);
            }
            const rating = document.createElement('span');
            rating.className = 'draw-player-rating';
            rating.setAttribute('aria-hidden', 'true');
            rating.textContent = fmt(p.rating);
            label.append(box, name, rating);
            item.append(label);
            return item;
        });
        $('drawPlayerList').replaceChildren(...items);
    }

    function selectedPlayers(){ return sortedPool().filter(p => selected.has(p.name)); }

    function selectionChanged(){
        storageSet(STORAGE_SELECTED, [...selected]);
        const count = selected.size;
        $('drawSelectedCount').textContent = String(count);
        renderGroupOptions(drawCore.suggestedGroupCount(count));
        updateInfo();
    }

    function renderGroupOptions(value){
        const select = $('drawGroupCount');
        const max = Math.max(4, value, Math.min(8, Math.floor(selected.size / 2)));
        select.replaceChildren(...Array.from({ length:max }, (_, i) => {
            const option = document.createElement('option');
            option.value = String(i + 1);
            option.textContent = t('groupOption', i + 1);
            return option;
        }));
        select.value = String(value);
    }

    function groupCount(){ return parseInt($('drawGroupCount').value, 10) || 1; }

    function updateInfo(){
        const n = selected.size, g = groupCount();
        $('drawInfo').textContent = n >= 2 && g <= n ? t('drawInfo', n, g, drawCore.groupCapacities(n, g).join(' / ')) : '';
    }

    function addGuest(){
        const input = $('drawGuestName');
        const name = input.value.trim().replace(/\s+/g, ' ');
        if(!name) return;
        const existing = pool.find(p => p.name.toLowerCase() === name.toLowerCase());
        if(existing){
            selected.add(existing.name);
            setStatus('drawStatus', 'info', t('drawGuestExists'));
        } else {
            pool.push({ name, rating:0, guest:true });
            storageSet(STORAGE_GUESTS, pool.filter(p => p.guest).map(p => p.name));
            selected.add(name);
        }
        input.value = '';
        renderPool();
        selectionChanged();
        input.focus();
    }

    function clearSelection(){
        selected.clear();
        renderPool();
        selectionChanged();
    }

    /* Draw */
    function generate(reroll){
        const error = $('drawError');
        setHidden(error, true);
        const list = selectedPlayers();
        const g = groupCount();
        if(list.length < 2 || g > list.length){
            error.textContent = list.length < 2 ? t('drawNeedTwo') : t('drawTooManyGroups', g, list.length);
            setHidden(error, false);
            error.focus();
            return;
        }
        lastGroups = drawCore.drawByPots(list, g);
        renderGroups(lastGroups, list.length);
        setHidden($('drawCopyStatus'), true);
        announce(t('drawReady', g));
    }

    function renderGroups(groups, total){
        const names = drawCore.n01Names(groups.flat(), dartsSheets.aliasList());
        const cards = groups.map((members, i) => {
            const card = document.createElement('article');
            card.className = 'draw-group';
            const heading = document.createElement('h4');
            heading.className = 'draw-group-title';
            heading.textContent = `${t('drawGroup')} ${i + 1}`;
            const size = document.createElement('span');
            size.className = 'player-count-badge';
            size.textContent = String(members.length);
            heading.append(size);
            const list = document.createElement('ol');
            list.className = 'draw-members';
            members.forEach(member => {
                const item = document.createElement('li');
                item.className = 'draw-member draw-tier-' + Math.min(4, member.pot || 4);
                const name = document.createElement('span');
                name.className = 'draw-member-name';
                name.textContent = member.name;
                const nick = names.get(member.name);
                if(nick && nick !== member.name){
                    const n01 = document.createElement('span');
                    n01.className = 'draw-member-nick';
                    n01.textContent = 'n01: ' + nick;
                    name.append(n01);
                }
                const rating = document.createElement('span');
                rating.className = 'draw-member-rating';
                rating.textContent = fmt(member.rating);
                const pot = document.createElement('span');
                pot.className = 'draw-member-pot';
                pot.textContent = t('drawPot', member.pot);
                item.append(name, pot, rating);
                list.append(item);
            });
            const avg = document.createElement('p');
            avg.className = 'draw-avg';
            avg.setAttribute('aria-label', `${t('drawAvgLabel')}: ${drawCore.average(members).toFixed(1).replace('.', ',')}`);
            avg.textContent = `${t('drawAvg')} ${drawCore.average(members).toFixed(1).replace('.', ',')}`;
            const order = document.createElement('details');
            order.className = 'draw-order';
            const summary = document.createElement('summary');
            summary.textContent = t('drawOrderTitle');
            const games = document.createElement('ol');
            drawCore.groupSchedule(members.length).forEach(([a, b]) => {
                const nick = i => names.get(members[i - 1].name) || members[i - 1].name;
                const game = document.createElement('li');
                game.textContent = `${nick(a)} – ${nick(b)}`;
                games.append(game);
            });
            order.append(summary, games);
            card.append(heading, list, avg, order);
            return card;
        });
        $('drawGroups').replaceChildren(...cards);
        setHidden($('drawResult'), false);
        $('draw-result-heading').focus();
    }

    async function copyForN01(){
        if(!lastGroups) return;
        const names = drawCore.n01Names(lastGroups.flat(), dartsSheets.aliasList());
        const text = drawCore.formatGroups(lastGroups, names, t('drawGroup'));
        try{
            await navigator.clipboard.writeText(text);
            setStatus('drawCopyStatus', 'success', t('drawCopied'));
        }catch(e){
            setStatus('drawCopyStatus', 'error', t('drawCopyFailed') + '\n\n' + text);
        }
    }

    function downloadJson(){
        if(!lastGroups) return;
        const names = drawCore.n01Names(lastGroups.flat(), dartsSheets.aliasList());
        const date = $('drawDate').value || new Date().toISOString().slice(0, 10);
        const data = drawCore.buildN01Tournament(lastGroups, names, { date });
        const fileName = `lutsk-pub-darts-${date}.json`;
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
        setStatus('drawCopyStatus', 'success', t('drawJsonSaved', fileName));
    }

    function sendToRating(){
        if(!lastGroups) return;
        const list = lastGroups.flat();
        players = list.map(p => ({ name:p.name, originalName:p.name, rating:p.rating, points:0, newRating:p.rating, placeValue:'' }));
        selectType(lastGroups.length > 1 || list.length > 7 ? 'se' : 'sg');
        const countSelect = $(currentType === 'sg' ? 'playerCountSG' : 'playerCountSE');
        const option = [...countSelect.options].reverse().find(o => Number(o.value) <= list.length);
        if(option) countSelect.value = option.value;
        updateTournamentInfo();
        if(currentType === 'se'){
            const groupSelect = $('groupCount');
            if([...groupSelect.options].some(o => o.value === String(lastGroups.length) && !o.disabled)) groupSelect.value = String(lastGroups.length);
            updateTournamentInfo();
        }
        renderImportedPlayers();
        clearPlayerSetupError();
        activateInputTab($('inputManualTab'), { focus:false });
        showStep(1);
        activateView($('viewRatingTab'));
        announce(t('drawMovedToRating', players.length));
    }

    // Tournaments are on Thursdays: default to today if it is Thursday, else the next one.
    function nextThursday(){
        const d = new Date();
        d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7));
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function init(){
        document.querySelectorAll('[data-view-tab]').forEach(tab => {
            tab.addEventListener('click', () => activateView(tab));
            tab.addEventListener('keydown', handleViewKeydown);
        });
        $('drawLoadButton').addEventListener('click', loadPlayers);
        $('drawSearch').addEventListener('input', renderPool);
        $('drawClearSelection').addEventListener('click', clearSelection);
        $('drawAddGuest').addEventListener('click', addGuest);
        $('drawGuestName').addEventListener('keydown', event => { if(event.key === 'Enter'){ event.preventDefault(); addGuest(); } });
        $('drawGroupCount').addEventListener('change', updateInfo);
        $('drawGenerateButton').addEventListener('click', () => generate(false));
        $('drawRepeatButton').addEventListener('click', () => generate(true));
        $('drawCopyButton').addEventListener('click', copyForN01);
        $('drawToRatingButton').addEventListener('click', sendToRating);
        $('drawJsonButton').addEventListener('click', downloadJson);
        $('drawDate').value = nextThursday();
        // Re-render translated bits when the language changes.
        ['btnUA','btnEN'].forEach(id => $(id).addEventListener('click', () => {
            if(pool.length){ renderPool(); renderGroupOptions(groupCount()); updateInfo(); }
            if(lastGroups) renderGroups(lastGroups, lastGroups.flat().length);
        }));
        setLang(currentLang);
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init, { once:true });
    } else {
        init();
    }
})();
