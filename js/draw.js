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

    return { groupCapacities, serpentineTargets, variantCount, seedPlayersSerpentine, suggestedGroupCount, average, n01Names, formatGroups };
})();

if(typeof module !== 'undefined') module.exports = drawCore;

/* ── UI ── */
if(typeof document !== 'undefined') (function(){
    const STORAGE_SELECTED = 'dartsDrawSelected';
    const STORAGE_GUESTS = 'dartsDrawGuests';
    const $ = id => document.getElementById(id);
    let pool = [];             // [{ name, rating, guest }]
    let selected = new Set();  // names
    let variant = 0;
    let lastKey = '';
    let lastGroups = null;

    Object.assign(i18n.uk, {
        viewTabsLabel:'Розділ',
        viewRating:'Рейтинг',
        viewDraw:'Жеребкування',
        drawTitle:'Жеребкування груп',
        drawHint:'Відмітьте, хто грає сьогодні. Гравці розподіляються «змійкою» за рейтингом із таблиці: найсильніший завжди в групі 1, групи відрізняються максимум на одного гравця. «Інший варіант» міняє місцями сусідніх за рейтингом гравців, тож баланс зберігається.',
        btnDrawLoad:'Завантажити гравців з таблиці',
        drawPlayersTitle:'Хто грає сьогодні',
        drawSearchLabel:'Пошук гравця',
        btnDrawClearSelection:'Зняти всі',
        drawGuestLabel:'Новий гравець',
        btnDrawAddGuest:'Додати',
        drawGuestTag:'новий',
        btnDrawGenerate:'Жеребкувати',
        drawResultTitle:'Групи',
        btnDrawRepeat:'Інший варіант',
        btnDrawCopy:'Копіювати для n01',
        btnDrawToRating:'Перенести в розрахунок',
        drawGroup:'Група',
        drawAvg:'Ø',
        drawAvgLabel:'Середній рейтинг',
        drawVariant:(k,n)=>`варіант ${k} з ${n}`,
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
    });
    Object.assign(i18n.en, {
        viewTabsLabel:'Section',
        viewRating:'Rating',
        viewDraw:'Group draw',
        drawTitle:'Group draw',
        drawHint:'Tick who is playing tonight. Players are seeded serpentine-style by their sheet rating: the strongest is always in group 1 and group sizes differ by at most one. “Another variant” swaps neighbouring ratings, so balance is kept.',
        btnDrawLoad:'Load players from sheet',
        drawPlayersTitle:'Playing tonight',
        drawSearchLabel:'Find player',
        btnDrawClearSelection:'Clear all',
        drawGuestLabel:'New player',
        btnDrawAddGuest:'Add',
        drawGuestTag:'new',
        btnDrawGenerate:'Draw groups',
        drawResultTitle:'Groups',
        btnDrawRepeat:'Another variant',
        btnDrawCopy:'Copy for n01',
        btnDrawToRating:'Send to calculator',
        drawGroup:'Group',
        drawAvg:'Avg',
        drawAvgLabel:'Average rating',
        drawVariant:(k,n)=>`variant ${k} of ${n}`,
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
        const key = JSON.stringify([g, list.map(p => [p.name, p.rating])]);
        if(key !== lastKey){ lastKey = key; variant = 0; }
        else if(reroll) variant = (variant + 1) % drawCore.variantCount(list.length, g);
        lastGroups = drawCore.seedPlayersSerpentine(list, g, variant);
        renderGroups(lastGroups, list.length);
        setHidden($('drawCopyStatus'), true);
        announce(t('drawReady', g));
    }

    function renderGroups(groups, total){
        const names = drawCore.n01Names(groups.flat(), dartsSheets.aliasList());
        const ranked = groups.flat().sort((a, b) => b.rating - a.rating);
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
                const tier = Math.min(3, Math.floor(ranked.indexOf(member) / ranked.length * 4));
                const item = document.createElement('li');
                item.className = 'draw-member draw-tier-' + (tier + 1);
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
                item.append(name, rating);
                list.append(item);
            });
            const avg = document.createElement('p');
            avg.className = 'draw-avg';
            avg.setAttribute('aria-label', `${t('drawAvgLabel')}: ${drawCore.average(members).toFixed(1).replace('.', ',')}`);
            avg.textContent = `${t('drawAvg')} ${drawCore.average(members).toFixed(1).replace('.', ',')}`;
            card.append(heading, list, avg);
            return card;
        });
        $('drawGroups').replaceChildren(...cards);
        $('drawVariant').textContent = t('drawVariant', variant + 1, drawCore.variantCount(total, groups.length));
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
