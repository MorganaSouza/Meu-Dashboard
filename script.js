const CHANNEL_ID = "2943258";
const API_KEY = "G3BDQS6I5PRGFEWR";
const URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=10`;

let grafico;

// Cores do gráfico dependendo do tema
function getChartColors() {
    const darkMode = document.body.classList.contains("dark");
    return darkMode
        ? {
            tempBorder: "#f97316",
            tempBg: "rgba(249,115,22,0.6)",
            umidBorder: "#06b6d4",
            umidBg: "rgba(6,182,212,0.6)",
            text: "#f9fafb",
            tooltipBg: "#1e293b"
        }
        : {
            tempBorder: "red",
            tempBg: "rgba(255,0,0,0.2)",
            umidBorder: "blue",
            umidBg: "rgba(0,0,255,0.2)",
            text: "#111",
            tooltipBg: "#fff"
        };
}

async function carregarDados() {
    try {
        document.getElementById("loader").style.display = "block";
        const resp = await fetch(URL);
        const data = await resp.json();
        const feeds = data.feeds;

        // Ajuste de valores reais
        const umidade = feeds.map(f => {
            let val = parseFloat(f.field1);
            if (val > 100) val = val / 10; // normaliza se estiver acima de 100%
            return val;
        });

        const temperatura = feeds.map(f => {
            let val = parseFloat(f.field2);
            if (val > 60) val = val / 10; // normaliza se estiver acima de 60°C
            return val;
        });

        const tempo = feeds.map(f => new Date(f.created_at).toLocaleTimeString("pt-BR", {
            hour:"2-digit", minute:"2-digit", second:"2-digit"
        }));

        const ultimaTemp = temperatura[temperatura.length-1];
        const penultimaTemp = temperatura[temperatura.length-2] ?? ultimaTemp;
        const ultimaUmid = umidade[umidade.length-1];
        const penultimaUmid = umidade[umidade.length-2] ?? ultimaUmid;

        // Atualiza indicadores
        document.getElementById("tempAtual").innerText = `${ultimaTemp.toFixed(1)} °C`;
        document.getElementById("umidAtual").innerText = `${ultimaUmid.toFixed(1)} %`;

        // Atualiza tendência com setas CSS
        document.getElementById("trendTemp").className = "trend " + (ultimaTemp >= penultimaTemp ? "up" : "down");
        document.getElementById("trendUmid").className = "trend " + (ultimaUmid >= penultimaUmid ? "up" : "down");

        // Alertas de cor nos cards
        const cardTemp = document.getElementById("cardTemp");
        const cardUmid = document.getElementById("cardUmid");
        cardTemp.style.background = ultimaTemp > 30 ? "#fca5a5" : "";
        cardUmid.style.background = ultimaUmid < 30 ? "#bae6fd" : "";

        // Estatísticas
        document.getElementById("tempMin").innerText = Math.min(...temperatura).toFixed(1);
        document.getElementById("tempMax").innerText = Math.max(...temperatura).toFixed(1);
        document.getElementById("tempMed").innerText = (temperatura.reduce((a,b)=>a+b)/temperatura.length).toFixed(1);
        document.getElementById("umidMin").innerText = Math.min(...umidade).toFixed(1);
        document.getElementById("umidMax").innerText = Math.max(...umidade).toFixed(1);
        document.getElementById("umidMed").innerText = (umidade.reduce((a,b)=>a+b)/umidade.length).toFixed(1);

        // Tabela e lista mobile
        const tbody = document.getElementById("tabelaDados");
        const lista = document.getElementById("listaDados");
        tbody.innerHTML = "";
        lista.innerHTML = "";

        for (let i = feeds.length-1; i >= 0; i--) {
            tbody.innerHTML += `<tr>
                <td>${new Date(feeds[i].created_at).toLocaleString("pt-BR")}</td>
                <td>${temperatura[i].toFixed(1)}</td>
                <td>${umidade[i].toFixed(1)}</td>
            </tr>`;

            lista.innerHTML += `<div class="item">
                <p><strong>Data/Hora:</strong> ${new Date(feeds[i].created_at).toLocaleString("pt-BR")}</p>
                <p><strong>Temperatura:</strong> ${temperatura[i].toFixed(1)} °C</p>
                <p><strong>Umidade:</strong> ${umidade[i].toFixed(1)} %</p>
            </div>`;
        }

        // Gráfico
        const colors = getChartColors();
        const ctx = document.getElementById("grafico").getContext("2d");
        if (grafico) grafico.destroy();
        grafico = new Chart(ctx, {
            data: {
                labels: tempo,
                datasets: [
                    { type:"line", label:"Temperatura (°C)", data:temperatura, borderColor:colors.tempBorder, backgroundColor:colors.tempBg, yAxisID:"y1", tension:0.4, fill:true },
                    { type:"bar", label:"Umidade (%)", data:umidade, backgroundColor:colors.umidBg, borderColor:colors.umidBorder, yAxisID:"y2" }
                ]
            },
            options: {
                responsive:true,
                maintainAspectRatio:false,
                plugins: {
                    legend: { labels:{ color:colors.text } },
                    tooltip:{ backgroundColor:colors.tooltipBg, titleColor:colors.text, bodyColor:colors.text },
                    title:{ display:true, text:"Temperatura e Umidade em Tempo Real", color:colors.text }
                },
                scales: {
                    y1: { ticks:{ color:colors.text }, title:{ display:true, text:"Temperatura (°C)", color:colors.text } },
                    y2: { ticks:{ color:colors.text }, title:{ display:true, text:"Umidade (%)", color:colors.text }, grid:{ drawOnChartArea:false } },
                    x: { ticks:{ color:colors.text } }
                }
            }
        });

        document.getElementById("loader").style.display = "none";

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        document.getElementById("loader").style.display = "none";
    }
}

// Atualiza a cada 15s
carregarDados();
setInterval(carregarDados, 15000);

// Toggle tema
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    const btn = document.getElementById("toggleTheme");
    btn.innerText = document.body.classList.contains("dark") ? "☀️ Modo Claro" : "🌙 Modo Escuro";

    carregarDados(); // redesenha gráfico com cores atualizadas
});
