/* ═══════════════════════════════════════
   i18n
═══════════════════════════════════════ */
let currentLang = 'uk';
const i18n = {
    uk: {
        skipLink:'Перейти до основного вмісту',
        languageSelect:'Вибір мови', languageUa:'Обрати українську мову', languageEn:'Обрати англійську мову',
        stepsLabel:'Етапи розрахунку рейтингу',
        resultsTableCaption:'Підсумкова таблиця рейтингу',
        appTitle:'Рейтинг дартс', appSubtitle:'Калькулятор турнірних очок',
        step1Label:'Гравці', step2Label:'Місця', step3Label:'Результат',
        s1Title:'Імпорт гравців та налаштування турніру',
        s2Title:'Визначення місць у турнірі', s3Title:'Новий рейтинг',
        tournamentTypeLabel:'Тип турніру',
        typeDE:'Подвійне вибування', typeDEDesc:'Вибування після двох поразок',
        typeSE:'Кілька груп + плей-оф', typeSEDesc:'Груповий етап із плей-оф на вибування',
        typeSG:'Одна група', typeSGDesc:'До 7 гравців без плей-оф',
        singleGroupNoteTitle:'Увага',
        singleGroupNote:'Якщо в турнірі з однією групою було зіграно плей-оф, бали розраховуються за правилами турніру з кількома групами.',
        singleGroupPointsTitle:'Бали', singleGroupLimit:'Для турніру з однією групою можна додати не більше 7 гравців.',
        playerCountLabel:'Кількість учасників', groupCountLabel:'Кількість груп',
        groupOption:n => {
            const form=n%10===1&&n%100!==11?'група':(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'групи':'груп');
            return `${n} ${form}`;
        },
        coefLabel:'Коефіцієнт турніру',
        schemeTitle:'Схема нарахування балів',
        pointsUnit:'балів',
        nicknameTitle:'Відповідність нікнеймів',
        btnEditNicknames:'Редагувати', btnAddMapping:'Додати', btnSaveMappings:'Зберегти',
        inputMethodLabel:'Спосіб введення гравців', tabManual:'Вручну', tabImport:'Імпорт з таблиці',
        playersTitle:'Гравці', btnAddPlayer:'Додати гравця', btnClearPlayers:'Очистити список',
        playerNamePlaceholder:'Імʼя гравця', playerRatingPlaceholder:'Рейтинг',
        playerNameLabel:n => `Імʼя гравця ${n}`,
        playerRatingLabel:n => `Рейтинг гравця ${n}`,
        playerCountLabelText:n => {
            const form=n%10===1&&n%100!==11?'гравець':(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'гравці':'гравців');
            return `${n} ${form}`;
        },
        playerAdded:'Додано нового гравця.', playersCleared:'Список гравців очищено.',
        playersEmpty:'Додайте хоча б одного гравця!',
        importLabel:'Вставте дані з Google Таблиць:',
        importPlaceholderFull:'Формат: Гравець [Пробіл] Рейтинг',
        btnImport:'Імпортувати гравців', btnClear:'Очистити',
        importedTitle:'Імпортовані гравці',
        btnNextStep:'Перейти до розподілу місць',
        colPlayer:'Гравець', colRating:'Рейтинг', colPlace:'Місце',
        colTournamentPlace:'Місце в турнірі', colPoints:'Бали',
        colNewRating:'Новий рейтинг', colCurrentRating:'Рейтинг',
        colEarned:'Нараховано', colChange:'Зміна',
        btnCalculate:'Розрахувати рейтинг', btnBack:'Назад',
        btnExportCSV:'Експорт CSV', btnExportExcel:'Експорт Excel', btnCopy:'Копіювати',
        btnNewTournament:'Новий турнір', copiedMsg:'Скопійовано!',
        placeSelectDefault:'— Оберіть місце —',
        importedCount: n => `Імпортовано ${n} гравців!`,
        importEmpty:'Введіть дані для імпорту!',
        importFailed:'Не вдалося розпізнати гравців. Перевірте формат!',
        savedMsg:'Нікнейми збережено!',
        nicknamePlaceholderNick:'Нікнейм', nicknamePlaceholderReal:'Повне ім\'я',
        mappingNickLabel:n => `Нікнейм у відповідності ${n}`,
        mappingRealLabel:n => `Повне імʼя у відповідності ${n}`,
        removeMappingLabel:n => `Видалити відповідність ${n}`,
        mappingAdded:'Додано нову відповідність нікнеймів.',
        mappingRemoved:'Відповідність нікнеймів видалено.',
        removePlayerLabel:name => `Видалити гравця ${name}`,
        playerRemoved:name => `Гравця ${name} видалено.`,
        importCleared:'Дані імпорту очищено.',
        placeForPlayer:name => `Місце в турнірі для ${name}`,
        stepAnnouncement:(step,total,title) => `Етап ${step} з ${total}: ${title}`,
        summaryType:'Тип', summaryPlayers:'Гравців', summaryCoef:'Коефіцієнт',
        csvTitle:'НОВИЙ РЕЙТИНГ ДАРТС',
        excelSheetName:'Результати',
        // DE place labels
        de_1:'1 місце',
        de_2:'2 місце',
        de_3:'3 місце',
        de_4:'4 місце',
        de_56:'5–6 місця',
        de_78:'7–8 місце',
        de_912:'9–12 місця',
        de_1316:'13–16 місця',
        // SE place labels
        se_winner:'Переможець',
        se_finalist:'Фіналіст',
        se_semi:'Півфіналіст',
        se_quarter:'1/4 фіналу',
        se_group3:'Група 3 місце',
        se_group4:'Група 4 місце',
        se_group5:'Група 5 місце',
        sg_1:'1 місце', sg_2:'2 місце', sg_3:'3 місце', sg_4:'4 місце',
        sg_5:'5 місце', sg_6:'6 місце', sg_7:'7 місце',
    },
    en: {
        skipLink:'Skip to main content',
        languageSelect:'Language selection', languageUa:'Select Ukrainian', languageEn:'Select English',
        stepsLabel:'Rating calculation steps',
        resultsTableCaption:'Final rating table',
        appTitle:'Darts Rating', appSubtitle:'Tournament Points Calculator',
        step1Label:'Players', step2Label:'Places', step3Label:'Results',
        s1Title:'Import Players & Tournament Setup',
        s2Title:'Assign Tournament Places', s3Title:'New Rating',
        tournamentTypeLabel:'Tournament type',
        typeDE:'Double Elimination', typeDEDesc:'Elimination after two losses',
        typeSE:'Multiple Groups + Playoff', typeSEDesc:'Group stage followed by an elimination playoff',
        typeSG:'Single Group', typeSGDesc:'Up to 7 players without a playoff',
        singleGroupNoteTitle:'Attention',
        singleGroupNote:'If a single-group tournament included a playoff, calculate its points using the multiple-groups tournament rules.',
        singleGroupPointsTitle:'Points', singleGroupLimit:'A single-group tournament can include no more than 7 players.',
        playerCountLabel:'Number of players', groupCountLabel:'Number of groups',
        groupOption:n => `${n} ${n===1?'group':'groups'}`,
        coefLabel:'Tournament coefficient',
        schemeTitle:'Points breakdown',
        pointsUnit:'pts',
        nicknameTitle:'Nickname mappings',
        btnEditNicknames:'Edit', btnAddMapping:'Add', btnSaveMappings:'Save',
        inputMethodLabel:'Player input method', tabManual:'Manual', tabImport:'Import from table',
        playersTitle:'Players', btnAddPlayer:'Add player', btnClearPlayers:'Clear list',
        playerNamePlaceholder:'Player name', playerRatingPlaceholder:'Rating',
        playerNameLabel:n => `Player ${n} name`,
        playerRatingLabel:n => `Player ${n} rating`,
        playerCountLabelText:n => `${n} ${n===1?'player':'players'}`,
        playerAdded:'A new player was added.', playersCleared:'The player list was cleared.',
        playersEmpty:'Add at least one player!',
        importLabel:'Paste data from Google Sheets:',
        importPlaceholderFull:'Format: Last name First name [Tab] Rating',
        btnImport:'Import Players', btnClear:'Clear',
        importedTitle:'Imported players',
        btnNextStep:'Go to place assignment',
        colPlayer:'Player', colRating:'Rating', colPlace:'Place',
        colTournamentPlace:'Tournament place', colPoints:'Points',
        colNewRating:'New rating', colCurrentRating:'Rating',
        colEarned:'Earned', colChange:'Change',
        btnCalculate:'Calculate Rating', btnBack:'Back',
        btnExportCSV:'Export CSV', btnExportExcel:'Export Excel', btnCopy:'Copy',
        btnNewTournament:'New Tournament', copiedMsg:'Copied!',
        placeSelectDefault:'— Select place —',
        importedCount: n => `Imported ${n} players!`,
        importEmpty:'Please enter data to import!',
        importFailed:'Could not parse players. Check the format!',
        savedMsg:'Nicknames saved!',
        nicknamePlaceholderNick:'Nickname', nicknamePlaceholderReal:'Full name',
        mappingNickLabel:n => `Nickname in mapping ${n}`,
        mappingRealLabel:n => `Full name in mapping ${n}`,
        removeMappingLabel:n => `Remove mapping ${n}`,
        mappingAdded:'A new nickname mapping was added.',
        mappingRemoved:'The nickname mapping was removed.',
        removePlayerLabel:name => `Remove player ${name}`,
        playerRemoved:name => `Player ${name} was removed.`,
        importCleared:'Import data cleared.',
        placeForPlayer:name => `Tournament place for ${name}`,
        stepAnnouncement:(step,total,title) => `Step ${step} of ${total}: ${title}`,
        summaryType:'Type', summaryPlayers:'Players', summaryCoef:'Coefficient',
        csvTitle:'NEW DARTS RATING',
        excelSheetName:'Results',
        de_1:'1st place',
        de_2:'2nd place',
        de_3:'3rd place',
        de_4:'4th place',
        de_56:'5th–6th place',
        de_78:'7th–8th place',
        de_912:'9th–12th place',
        de_1316:'13th–16th place',
        se_winner:'Winner',
        se_finalist:'Finalist',
        se_semi:'Semi-finalist',
        se_quarter:'Quarter-final',
        se_group3:'Group 3rd place',
        se_group4:'Group 4th place',
        se_group5:'Group 5th place',
        sg_1:'1st place', sg_2:'2nd place', sg_3:'3rd place', sg_4:'4th place',
        sg_5:'5th place', sg_6:'6th place', sg_7:'7th place',
    }
};
function t(key,...args){
    const v = i18n[currentLang]?.[key] ?? i18n.uk[key] ?? key;
    return typeof v === 'function' ? v(...args) : v;
}
function setLang(lang){
    if(!i18n[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.title = lang === 'en' ? 'Darts Rating — Tournament Calculator' : 'Рейтинг дартс — калькулятор турніру';
    const uaButton = document.getElementById('btnUA');
    const enButton = document.getElementById('btnEN');
    uaButton.classList.toggle('active', lang==='uk');
    enButton.classList.toggle('active', lang==='en');
    uaButton.setAttribute('aria-pressed', String(lang==='uk'));
    enButton.setAttribute('aria-pressed', String(lang==='en'));
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        el.textContent = t(k);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
    updateTournamentInfo();
    const setupError=document.getElementById('playerSetupError');
    if(setupError&&!setupError.hidden){
        setupError.textContent=currentType==='sg'&&players.length>7?t('singleGroupLimit'):t('playersEmpty');
    }
    const mappingEdit=document.getElementById('mappingEdit');
    if(mappingEdit && !mappingEdit.hidden){
        document.querySelectorAll('.mapping-nick').forEach(input=>{ input.placeholder=t('nicknamePlaceholderNick'); });
        document.querySelectorAll('.mapping-real').forEach(input=>{ input.placeholder=t('nicknamePlaceholderReal'); });
        updateMappingAccessibility();
    }
    renderImportedPlayers();
    if(players.length){
        renderPlaceAssignment();
    }
    if(!document.getElementById('step3').hidden) renderResults();
}

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
let players = [];
let currentType = 'se';  // 'de' | 'se' | 'sg'
let mappingRowCounter = 0;
let nicknameMappings = {
    'Elvis':'Корпусов Андрій','Saprik':'Сапронов Петро',
    'Чубатий':'Матвійчук Олександр','Юля':'Софлюк Юлія'
};

/* ── Double Elimination points table ── */
const deCoefficients = { 7:1.0, 8:1.0, 9:1.25, 10:1.25, 11:1.25, 12:1.5 };
const deBasePoints = {1:100, 2:75, 3:62.5, 4:50, 56:35, 78:25, 912:15, 1316:10};
const dePlaceKeys  = ['1','2','3','4','56','78','912','1316'];

const dePointsTable = {};
[7,8,9,10,11,12].forEach(n => {
    const c = deCoefficients[n];
    dePointsTable[n] = {};
    dePlaceKeys.forEach(k => { dePointsTable[n][k] = +(deBasePoints[k] * c).toFixed(3); });
});

/* ── Standard SE points table ── */
const seCoefficients = {
    3:0.5, 4:0.75, 5:0.75, 6:0.75,
    7:1.0, 8:1.0, 9:1.25, 10:1.25, 11:1.25, 12:1.5
};
const seBasePoints = {winner:100,finalist:75,semi:50,quarter:35,group3:25,group4:15,group5:10};
const seTournamentPoints = {};
Object.entries(seCoefficients).forEach(([count,coefficient])=>{
    seTournamentPoints[count]=Object.fromEntries(
        Object.entries(seBasePoints).map(([place,points])=>[place,+(points*coefficient).toFixed(3)])
    );
});

/* ── Single-group points table ── */
const sgTournamentPoints = {
    3: {1:50,2:37.5,3:25},
    4: {1:75,2:56.25,3:37.5,4:26.25,5:18.75,6:11.25},
    7: {1:100,2:75,3:50,4:35,5:25,6:15,7:10}
};
/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function getCount(){
    const id = currentType==='de' ? 'playerCountDE' : currentType==='sg' ? 'playerCountSG' : 'playerCountSE';
    return parseInt(document.getElementById(id).value, 10) || 10;
}
function getCountLabel(){
    const id=currentType==='de'?'playerCountDE':currentType==='sg'?'playerCountSG':'playerCountSE';
    const select=document.getElementById(id);
    return select.options[select.selectedIndex]?.textContent||String(getCount());
}
function getGroupCount(){ return parseInt(document.getElementById('groupCount').value, 10) || 2; }
function getGroupParticipantCount(){ return Math.max(getCount(),players.length); }
function getRequiredGroupCount(){ return Math.max(1,Math.ceil(getGroupParticipantCount()/5)); }
function updateGroupCountConstraints(){
    const select=document.getElementById('groupCount');
    const requiredGroups=getRequiredGroupCount();
    const previousValue=getGroupCount();
    const maximumOption=Math.max(4,requiredGroups);

    while(select.options.length<maximumOption){
        const value=select.options.length+1;
        const option=document.createElement('option');
        option.value=String(value);
        select.appendChild(option);
    }
    while(select.options.length>maximumOption) select.remove(select.options.length-1);

    [...select.options].forEach(option=>{
        const value=Number(option.value);
        option.disabled=value<requiredGroups;
        option.textContent=t('groupOption',value);
    });
    select.value=String(Math.min(Math.max(previousValue,requiredGroups),maximumOption));
}
function getSePlaceKeys(){
    const maximumGroupSize=Math.ceil(getGroupParticipantCount()/getGroupCount());
    const groupKeys=[];
    if(maximumGroupSize>=3) groupKeys.push('group3');
    if(maximumGroupSize>=4) groupKeys.push('group4');
    if(maximumGroupSize>=5) groupKeys.push('group5');
    return ['winner','finalist','semi','quarter',...groupKeys];
}
function getSgPlaceKeys(){ return Object.keys(sgTournamentPoints[getCount()]||sgTournamentPoints[7]); }
function normalizeName(name){
    name = name.trim();
    for(let [nick,real] of Object.entries(nicknameMappings)){
        if(name.toLowerCase()===nick.toLowerCase()) return real;
    }
    return name;
}
function parseRating(str){
    if(!str) return 0;
    return parseFloat(String(str).replace(/\s/g,'').replace(',','.')) || 0;
}
function fixedToThreeDecimals(v){ return Number(v).toFixed(3).replace(/0$/,''); }
function fmt(v){ return fixedToThreeDecimals(v).replace('.',','); }
function setHidden(element, hidden){
    element.hidden=hidden;
    element.classList.toggle('hidden',hidden);
}
function announce(message){
    const status=document.getElementById('app-status');
    status.textContent='';
    window.requestAnimationFrame(()=>{ status.textContent=message; });
}
function showError(msg){
    const error=document.getElementById('importError');
    const success=document.getElementById('importSuccess');
    error.textContent=msg;
    success.textContent='';
    setHidden(error,false);
    setHidden(success,true);
    error.focus();
}
function showSuccess(msg){
    const success=document.getElementById('importSuccess');
    const error=document.getElementById('importError');
    success.textContent=msg;
    error.textContent='';
    setHidden(success,false);
    setHidden(error,true);
    announce(msg);
}

/* ═══════════════════════════════════════
   TOURNAMENT TYPE SELECT
═══════════════════════════════════════ */
function selectType(type){
    if(type==='se' && !document.getElementById('typeSE')) type='de';
    if(type==='sg' && !document.getElementById('typeSG')) type='de';
    currentType = type;
    const deButton = document.getElementById('typeDE');
    const seButton = document.getElementById('typeSE');
    const sgButton = document.getElementById('typeSG');
    deButton?.classList.toggle('selected', type==='de');
    seButton?.classList.toggle('selected', type==='se');
    sgButton?.classList.toggle('selected', type==='sg');
    deButton?.setAttribute('aria-pressed', String(type==='de'));
    seButton?.setAttribute('aria-pressed', String(type==='se'));
    sgButton?.setAttribute('aria-pressed', String(type==='sg'));
    const deParams=document.getElementById('deParams');
    const seParams=document.getElementById('seParams');
    const sgParams=document.getElementById('sgParams');
    if(deParams) setHidden(deParams,type!=='de');
    if(seParams) setHidden(seParams,type!=='se');
    if(sgParams) setHidden(sgParams,type!=='sg');
    updateTournamentInfo();
}

function renderPointsScheme(listId, entries){
    const rows=entries.map(([label,points])=>{
        const row=document.createElement('li');
        row.className='scheme-row';

        const place=document.createElement('span');
        place.className='scheme-place';
        place.textContent=label;

        const value=document.createElement('strong');
        value.className='scheme-points';
        value.textContent=`${fmt(points)} ${t('pointsUnit')}`;

        row.append(place,value);
        return row;
    });
    document.getElementById(listId).replaceChildren(...rows);
}

/* ═══════════════════════════════════════
   TOURNAMENT INFO
═══════════════════════════════════════ */
function updateTournamentInfo(){
    const count = getCount();
    if(currentType==='de'){
        const coef = deCoefficients[Math.min(count,12)] ?? 1.5;
        document.getElementById('coefDisplayDE').textContent = coef;
        const table = dePointsTable[Math.min(count,12)] || dePointsTable[12];
        renderPointsScheme(
            'deSchemeList',
            dePlaceKeys.map(k=>[t('de_'+k),table[k]])
        );
    } else if(currentType==='se') {
        updateGroupCountConstraints();
        const coef = seCoefficients[Math.min(count,12)] ?? 1.5;
        document.getElementById('coefDisplaySE').textContent = coef;
        const table = seTournamentPoints[Math.min(count,12)] || seTournamentPoints[12];
        renderPointsScheme(
            'seSchemeList',
            getSePlaceKeys().map(k=>[t('se_'+k),table[k]])
        );
    } else {
        const table=sgTournamentPoints[count]||sgTournamentPoints[7];
        renderPointsScheme(
            'sgSchemeList',
            Object.keys(table).map(k=>[t('sg_'+k),table[k]])
        );
    }
}

/* ═══════════════════════════════════════
   PLAYER INPUT TABS
═══════════════════════════════════════ */
function activateInputTab(tab,{focus=true}={}){
    if(!tab) return;
    document.querySelectorAll('[data-input-tab]').forEach(candidate=>{
        const selected=candidate===tab;
        candidate.classList.toggle('active',selected);
        candidate.setAttribute('aria-selected',String(selected));
        candidate.tabIndex=selected?0:-1;
        const panel=document.getElementById(candidate.getAttribute('aria-controls'));
        if(panel){
            panel.classList.toggle('active',selected);
            setHidden(panel,!selected);
        }
    });
    if(focus) tab.focus();
}

function handleInputTabKeydown(event){
    const tabs=[...document.querySelectorAll('[data-input-tab]')];
    const index=tabs.indexOf(event.currentTarget);
    let targetIndex=index;
    if(event.key==='ArrowRight') targetIndex=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft') targetIndex=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home') targetIndex=0;
    else if(event.key==='End') targetIndex=tabs.length-1;
    else if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        activateInputTab(event.currentTarget);
        return;
    } else return;
    event.preventDefault();
    activateInputTab(tabs[targetIndex]);
}

/* ═══════════════════════════════════════
   STEP NAV
═══════════════════════════════════════ */
function setActiveStep(s){
    [1,2,3].forEach(i=>{
        const nav=document.getElementById('nav'+i);
        nav.classList.remove('active','done');
        if(i<s) nav.classList.add('done');
        if(i===s) nav.classList.add('active');
        if(i===s) nav.setAttribute('aria-current','step');
        else nav.removeAttribute('aria-current');
    });
    [1,2].forEach(i=>{
        document.getElementById('conn'+i).classList.toggle('done',i<s);
    });
}
function showStep(n){
    [1,2,3].forEach(i=>{
        const section=document.getElementById('step'+i);
        const hidden=i!==n;
        setHidden(section,hidden);
    });
    setActiveStep(n);
    const heading=document.getElementById(`step${n}-title`);
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});
    heading.focus({preventScroll:true});
    announce(t('stepAnnouncement',n,3,heading.textContent));
}
function backToStep1(){ showStep(1); }
function backToStep2(){ showStep(2); }

function showPlayerSetupError(message){
    const error=document.getElementById('playerSetupError');
    error.textContent=message;
    setHidden(error,false);
    error.focus();
}
function clearPlayerSetupError(){ setHidden(document.getElementById('playerSetupError'),true); }

function goToStep2(){
    players=players.filter(player=>player.name.trim());
    renderImportedPlayers();
    if(players.length===0){
        showPlayerSetupError(t('playersEmpty'));
        return;
    }
    if(currentType==='sg'&&players.length>7){
        showPlayerSetupError(t('singleGroupLimit'));
        return;
    }
    clearPlayerSetupError();
    renderPlaceAssignment();
    showStep(2);
}

/* ═══════════════════════════════════════
   NICKNAME EDITOR
═══════════════════════════════════════ */
function toggleMappingEdit(){
    const el=document.getElementById('mappingEdit');
    const expanded=el.hidden;
    setHidden(el,!expanded);
    document.getElementById('mappingToggleButton').setAttribute('aria-expanded',String(expanded));
    if(expanded){
        renderMappingEdit();
        el.querySelector('.mapping-nick')?.focus();
    }
}
function createMappingRow(nick='', real=''){
    const id=++mappingRowCounter;
    const row=document.createElement('li');
    row.className='mapping-row';

    const nickLabel=document.createElement('label');
    nickLabel.className='visually-hidden mapping-nick-label';
    nickLabel.htmlFor=`mapping-nick-${id}`;
    const nickInput=document.createElement('input');
    nickInput.type='text';
    nickInput.id=`mapping-nick-${id}`;
    nickInput.value=nick;
    nickInput.placeholder=t('nicknamePlaceholderNick');
    nickInput.className='mapping-nick';

    const realLabel=document.createElement('label');
    realLabel.className='visually-hidden mapping-real-label';
    realLabel.htmlFor=`mapping-real-${id}`;
    const realInput=document.createElement('input');
    realInput.type='text';
    realInput.id=`mapping-real-${id}`;
    realInput.value=real;
    realInput.placeholder=t('nicknamePlaceholderReal');
    realInput.className='mapping-real';

    const removeButton=document.createElement('button');
    removeButton.type='button';
    removeButton.className='remove-btn';
    removeButton.textContent='×';
    removeButton.addEventListener('click',()=>removeMapping(removeButton));

    row.append(nickLabel,nickInput,realLabel,realInput,removeButton);
    return row;
}
function renderMappingEdit(){
    const list=document.getElementById('mappingList');
    list.replaceChildren(...Object.entries(nicknameMappings).map(([nick,real])=>createMappingRow(nick,real)));
    updateMappingAccessibility();
}
function addMapping(){
    const row=createMappingRow();
    document.getElementById('mappingList').appendChild(row);
    updateMappingAccessibility();
    row.querySelector('.mapping-nick').focus();
    announce(t('mappingAdded'));
}
function updateMappingAccessibility(){
    document.querySelectorAll('.mapping-row').forEach((row,index)=>{
        const position=index+1;
        row.querySelector('.mapping-nick-label').textContent=t('mappingNickLabel',position);
        row.querySelector('.mapping-real-label').textContent=t('mappingRealLabel',position);
        row.querySelector('.remove-btn').setAttribute('aria-label',t('removeMappingLabel',position));
    });
}
function removeMapping(btn){
    const rows=[...document.querySelectorAll('.mapping-row')];
    const index=rows.indexOf(btn.closest('.mapping-row'));
    btn.closest('.mapping-row').remove();
    updateMappingAccessibility();
    const remaining=[...document.querySelectorAll('.mapping-row')];
    (remaining[index]||remaining[index-1])?.querySelector('.mapping-nick')?.focus();
    if(!remaining.length) document.querySelector('.mapping-actions .btn')?.focus();
    announce(t('mappingRemoved'));
}
function saveMappings(){
    const newM={};
    document.querySelectorAll('.mapping-row').forEach(row=>{
        const nick=row.querySelector('.mapping-nick').value.trim();
        const real=row.querySelector('.mapping-real').value.trim();
        if(nick&&real) newM[nick]=real;
    });
    nicknameMappings=newM;
    const display=document.getElementById('mappingDisplay');
    display.replaceChildren(...Object.entries(nicknameMappings).map(([nick,real])=>{
        const tag=document.createElement('li');
        tag.className='mapping-tag';
        const strong=document.createElement('strong');
        strong.textContent=nick;
        tag.append(strong,` → ${real}`);
        return tag;
    }));
    const editor=document.getElementById('mappingEdit');
    setHidden(editor,true);
    const toggle=document.getElementById('mappingToggleButton');
    toggle.setAttribute('aria-expanded','false');
    toggle.focus();
    showSuccess(t('savedMsg'));
}

/* ═══════════════════════════════════════
   IMPORT PLAYERS
═══════════════════════════════════════ */
function importPlayers(){
    const raw=document.getElementById('importData').value;
    if(!raw.trim()){ showError(t('importEmpty')); return; }
    players=[];
    const lines=raw.split(/\r?\n/);
    for(let line of lines){
        line=line.trim();
        if(!line) continue;
        let parts;
        if(line.includes('\u0009')){
            parts=line.split('\u0009').map(p=>p.trim()).filter(p=>p);
        } else {
            parts=line.split(/\s{2,}/).map(p=>p.trim()).filter(p=>p);
            if(parts.length===1){
                const m=line.match(/^(.+?)\s+([\d,.\s]+)$/);
                if(m) parts=[m[1].trim(),m[2].trim()];
            }
        }
        if(parts.length>=1){
            const originalName=parts[0];
            const name=normalizeName(originalName);
            const rating=parts.length>=2?parseRating(parts[1]):0;
            players.push({name,originalName,rating,points:0,newRating:rating,placeValue:''});
        }
    }
    if(players.length===0){ showError(t('importFailed')); return; }
    showSuccess(t('importedCount',players.length));
    clearPlayerSetupError();
    renderImportedPlayers();
    if(currentType==='se') updateTournamentInfo();
    activateInputTab(document.getElementById('inputManualTab'));
}

function updatePlayerCount(){
    const badge=document.getElementById('playerCountBadge');
    if(!badge) return;
    badge.textContent=String(players.length);
    badge.setAttribute('aria-label',t('playerCountLabelText',players.length));
}

function renderImportedPlayers(){
    const list=document.getElementById('playersList');
    const rows=players.map((p,i)=>{
        const row=document.createElement('li');
        row.className='player-row-item';

        const name=document.createElement('input');
        name.type='text';
        name.className='player-name-input';
        name.value=p.name;
        name.placeholder=t('playerNamePlaceholder');
        name.setAttribute('aria-label',t('playerNameLabel',i+1));

        const rating=document.createElement('input');
        rating.type='text';
        rating.inputMode='decimal';
        rating.className='player-rating-input';
        rating.value=p.rating===0?'':String(p.rating).replace('.',',');
        rating.placeholder=t('playerRatingPlaceholder');
        rating.setAttribute('aria-label',t('playerRatingLabel',i+1));

        const removeButton=document.createElement('button');
        removeButton.type='button';
        removeButton.className='remove-btn';
        removeButton.textContent='×';
        removeButton.setAttribute('aria-label',t('removePlayerLabel',p.name));

        name.addEventListener('input',()=>{
            p.name=name.value;
            p.originalName=name.value;
            removeButton.setAttribute('aria-label',t('removePlayerLabel',p.name));
        });
        rating.addEventListener('input',()=>{
            p.rating=parseRating(rating.value);
            p.newRating=p.rating+p.points;
        });
        removeButton.addEventListener('click',()=>removePlayer(i));

        row.append(name,rating,removeButton);
        return row;
    });
    list.replaceChildren(...rows);
    updatePlayerCount();
}

function addManualPlayer(){
    players.push({name:'',originalName:'',rating:0,points:0,newRating:0,placeValue:''});
    renderImportedPlayers();
    clearPlayerSetupError();
    if(currentType==='se') updateTournamentInfo();
    document.querySelector('#playersList .player-row-item:last-child .player-name-input')?.focus();
    announce(t('playerAdded'));
}

function removePlayer(i){
    const removedName=players[i]?.name||'';
    players.splice(i,1);
    clearPlayerSetupError();
    renderImportedPlayers();
    if(currentType==='se') updateTournamentInfo();
    if(players.length===0){
        document.getElementById('addPlayerButton')?.focus();
    } else {
        const buttons=[...document.querySelectorAll('#playersList .remove-btn')];
        (buttons[i]||buttons[i-1])?.focus();
    }
    announce(t('playerRemoved',removedName));
}

function clearPlayers(){
    players=[];
    clearPlayerSetupError();
    renderImportedPlayers();
    if(currentType==='se') updateTournamentInfo();
    document.getElementById('addPlayerButton')?.focus();
    announce(t('playersCleared'));
}

function clearImport(){
    document.getElementById('importData').value='';
    setHidden(document.getElementById('importError'),true);
    setHidden(document.getElementById('importSuccess'),true);
    announce(t('importCleared'));
}

/* ═══════════════════════════════════════
   PLACE ASSIGNMENT
═══════════════════════════════════════ */
function renderPlaceAssignment(){
    // Build localized select options.
    const placeOptions=[['',t('placeSelectDefault')]];
    if(currentType==='de'){
        dePlaceKeys.forEach(k=>{
            placeOptions.push([k,t('de_'+k)]);
        });
    } else if(currentType==='se') {
        getSePlaceKeys().forEach(k=>placeOptions.push([k,t('se_'+k)]));
    } else {
        getSgPlaceKeys().forEach(k=>placeOptions.push([k,t('sg_'+k)]));
    }

    // Render rows
    const list=document.getElementById('placeList');
    const rows=players.map((p,i)=>{
        const row=document.createElement('li');
        row.className='place-row';

        const name=document.createElement('div');
        name.className='pname';
        name.id=`place-player-${i}`;
        name.dataset.label=t('colPlayer');
        name.textContent=p.name;

        const rating=document.createElement('div');
        rating.className='prating';
        rating.dataset.label=t('colRating');
        rating.append(createVisuallyHidden(`${t('colRating')}: `),fmt(p.rating));

        const selectWrap=document.createElement('div');
        selectWrap.dataset.label=t('colTournamentPlace');
        const selectLabel=document.createElement('label');
        selectLabel.className='visually-hidden';
        selectLabel.htmlFor=`place_${i}`;
        selectLabel.textContent=t('placeForPlayer',p.name);
        const select=document.createElement('select');
        select.id=`place_${i}`;
        select.className='place-select';
        placeOptions.forEach(([value,label])=>{
            const option=document.createElement('option');
            option.value=value;
            option.textContent=label;
            select.appendChild(option);
        });
        select.value=p.placeValue;
        select.addEventListener('change',()=>updatePlayerPoints(i));
        selectWrap.append(selectLabel,select);

        const points=document.createElement('div');
        points.className='ppoints';
        points.id=`points_${i}`;
        points.dataset.label=t('colPoints');
        points.append(createVisuallyHidden(`${t('colPoints')}: `),`+${fmt(p.points)}`);

        const newRating=document.createElement('div');
        newRating.className='pnew';
        newRating.id=`newRating_${i}`;
        newRating.dataset.label=t('colNewRating');
        newRating.append(createVisuallyHidden(`${t('colNewRating')}: `),fmt(p.newRating));

        row.append(name,rating,selectWrap,points,newRating);
        return row;
    });
    list.replaceChildren(...rows);
}

function createVisuallyHidden(text){
    const span=document.createElement('span');
    span.className='visually-hidden';
    span.textContent=text;
    return span;
}

function setLabeledValue(element,label,value){
    element.replaceChildren(createVisuallyHidden(`${label}: `),value);
}

function updatePlayerPoints(index){
    const placeValue=document.getElementById('place_'+index).value;
    const count=getCount();
    let points=0;
    if(placeValue){
        if(currentType==='de'){
            const table=dePointsTable[Math.min(count,12)]||dePointsTable[12];
            points=table[placeValue]||0;
        } else if(currentType==='se') {
            const table=seTournamentPoints[Math.min(count,12)]||seTournamentPoints[12];
            points=table[placeValue]||0;
        } else {
            const table=sgTournamentPoints[count]||sgTournamentPoints[7];
            points=table[placeValue]||0;
        }
    }
    players[index].points=points;
    players[index].newRating=players[index].rating+points;
    players[index].placeValue=placeValue;
    setLabeledValue(document.getElementById('points_'+index),t('colPoints'),'+'+fmt(points));
    setLabeledValue(document.getElementById('newRating_'+index),t('colNewRating'),fmt(players[index].newRating));
}

/* ═══════════════════════════════════════
   CALCULATE & RESULTS
═══════════════════════════════════════ */
function calculateRating(){
    players.forEach((_,i)=>updatePlayerPoints(i));
    players.sort((a,b)=>b.newRating-a.newRating);
    renderResults();
    showStep(3);
}

function getPlaceLabel(placeValue){
    if(!placeValue) return '—';
    if(currentType==='de') return t('de_'+placeValue)||placeValue;
    if(currentType==='se') return t('se_'+placeValue)||placeValue;
    return t('sg_'+placeValue)||placeValue;
}
function getBadgeClass(placeValue){
    if(!placeValue) return '';
    if(currentType==='de') return 'badge-'+placeValue;
    if(currentType==='sg') return 'badge-'+placeValue;
    const map={winner:'badge-1',finalist:'badge-2',semi:'badge-3',quarter:'badge-4',
               group3:'badge-56',group4:'badge-78',group5:'badge-912'};
    return map[placeValue]||'badge-78';
}

function renderResults(){
    const count=getCount();
    const coef=currentType==='de'
        ? (deCoefficients[Math.min(count,12)]??1.5)
        : currentType==='se' ? (seCoefficients[Math.min(count,12)]??1.5) : null;
    const typeLabel=currentType==='de'?t('typeDE'):currentType==='se'?t('typeSE'):t('typeSG');
    const summary=document.getElementById('tournamentSummary');
    summary.replaceChildren();
    const summaryEntries=[[t('summaryType'),typeLabel],[t('summaryPlayers'),getCountLabel()]];
    if(coef!==null) summaryEntries.push([t('summaryCoef'),`×${coef}`]);
    summaryEntries.forEach(([label,value])=>{
        const item=document.createElement('span');
        item.className='summary-item';
        const strong=document.createElement('strong');
        strong.className='summary-label';
        strong.textContent=`${label}:`;
        const valueElement=document.createElement('span');
        valueElement.className='summary-value';
        valueElement.textContent=value;
        item.append(strong,valueElement);
        summary.appendChild(item);
    });

    const tbody=document.getElementById('resultTable');
    const rows=players.map((p,i)=>{
        const change=p.newRating-p.rating;
        const nc=change>0?'r-pos':change<0?'r-neg':'';
        const nameClass=i===0?'r-gold':i===1?'r-silver':i===2?'r-bronze':'';
        const placeLabel=getPlaceLabel(p.placeValue);
        const badgeClass=getBadgeClass(p.placeValue);
        const tr=document.createElement('tr');
        const values=[
            [String(i+1),nameClass],
            [p.name,''],
            [fmt(p.rating),''],
            [placeLabel,'place'],
            [`+${fmt(p.points)}`,'r-pos'],
            [fmt(p.newRating),'r-new'],
            [`${change>0?'+':''}${fmt(change)}`,nc]
        ];
        const labels=['#',t('colPlayer'),t('colCurrentRating'),t('colPlace'),t('colEarned'),t('colNewRating'),t('colChange')];
        values.forEach(([value,className],cellIndex)=>{
            const cell=document.createElement(cellIndex===1?'th':'td');
            if(cellIndex===1) cell.scope='row';
            cell.dataset.label=labels[cellIndex];
            if(className && className!=='place') cell.className=className;
            if(cellIndex===1){
                const strong=document.createElement('strong');
                strong.textContent=value;
                cell.appendChild(strong);
            } else if(className==='place'){
                const badge=document.createElement('span');
                badge.className=`badge ${badgeClass}`;
                badge.textContent=value;
                cell.appendChild(badge);
            } else {
                cell.textContent=value;
            }
            tr.appendChild(cell);
        });
        return tr;
    });
    tbody.replaceChildren(...rows);
}

/* ═══════════════════════════════════════
   EXPORT
═══════════════════════════════════════ */
function exportToCSV(){
    const delimiter=currentLang==='uk'?';':',';
    const csvRows=[getExportHeaders(),...getExportRows().map(row=>row.map(value=>typeof value==='number'?fmtExportNumber(value):value))];
    const csv='\uFEFF'+csvRows.map(row=>row.map(value=>escapeCsvCell(value,delimiter)).join(delimiter)).join('\r\n');
    downloadBlob(new Blob([csv],{type:'text/csv;charset=utf-8;'}),'csv');
}

function getExportHeaders(){
    return ['#',t('colPlayer'),t('colCurrentRating'),t('colPlace'),t('colEarned'),t('colNewRating'),t('colChange')];
}

function getExportRows(){
    return players.map((p,i)=>[
        i+1,
        p.name,
        Number(p.rating),
        getPlaceLabel(p.placeValue),
        Number(p.points),
        Number(p.newRating),
        Number(p.newRating-p.rating)
    ]);
}

function fmtExportNumber(value){
    const fixed=fixedToThreeDecimals(value);
    return currentLang==='uk'?fixed.replace('.',','):fixed;
}

function escapeCsvCell(value,delimiter){
    const text=String(value??'');
    if(text.includes('"')||text.includes('\n')||text.includes('\r')||text.includes(delimiter)){
        return `"${text.replace(/"/g,'""')}"`;
    }
    return text;
}

function downloadBlob(blob,extension){
    const link=document.createElement('a');
    const objectUrl=URL.createObjectURL(blob);
    link.href=objectUrl;
    link.download='darts_rating_'+new Date().toISOString().slice(0,10)+'.'+extension;
    link.click();
    window.setTimeout(()=>URL.revokeObjectURL(objectUrl),0);
}

function escapeXml(value){
    return String(value??'')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&apos;');
}

function excelColumn(index){
    let name='';
    for(let value=index+1;value>0;value=Math.floor((value-1)/26)){
        name=String.fromCharCode(65+((value-1)%26))+name;
    }
    return name;
}

function createWorksheetXml(){
    const rows=[getExportHeaders(),...getExportRows()];
    const sheetRows=rows.map((row,rowIndex)=>{
        const cells=row.map((value,columnIndex)=>{
            const ref=`${excelColumn(columnIndex)}${rowIndex+1}`;
            if(rowIndex>0&&typeof value==='number'){
                const style=columnIndex===0?0:2;
                return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
            }
            const style=rowIndex===0?1:0;
            return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
        }).join('');
        return `<row r="${rowIndex+1}">${cells}</row>`;
    }).join('');
    const lastRow=Math.max(rows.length,1);
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:G${lastRow}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="18"/><cols><col min="1" max="1" width="6" customWidth="1"/><col min="2" max="2" width="28" customWidth="1"/><col min="3" max="3" width="13" customWidth="1"/><col min="4" max="4" width="25" customWidth="1"/><col min="5" max="7" width="16" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:G${lastRow}"/></worksheet>`;
}

function createExcelFiles(){
    const sheetName=escapeXml(t('excelSheetName'));
    return {
        '[Content_Types].xml':`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
        '_rels/.rels':`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
        'xl/workbook.xml':`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${sheetName}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
        'xl/_rels/workbook.xml.rels':`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
        'xl/styles.xml':`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="0.00#"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF2368B6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
        'xl/worksheets/sheet1.xml':createWorksheetXml()
    };
}

let crcTable;
function getCrcTable(){
    if(crcTable) return crcTable;
    crcTable=Array.from({length:256},(_,index)=>{
        let value=index;
        for(let bit=0;bit<8;bit++) value=(value&1)?(0xedb88320^(value>>>1)):(value>>>1);
        return value>>>0;
    });
    return crcTable;
}

function crc32(bytes){
    const table=getCrcTable();
    let crc=0xffffffff;
    for(const byte of bytes) crc=table[(crc^byte)&0xff]^(crc>>>8);
    return (crc^0xffffffff)>>>0;
}

function pushUint16(target,value){ target.push(value&0xff,(value>>>8)&0xff); }
function pushUint32(target,value){
    target.push(value&0xff,(value>>>8)&0xff,(value>>>16)&0xff,(value>>>24)&0xff);
}

function createZip(files){
    const encoder=new TextEncoder();
    const local=[];
    const central=[];
    let offset=0;
    const now=new Date();
    const dosTime=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1);
    const dosDate=((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate();

    Object.entries(files).forEach(([name,content])=>{
        const nameBytes=encoder.encode(name);
        const dataBytes=encoder.encode(content);
        const crc=crc32(dataBytes);
        const localHeader=[];
        pushUint32(localHeader,0x04034b50); pushUint16(localHeader,20); pushUint16(localHeader,0x0800);
        pushUint16(localHeader,0); pushUint16(localHeader,dosTime); pushUint16(localHeader,dosDate);
        pushUint32(localHeader,crc); pushUint32(localHeader,dataBytes.length); pushUint32(localHeader,dataBytes.length);
        pushUint16(localHeader,nameBytes.length); pushUint16(localHeader,0);
        local.push(new Uint8Array(localHeader),nameBytes,dataBytes);

        const centralHeader=[];
        pushUint32(centralHeader,0x02014b50); pushUint16(centralHeader,20); pushUint16(centralHeader,20);
        pushUint16(centralHeader,0x0800); pushUint16(centralHeader,0); pushUint16(centralHeader,dosTime); pushUint16(centralHeader,dosDate);
        pushUint32(centralHeader,crc); pushUint32(centralHeader,dataBytes.length); pushUint32(centralHeader,dataBytes.length);
        pushUint16(centralHeader,nameBytes.length); pushUint16(centralHeader,0); pushUint16(centralHeader,0);
        pushUint16(centralHeader,0); pushUint16(centralHeader,0); pushUint32(centralHeader,0); pushUint32(centralHeader,offset);
        central.push(new Uint8Array(centralHeader),nameBytes);
        offset+=localHeader.length+nameBytes.length+dataBytes.length;
    });

    const centralSize=central.reduce((sum,part)=>sum+part.length,0);
    const entryCount=Object.keys(files).length;
    const end=[];
    pushUint32(end,0x06054b50); pushUint16(end,0); pushUint16(end,0);
    pushUint16(end,entryCount); pushUint16(end,entryCount);
    pushUint32(end,centralSize); pushUint32(end,offset); pushUint16(end,0);
    return new Blob([...local,...central,new Uint8Array(end)],{
        type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
}

function exportToExcel(){
    downloadBlob(createZip(createExcelFiles()),'xlsx');
}
function copyToClipboard(){
    let text=t('csvTitle')+'\n========================\n\n';
    players.forEach((p,i)=>{ text+=`${i+1}. ${p.name}: ${fmt(p.newRating)} (+${fmt(p.points)})\n`; });
    navigator.clipboard.writeText(text).then(()=>{
        showCopyStatus();
    }).catch(()=>{
        const ta=document.createElement('textarea');
        ta.value=text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        showCopyStatus();
    });
}

function showCopyStatus(){
    const status=document.getElementById('copyAlert');
    setHidden(status,false);
    window.setTimeout(()=>setHidden(status,true),2000);
}

/* ═══════════════════════════════════════
   RESET
═══════════════════════════════════════ */
function resetAll(){
    players=[];
    if(currentType==='se') updateTournamentInfo();
    document.getElementById('importData').value='';
    renderImportedPlayers();
    activateInputTab(document.getElementById('inputManualTab'),{focus:false});
    setHidden(document.getElementById('importError'),true);
    setHidden(document.getElementById('importSuccess'),true);
    clearPlayerSetupError();
    setHidden(document.getElementById('copyAlert'),true);
    showStep(1);
}

function bindApp(){
    document.getElementById('rating-form').addEventListener('submit',event=>event.preventDefault());
    document.getElementById('btnUA').addEventListener('click',()=>setLang('uk'));
    document.getElementById('btnEN').addEventListener('click',()=>setLang('en'));
    document.getElementById('typeDE').addEventListener('click',()=>selectType('de'));
    document.getElementById('typeSE')?.addEventListener('click',()=>selectType('se'));
    document.getElementById('typeSG')?.addEventListener('click',()=>selectType('sg'));
    document.getElementById('playerCountDE').addEventListener('change',updateTournamentInfo);
    document.getElementById('playerCountSE')?.addEventListener('change',updateTournamentInfo);
    document.getElementById('playerCountSG')?.addEventListener('change',updateTournamentInfo);
    document.getElementById('groupCount')?.addEventListener('change',updateTournamentInfo);
    document.querySelectorAll('[data-input-tab]').forEach(tab=>{
        tab.addEventListener('click',()=>activateInputTab(tab));
        tab.addEventListener('keydown',handleInputTabKeydown);
    });
    document.getElementById('mappingToggleButton')?.addEventListener('click',toggleMappingEdit);
    document.getElementById('addMappingButton')?.addEventListener('click',addMapping);
    document.getElementById('saveMappingsButton')?.addEventListener('click',saveMappings);
    document.getElementById('addPlayerButton').addEventListener('click',addManualPlayer);
    document.getElementById('clearPlayersButton').addEventListener('click',clearPlayers);
    document.getElementById('importPlayersButton').addEventListener('click',importPlayers);
    document.getElementById('clearImportButton').addEventListener('click',clearImport);
    document.getElementById('goToStep2Button').addEventListener('click',goToStep2);
    document.getElementById('calculateRatingButton').addEventListener('click',calculateRating);
    document.getElementById('backToStep1Button').addEventListener('click',backToStep1);
    document.getElementById('exportCsvButton').addEventListener('click',exportToCSV);
    document.getElementById('exportExcelButton').addEventListener('click',exportToExcel);
    document.getElementById('copyButton').addEventListener('click',copyToClipboard);
    document.getElementById('backToStep2Button').addEventListener('click',backToStep2);
    document.getElementById('resetButton').addEventListener('click',resetAll);

    setActiveStep(1);
    selectType(currentType);
    activateInputTab(document.getElementById('inputManualTab'),{focus:false});
    setLang(currentLang);
}

if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bindApp,{once:true});
} else {
    bindApp();
}
