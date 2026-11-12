/* ═══════════════════════════════════════
   GOOGLE SHEETS SYNC (via Apps Script web app)
   Loaded after app.js; uses its globals (players, t, i18n, ...).
═══════════════════════════════════════ */
(function(){
    // Optional: hardcode the deployed Apps Script URL here so every visitor gets it.
    const SHEETS_DEFAULT_URL='';
    const STORAGE_URL='dartsSheetsUrl';
    const STORAGE_TOKEN='dartsSheetsToken';
    const DATALIST_ID='sheetsPlayersDatalist';
    let sheetRatings=new Map();
    let sheetMeta={lastDate:'',savedDates:[],aliases:{}};
    let pendingAliases=[];

    Object.assign(i18n.uk,{
        sheetsTitle:'Google Таблиця',
        sheetsUrlLabel:'Адреса Apps Script (веб-застосунок)',
        sheetsTokenLabel:'Ключ для запису',
        sheetsHint:'Рейтинг гравця береться з тоталу (колонка C). Під час збереження в таблицю додається нова колонка з датою турніру та очками гравців.',
        btnSheetsLoad:'Підставити рейтинги з таблиці',
        btnSheetsSave:'Зберегти в Google Таблицю',
        sheetsDateLabel:'Дата турніру',
        sheetsLoading:'Завантаження…',
        sheetsSaving:'Збереження…',
        sheetsNoUrl:'Вкажіть адресу Apps Script у блоці «Google Таблиця» на першому кроці.',
        sheetsNoToken:'Вкажіть ключ для запису в блоці «Google Таблиця» на першому кроці.',
        sheetsLoaded:(total,matched,missing)=>`З таблиці завантажено ${total} гравців. Рейтинг підставлено для ${matched}.`+(missing.length?` Не знайдено в таблиці: ${missing.join(', ')}.`:''),
        sheetsSaved:(saved,column,added)=>`Збережено ${saved} результатів у колонку ${column}.`+(added?` Нових гравців додано: ${added}.`:''),
        sheetsTotalsWarning:names=>`Увага: тотал не змінився для: ${names.join(', ')}. Перевірте формулу в колонці C.`,
        sheetsDuplicate:'Цей турнір уже збережено в таблиці.',
        sheetsDateTaken:'У таблиці вже є заповнена колонка з цією датою. Перевірте дату турніру.',
        sheetsBadToken:'Неправильний ключ для запису.',
        sheetsTokenNotConfigured:'У скрипті не задано WRITE_TOKEN (Script properties).',
        sheetsNetworkError:'Не вдалося звʼязатися з таблицею. Перевірте адресу та доступ «Anyone».',
        sheetsError:msg=>`Помилка таблиці: ${msg}`,
    });
    Object.assign(i18n.en,{
        sheetsTitle:'Google Sheet',
        sheetsUrlLabel:'Apps Script web app URL',
        sheetsTokenLabel:'Write key',
        sheetsHint:'Player rating is read from the total (column C). Saving adds a new column with the tournament date and each player’s points.',
        btnSheetsLoad:'Fill ratings from sheet',
        btnSheetsSave:'Save to Google Sheet',
        sheetsDateLabel:'Tournament date',
        sheetsLoading:'Loading…',
        sheetsSaving:'Saving…',
        sheetsNoUrl:'Enter the Apps Script URL in the “Google Sheet” block on step 1.',
        sheetsNoToken:'Enter the write key in the “Google Sheet” block on step 1.',
        sheetsLoaded:(total,matched,missing)=>`Loaded ${total} players from the sheet. Ratings filled for ${matched}.`+(missing.length?` Not found in sheet: ${missing.join(', ')}.`:''),
        sheetsSaved:(saved,column,added)=>`Saved ${saved} results to column ${column}.`+(added?` New players added: ${added}.`:''),
        sheetsTotalsWarning:names=>`Warning: the total did not change for: ${names.join(', ')}. Check the formula in column C.`,
        sheetsDuplicate:'This tournament is already saved in the sheet.',
        sheetsDateTaken:'The sheet already has a filled column for this date. Check the tournament date.',
        sheetsBadToken:'Wrong write key.',
        sheetsTokenNotConfigured:'WRITE_TOKEN is not set in the script (Script properties).',
        sheetsNetworkError:'Could not reach the sheet. Check the URL and “Anyone” access.',
        sheetsError:msg=>`Sheet error: ${msg}`,
    });

    function storageGet(key){ try{ return localStorage.getItem(key)||''; }catch(e){ return ''; } }
    function storageSet(key,value){ try{ localStorage.setItem(key,value); }catch(e){} }
    function nameKey(name){ return String(name||'').trim().toLowerCase().replace(/\s+/g,' '); }
    function getUrl(){ return document.getElementById('sheetsUrl').value.trim(); }
    function getToken(){ return document.getElementById('sheetsToken').value.trim(); }

    function setStatus(id,kind,message){
        const el=document.getElementById(id);
        el.className='alert '+(kind==='error'?'alert-error':kind==='success'?'alert-success':'alert-info');
        el.textContent=message;
        setHidden(el,!message);
    }

    async function fetchRatings(){
        const response=await fetch(getUrl(),{method:'GET',redirect:'follow'});
        const data=await response.json();
        if(!data.ok) throw new Error(data.error||'unknown');
        sheetRatings=new Map(data.players.map(p=>[nameKey(p.name),{name:p.name,rating:Number(p.rating)||0}]));
        const aliases={};
        (data.aliases||[]).forEach(a=>{ if(a.alias&&a.name) aliases[n01Core.normalize(a.alias)]=a.name; });
        sheetMeta={lastDate:data.lastDate||'',savedDates:data.savedDates||[],aliases};
        renderDatalist();
        return data.players.length;
    }

    function renderDatalist(){
        const list=document.getElementById(DATALIST_ID);
        list.replaceChildren(...[...sheetRatings.values()].map(p=>{
            const option=document.createElement('option');
            option.value=p.name;
            return option;
        }));
    }

    async function loadRatings(){
        if(!getUrl()){ setStatus('sheetsLoadStatus','error',t('sheetsNoUrl')); return; }
        const button=document.getElementById('sheetsLoadButton');
        button.disabled=true;
        setStatus('sheetsLoadStatus','info',t('sheetsLoading'));
        try{
            const total=await fetchRatings();
            let matched=0;
            const missing=[];
            players.forEach(p=>{
                const found=sheetRatings.get(nameKey(p.name));
                if(found){
                    p.name=found.name;
                    p.originalName=found.name;
                    p.rating=found.rating;
                    p.newRating=p.rating+p.points;
                    matched++;
                } else if(p.name.trim()) {
                    missing.push(p.name.trim());
                }
            });
            renderImportedPlayers();
            setStatus('sheetsLoadStatus','success',t('sheetsLoaded',total,matched,missing));
        }catch(error){
            setStatus('sheetsLoadStatus','error',describeError(error));
        }finally{
            button.disabled=false;
        }
    }

    function describeError(error){
        const code=error&&error.message;
        if(code==='duplicate') return t('sheetsDuplicate');
        if(code==='date_column_has_data') return t('sheetsDateTaken');
        if(code==='bad_token') return t('sheetsBadToken');
        if(code==='token_not_configured') return t('sheetsTokenNotConfigured');
        if(error instanceof TypeError || error instanceof SyntaxError) return t('sheetsNetworkError');
        return t('sheetsError',code||String(error));
    }

    function hashString(text){
        let hash=0x811c9dc5;
        for(let i=0;i<text.length;i++){
            hash^=text.charCodeAt(i);
            hash=Math.imul(hash,0x01000193);
        }
        return (hash>>>0).toString(36);
    }

    function buildPayload(){
        const count=getCount();
        const coefficient=currentType==='de'
            ? (deCoefficients[Math.min(count,12)]??1.5)
            : currentType==='se' ? (seCoefficients[Math.min(count,12)]??1.5) : null;
        const date=document.getElementById('sheetsDate').value||new Date().toISOString().slice(0,10);
        const results=players.map(p=>({
            name:p.name.trim(),
            rating:Number(p.rating),
            place:getPlaceLabel(p.placeValue),
            points:Number(p.points),
            newRating:Number(p.newRating)
        }));
        const fingerprint=JSON.stringify([date,currentType,count,results.map(r=>[nameKey(r.name),r.place,r.points])]);
        return {
            token:getToken(),
            tournament:{
                id:date+'-'+hashString(fingerprint),
                date,
                type:currentType,
                typeLabel:currentType==='de'?t('typeDE'):currentType==='se'?t('typeSE'):t('typeSG'),
                playerCount:players.length,
                coefficient
            },
            results,
            aliases:pendingAliases.filter(a=>players.some(p=>p.name.trim()===a.name))
        };
    }

    async function saveResults(){
        if(!getUrl()){ setStatus('sheetsSaveStatus','error',t('sheetsNoUrl')); return; }
        if(!getToken()){ setStatus('sheetsSaveStatus','error',t('sheetsNoToken')); return; }
        const button=document.getElementById('sheetsSaveButton');
        button.disabled=true;
        setStatus('sheetsSaveStatus','info',t('sheetsSaving'));
        try{
            // text/plain keeps this a "simple" CORS request, which Apps Script accepts.
            const response=await fetch(getUrl(),{
                method:'POST',
                redirect:'follow',
                headers:{'Content-Type':'text/plain;charset=utf-8'},
                body:JSON.stringify(buildPayload())
            });
            const data=await response.json();
            if(!data.ok) throw new Error(data.error||'unknown');
            pendingAliases=[];
            const warning=(data.totalsNotUpdated||[]).length?' '+t('sheetsTotalsWarning',data.totalsNotUpdated):'';
            setStatus('sheetsSaveStatus',warning?'error':'success',t('sheetsSaved',data.saved,data.column,data.added)+warning);
        }catch(error){
            setStatus('sheetsSaveStatus','error',describeError(error));
        }finally{
            button.disabled=false;
        }
    }

    // Autocomplete names and fill the rating when a known player is typed.
    function enhancePlayerInputs(){
        document.querySelectorAll('#playersList .player-name-input').forEach(input=>input.setAttribute('list',DATALIST_ID));
    }
    function handleNameChange(event){
        const input=event.target;
        if(!input.classList.contains('player-name-input')) return;
        const found=sheetRatings.get(nameKey(input.value));
        const rating=input.closest('.player-row-item')?.querySelector('.player-rating-input');
        if(!found||!rating||rating.value.trim()) return;
        rating.value=String(found.rating).replace('.',',');
        rating.dispatchEvent(new Event('input',{bubbles:true}));
    }

    window.dartsSheets={
        fetchRatings,
        ratings:()=>sheetRatings,
        aliases:()=>sheetMeta.aliases,
        lastDate:()=>sheetMeta.lastDate,
        savedDates:()=>sheetMeta.savedDates,
        setPendingAliases:list=>{ pendingAliases=list; },
        setDate:date=>{ document.getElementById('sheetsDate').value=date; }
    };

    function init(){
        const urlInput=document.getElementById('sheetsUrl');
        const tokenInput=document.getElementById('sheetsToken');
        urlInput.value=storageGet(STORAGE_URL)||SHEETS_DEFAULT_URL;
        tokenInput.value=storageGet(STORAGE_TOKEN);
        urlInput.addEventListener('change',()=>storageSet(STORAGE_URL,urlInput.value.trim()));
        tokenInput.addEventListener('change',()=>storageSet(STORAGE_TOKEN,tokenInput.value.trim()));
        document.getElementById('sheetsDate').value=new Date().toISOString().slice(0,10);
        document.getElementById('sheetsLoadButton').addEventListener('click',loadRatings);
        document.getElementById('sheetsSaveButton').addEventListener('click',saveResults);
        const list=document.getElementById('playersList');
        list.addEventListener('change',handleNameChange);
        new MutationObserver(enhancePlayerInputs).observe(list,{childList:true});
        enhancePlayerInputs();
        setLang(currentLang);
    }

    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded',init,{once:true});
    } else {
        init();
    }
})();
