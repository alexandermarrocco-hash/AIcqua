interface WaterStats {
    totalMl: number;
    textMl?: number;
    imageMl?: number;
    sessionCount: number;
    lastUpdate: number;
}

function refreshDashboard(stats: WaterStats) {
    const totalMl = stats.totalMl || 0;
    const sessionCount = stats.sessionCount || 0;
    const totalLiters = totalMl / 1000;
    const avgMl = sessionCount > 0 ? (totalMl / sessionCount) : 0;

    // Aggiornamento Valore Totale
    const valueElem = document.getElementById('dash-total-water')!;
    const unitElem = document.querySelector('.hero-stat-card.primary .unit')!;
    
    if (totalLiters < 0.1) {
        valueElem.textContent = totalMl.toFixed(1);
        unitElem.textContent = 'mL';
    } else {
        valueElem.textContent = totalLiters.toFixed(3);
        unitElem.textContent = 'L';
    }

    // Aggiornamento Statistiche Aggiuntive
    document.getElementById('dash-session-count')!.textContent = sessionCount.toString();
    document.getElementById('dash-avg-water')!.textContent = avgMl.toFixed(1);

    // Aggiornamento Grafico Temporale
    const currentChartBar = document.getElementById('dash-chart-current')!;
    const currentChartVal = document.getElementById('dash-chart-val')!;
    
    let chartPercent = (totalLiters / 5.0) * 100; // Impostiamo fittiziamente il max del grafico a 5.0 L
    if (chartPercent > 100) chartPercent = 100;
    if (chartPercent < 2 && totalLiters > 0) chartPercent = 2; // Spessore visivo minimo
    currentChartBar.style.height = `${chartPercent}%`;
    currentChartVal.textContent = `${totalLiters.toFixed(2)} L`;

    // Aggiornamento Statistiche Equivalenti
    // Rimuoviamo gli zeri decimali in eccesso quando il valore è molto basso o intero
    document.getElementById('dash-bottles')!.textContent = parseFloat((totalMl / 500).toFixed(2)).toString();
    document.getElementById('dash-showers')!.textContent = parseFloat((totalLiters / 50).toFixed(4)).toString();
    document.getElementById('dash-tubs')!.textContent = parseFloat((totalLiters / 150).toFixed(5)).toString();

    // Sorgenti Reali
    const textMl = stats.textMl || 0;
    const imageMl = stats.imageMl || 0;
    let textPercent = 100;
    let imagePercent = 0;

    if (totalMl > 0) {
        textPercent = (textMl / (textMl + imageMl)) * 100;
        imagePercent = (imageMl / (textMl + imageMl)) * 100;
        if (isNaN(textPercent)) { textPercent = 100; imagePercent = 0; }
    }

    document.querySelector('.text-bar')!.setAttribute('style', `width: ${textPercent}%;`);
    document.querySelector('.image-bar')!.setAttribute('style', `width: ${imagePercent}%;`);

    // Aggiornamento Obiettivo Reparto
    const avgLiters = avgMl / 1000;
    
    document.getElementById('dash-my-avg')!.textContent = `${avgLiters.toFixed(3)} L/msg`;
    const leaderboardElem = document.getElementById('dash-leaderboard')!;
    if (sessionCount === 0) {
        leaderboardElem.innerHTML = `Usa l'IA per calcolare la tua posizione! ⏳`;
    } else if (avgLiters <= 0.050) {
        leaderboardElem.innerHTML = `Sei al <strong>1° posto</strong> nel tuo reparto! 🎉`;
    } else if (avgLiters <= 0.100) {
        leaderboardElem.innerHTML = `Sei al <strong>3° posto</strong> su 12 nel tuo reparto! 👍`;
    } else {
        leaderboardElem.innerHTML = `Il tuo consumo è sopra la media. Usa i consigli! 💡`;
    }

    // Aggiornamento Consigli Personalizzati
    const tipsList = document.getElementById('personalized-tips')!;
    tipsList.innerHTML = '';

    // Analisi AI Simulata sul ruolo e sui dati
    tipsList.innerHTML += `<li style="list-style: none; margin-bottom: 15px; color: #0284c7; font-weight: 500;">🤖 <em>Analisi AI attivata sui tuoi pattern di utilizzo aziendale...</em></li>`;

    if (sessionCount === 0) {
        tipsList.innerHTML += `<li><strong>Inizia la tua sessione:</strong> Usa l'IA per le tue attività! Una volta generati i primi prompt, analizzerò come interagisci (es. durante il debug ABAP) per suggerirti come risparmiare token e acqua.</li>`;
    } else {
        if (avgMl > 200 || totalLiters > 5) {
            tipsList.innerHTML += `<li><strong>Ottimizza i log SAP:</strong> Il tuo consumo idrico per interazione è alto (${avgMl.toFixed(0)} ml). Come <em>SAP expert</em>, potresti incollare interi dump di errore (es. transazione ST22). Estrai solo il call stack essenziale per dimezzare l'acqua consumata!</li>`;
        } else {
            tipsList.innerHTML += `<li><strong>Efficienza eccellente:</strong> Il consumo medio di ${avgMl.toFixed(0)} ml per messaggio indica che stai contestualizzando le query SAP in modo estremamente mirato, senza sovraccaricare il contesto.</li>`;
        }

        if (imagePercent > 15) {
            tipsList.innerHTML += `<li><strong>Architetture e Diagrammi:</strong> Vedo un uso di immagini del ${imagePercent.toFixed(0)}%. Per mappare architetture SAP o flussi di processo, chiedi a ChatGPT/Claude di generare codice <em>Mermaid.js</em> anziché immagini: consuma 50 volte meno acqua e puoi modificarlo!</li>`;
        }
        
        tipsList.innerHTML += `<li><strong>Zero-Shot Context:</strong> Nelle tue ${sessionCount} interazioni recenti, ricorda che indicare a priori il modulo (es. MM, SD, FI) e il sistema (ECC o S/4HANA) evita all'IA di fare domande di chiarimento, risparmiando turni extra.</li>`;

        if (textPercent > 80) {
            tipsList.innerHTML += `<li><strong>Refactoring Code ABAP:</strong> Essendo il tuo uso prevalentemente testuale, quando fai refactoring di codice, chiedi all'IA di restituirti <em>solo le righe modificate</em> o i metodi corretti, invece di farle riscrivere l'intero blocco di codice. Meno token = meno acqua!</li>`;
        }

        if (totalLiters > 2) {
            tipsList.innerHTML += `<li><strong>Gestione Cronologia:</strong> Il tuo consumo sta salendo. Se un task SAP complesso (es. configurazione IDoc) non si risolve dopo 4-5 messaggi, prova ad aprire una "Nuova Chat" con una sintesi. L'IA non dovrà rileggere l'intera conversazione (sprecando acqua) ad ogni nuovo prompt.</li>`;
        }

        if (sessionCount >= 5) {
            tipsList.innerHTML += `<li><strong>Formato di Output:</strong> Aggiungi spesso ai tuoi prompt la dicitura <em>"Rispondi in modo sintetico a punti"</em> per domande teoriche (es. customizzazione S/4HANA), bloccando verbosità inutili e dispendiose.</li>`;
        }
    }
}

chrome.storage.local.get(['waterStats'], (result) => {
    refreshDashboard(result.waterStats || { totalMl: 0, sessionCount: 0, lastUpdate: 0 });
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.waterStats) refreshDashboard(changes.waterStats.newValue);
});