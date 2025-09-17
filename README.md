

# Dashboard IoT - Monitoramento de Temperatura e Umidade

## Descrição
Este projeto é um **dashboard IoT** que consome dados do **Thingspeak**, canal fornecido pelo professor da disciplina de Arquitetura e Protocolos IoT.  
O dashboard exibe dados de **temperatura** e **umidade** em tempo real, apresentando gráficos, indicadores, estatísticas e uma versão **responsiva para mobile**.

---

## Funcionalidades

- Leitura de dados via API HTTP do Thingspeak.
- Exibição da **última temperatura e umidade**, com tendência (🔼 ou 🔽).
- Estatísticas: **mínimo, máximo e média**.
- Gráficos interativos com **Chart.js**:
  - Temperatura (linha)
  - Umidade (barra)
- Lista de **últimos registros**, adaptada para mobile (cards) e desktop (tabela).
- Tema claro/escuro com toggle.
- Responsivo: layout desktop e **mobile dashboard**.

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js para gráficos interativos
- API HTTP do Thingspeak

---

## Estrutura do Projeto

```

dashboard-iot/
├── index.html        # Página principal do dashboard
├── style.css         # Estilos do dashboard
├── script.js         # Lógica de consumo da API e atualização de gráficos
├── README.md         # Este arquivo

```

---

## API do Thingspeak

- Canal do professor com **dois campos**:
  - **field1:** Umidade (%)
  - **field2:** Temperatura (°C)
- URL de exemplo:
```

[https://api.thingspeak.com/channels/](https://api.thingspeak.com/channels/)\<CHANNEL\_ID>/feeds.json?api\_key=\<API\_KEY>\&results=10

````
- `CHANNEL_ID` e `API_KEY` fornecidos pelo professor.

---

## Como Executar

1. Clone este repositório:
```bash
git clone https://github.com/MorganaSouza/Meu-Dashboard.git
````

2. Abra `index.html` no navegador.

   * O dashboard carregará os **últimos 10 registros** automaticamente.
   * O gráfico e os indicadores se atualizam a cada **15 segundos**.

3. CLique no link do site do Dashboard para visualizar:
```bash
  https://meu-dashboardiot.netlify.app/
  ````


## Observações

* A **API Key** utilizada é pública, fornecida pelo professor, apenas para **leitura de dados**.
* Não é necessário backend; todo o processamento é feito no frontend.
* O dashboard é totalmente **responsivo**, com layout adaptado para dispositivos móveis.

---

## Autor

* Morgana Souza - Aluno da disciplina Arquitetura e Protocolos IoT

