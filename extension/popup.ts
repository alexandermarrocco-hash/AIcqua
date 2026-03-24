interface WaterStats {
    totalMl: number;
    sessionCount: number;
    lastUpdate: number;
}

function updateUI(stats: WaterStats) {
    const totalMl = stats.totalMl;
    const totalLiters = totalMl / 1000;

    // Update main stat: Switch to mL if low, else show Liters with 3 decimals
    const valueElem = document.getElementById('total-water')!;
    const unitElem = document.querySelector('.unit')!;

    if (totalLiters < 0.1) {
        valueElem.textContent = totalMl.toFixed(1);
        unitElem.textContent = 'mL';
    } else {
        valueElem.textContent = totalLiters.toFixed(3);
        unitElem.textContent = 'Litri';
    }

    // Dati Extra: Interazioni e Media
    document.getElementById('session-count')!.textContent = stats.sessionCount.toString();
    const avgMl = stats.sessionCount > 0 ? (totalMl / stats.sessionCount) : 0;
    document.getElementById('avg-water')!.textContent = avgMl.toFixed(1);

    // Equivalences
    document.getElementById('eq-bottles')!.textContent = (totalMl / 500).toFixed(2);
    document.getElementById('eq-showers')!.textContent = (totalLiters / 50).toFixed(4);

    // Valutazione Efficienza Prompt
    const efficiencyStatus = document.getElementById('efficiency-status')!;
    const efficiencyFill = document.getElementById('efficiency-fill')!;
    
    // Imposta la barra visiva (scalata su un massimo di 500ml per calcolo grafico)
    let effPercent = (avgMl / 500) * 100;
    if (effPercent > 100) effPercent = 100;
    efficiencyFill.style.width = `${effPercent}%`;

    if (avgMl === 0) {
        efficiencyStatus.textContent = "Efficienza: --";
        efficiencyFill.style.backgroundColor = "#e2e8f0";
    } else if (avgMl < 15) {
        efficiencyStatus.textContent = "Efficienza: Ottima 🌿";
        efficiencyStatus.style.color = "#166534";
        efficiencyFill.style.backgroundColor = "#22c55e"; // verde
    } else if (avgMl < 100) {
        efficiencyStatus.textContent = "Efficienza: Buona 💧";
        efficiencyStatus.style.color = "#0ea5e9";
        efficiencyFill.style.backgroundColor = "#3b82f6"; // blu
    } else if (avgMl < 250) {
        efficiencyStatus.textContent = "Efficienza: Media ⚠️";
        efficiencyStatus.style.color = "#ca8a04";
        efficiencyFill.style.backgroundColor = "#eab308"; // giallo
    } else {
        efficiencyStatus.textContent = "Efficienza: Bassa 🚨";
        efficiencyStatus.style.color = "#dc2626";
        efficiencyFill.style.backgroundColor = "#ef4444"; // rosso
    }

    // Last update
    if (stats.lastUpdate > 0) {
        const date = new Date(stats.lastUpdate);
        document.getElementById('last-update')!.textContent =
            `Ultimo aggiornamento: ${date.toLocaleTimeString()}`;
    }
}

// Load stats from storage
chrome.storage.local.get(['waterStats'], (result) => {
    const defaultStats: WaterStats = { totalMl: 0, sessionCount: 0, lastUpdate: 0 };
    const stats: WaterStats = result.waterStats || defaultStats;
    updateUI(stats);
});

// Listen for updates from content script
chrome.storage.onChanged.addListener((changes) => {
    if (changes.waterStats) {
        updateUI(changes.waterStats.newValue);
    }
});

// Apre la nuova tab con la Dashboard completa
document.addEventListener('DOMContentLoaded', () => {
    const dashboardBtn = document.getElementById('open-dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
        });
    }
});
