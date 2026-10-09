/**
 * ============================================================================
 * ORION BOT NEURAL ENGINE v5.2 - EDIÇÃO CONSOLE F12 100% IDÊNTICA AO NOSSO PAINEL
 * Totalmente Autônomo • Design Idêntico • Sem Erros de MT5 / Sem Servidor
 * ============================================================================
 */
(function() {
  'use strict';

  // Evita múltiplas instâncias
  if (window.__ORION_BOT_INSTANCE__) {
    try { window.__ORION_BOT_INSTANCE__.destroy(); } catch (e) {}
  }

  // Efeitos Sonoros via Web Audio API (100% local sem arquivos externos)
  var audioCtx = null;
  function getAudioCtx() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch(e) { return null; }
  }

  function tocarSinal(tipo) {
    try {
      var ctx = getAudioCtx();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      var now = ctx.currentTime;
      if (tipo === 'call') {
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (tipo === 'put') {
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.frequency.setValueAtTime(660, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch(e) {}
  }

  // Fonte Google Rajdhani
  if (!document.getElementById("fxFonteOrion")) {
    var ff = document.createElement("link");
    ff.id = "fxFonteOrion";
    ff.rel = "stylesheet";
    ff.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;800&display=swap";
    document.head.appendChild(ff);
  }

  // Host e Shadow DOM para isolamento total de CSS
  var hosp = document.createElement("div");
  hosp.id = "orionbot";
  hosp.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:999999;";
  var raiz = hosp.attachShadow({ mode: "open" });

  var ESTILO = `
  :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Rajdhani", sans-serif; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .caixa {
    position: fixed; z-index: 999999;
    bottom: 20px; right: 20px;
    width: 360px; max-width: 95vw;
    display: flex; flex-direction: column;
    background: #0A0C10; color: #E8EBEF;
    overflow: hidden;
    border: 1px solid rgba(0, 232, 122, 0.25);
    border-radius: 16px;
    box-shadow: 0 16px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(0, 232, 122, 0.15);
    pointer-events: auto;
    user-select: none;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
  }
  
  .veu {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: radial-gradient(circle at top right, rgba(0,232,122,0.06) 0%, transparent 60%),
                linear-gradient(180deg, rgba(10,12,16,0.92) 0%, rgba(6,8,11,0.98) 100%);
  }

  .topo, .mt5-barra, .corpo, .recado, .teclado { position: relative; z-index: 2; }

  .topo {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 10px 14px; flex: none;
    background: rgba(6, 8, 11, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    cursor: grab;
  }
  .topo:active { cursor: grabbing; }

  .marca-box {
    display: flex; align-items: center; gap: 8px;
  }
  .marca-icone {
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #00E87A, #009647); border-radius: 6px;
    box-shadow: 0 0 10px rgba(0,232,122,0.5);
  }
  .marca-icone svg { width: 15px; height: 15px; color: #04150C; }
  .marca-texto {
    font-family: "Rajdhani", sans-serif; font-size: 17px; font-weight: 800;
    letter-spacing: 0.06em; color: #FFFFFF; display: flex; align-items: center; gap: 5px;
  }
  .marca-badge {
    background: rgba(0,232,122,0.18); color: #00E87A; font-size: 9px; font-weight: 800;
    padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(0,232,122,0.3);
  }

  .online {
    display: flex; align-items: center; gap: 5px; font-size: 11px; color: #9AA3AE;
    font-variant-numeric: tabular-nums; white-space: nowrap; flex: none;
    font-family: "Rajdhani", sans-serif; font-weight: 600;
  }
  .online i {
    width: 6px; height: 6px; border-radius: 50%; background: #1FCB6B; flex: none;
    box-shadow: 0 0 6px #1FCB6B; animation: fxOnPulso 2s infinite;
  }
  @keyframes fxOnPulso {
    0% { box-shadow: 0 0 0 0 rgba(31,203,107,0.6); }
    70% { box-shadow: 0 0 0 6px rgba(31,203,107,0); }
    100% { box-shadow: 0 0 0 0 rgba(31,203,107,0); }
  }

  .botoes-topo { display: flex; align-items: center; gap: 6px; margin-left: auto; }
  .btn-mini-topo {
    background: transparent; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
    color: #94A3B8; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-mini-topo:hover { color: #FFF; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }
  .btn-mini-topo svg { width: 14px; height: 14px; }

  .mt5-barra {
    display: flex; align-items: center; justify-content: space-between; gap: 6px;
    padding: 5px 12px; background: rgba(4, 12, 20, 0.9);
    border-bottom: 1px solid rgba(0, 232, 122, 0.15);
    font-size: 10.5px; letter-spacing: 0.04em; color: #94A3B8; white-space: nowrap;
    font-family: "Rajdhani", sans-serif;
  }
  .mt5-tag { display: inline-flex; align-items: center; gap: 5px; font-weight: 700; color: #00E87A; }
  .mt5-dot { width: 6px; height: 6px; border-radius: 50%; background: #00E87A; box-shadow: 0 0 6px #00E87A; animation: fxOnPulso 1.8s infinite; }
  .mt5-srv { color: #E2E8F0; font-weight: 600; }
  .mt5-ping { color: #38BDF8; font-size: 9.5px; font-weight: 700; }

  .corpo {
    display: flex; gap: 10px; padding: 12px 14px; min-height: 0; align-items: center;
  }

  .mostr {
    position: relative; flex: none; width: 140px; align-self: center;
    filter: drop-shadow(0 6px 16px rgba(0,0,0,0.6));
  }
  .mostr svg { display: block; width: 100%; }
  .aro { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 5; stroke-linecap: round; }
  .curso {
    fill: none; stroke: var(--cor, #E9A825); stroke-width: 5; stroke-linecap: round;
    opacity: 1; transition: stroke 0.35s;
  }
  .marca-t { stroke: rgba(255,255,255,0.14); stroke-width: 1.5; stroke-linecap: round; }
  .marca-t.g { stroke: rgba(255,255,255,0.36); stroke-width: 2.2; stroke-linecap: round; }
  .marca-t.viva { stroke: var(--cor, #E9A825); opacity: 0.9; }
  .agulha { fill: var(--cor, #E9A825); transition: fill 0.35s; filter: drop-shadow(0 0 6px var(--cor, #E9A825)); }
  .pino-c { fill: var(--cor, #E9A825); transition: fill 0.35s; filter: drop-shadow(0 0 8px var(--cor, #E9A825)); }

  .leitura {
    position: absolute; left: 0; right: 0; top: 56%; text-align: center; pointer-events: none;
  }
  .leitura .pc {
    font-family: "Rajdhani", sans-serif; font-size: 26px; font-weight: 700;
    color: var(--cor, #E9A825); font-variant-numeric: tabular-nums; line-height: 1;
    text-shadow: 0 0 16px var(--cor, #E9A825);
  }
  .leitura .lg {
    font-family: "Rajdhani", sans-serif; font-size: 8.5px; letter-spacing: 0.16em;
    color: #9AA3AE; margin-top: 4px; text-transform: uppercase; white-space: nowrap; font-weight: 700;
  }

  .dados {
    flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px;
    min-width: 0; align-self: stretch;
  }

  .campos { display: flex; gap: 6px; }
  .campo { flex: 1; min-width: 0; }
  .campo label {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 9.5px; letter-spacing: 0.08em; color: #AEB7C2; margin-bottom: 3px;
    text-transform: uppercase; font-weight: 600; font-family: "Rajdhani", sans-serif;
  }
  .campo input {
    width: 100%; background: rgba(10,13,18,0.85); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 6px; color: #E8EBEF; padding: 5px 8px;
    font-family: "Rajdhani", sans-serif; font-size: 16px; font-weight: 700;
    font-variant-numeric: tabular-nums; outline: none; cursor: pointer; text-align: center;
  }
  .campo input:focus { border-color: rgba(31,203,107,0.6); }

  .uni { display: inline-flex; gap: 2px; }
  .uni b {
    font-weight: 800; font-size: 9px; line-height: 1; padding: 2px 4px; border-radius: 3px;
    cursor: pointer; color: #78818E; background: rgba(255,255,255,0.06);
  }
  .uni b.on { color: #04150C; background: #1FCB6B; }

  .contas { display: flex; gap: 5px; margin-top: 4px; }
  .conta {
    flex: 1; background: rgba(10,13,18,0.7); border: 1px solid rgba(255,255,255,0.14);
    border-radius: 6px; color: #8A929C; padding: 6px 2px; font-size: 10.5px;
    letter-spacing: 0.06em; font-weight: 700; cursor: pointer; white-space: nowrap;
    text-align: center; font-family: "Rajdhani", sans-serif; transition: all 0.15s;
  }
  .conta.on {
    color: #E8EBEF; border-color: rgba(31,203,107,0.6); background: rgba(31,203,107,0.14);
  }

  .acao {
    border: 0; border-radius: 8px; padding: 8px 12px; font-size: 13px; letter-spacing: 0.08em;
    font-family: "Rajdhani", sans-serif; font-weight: 800; cursor: pointer; white-space: nowrap;
    color: #04150C; background: linear-gradient(180deg, #33E084 0%, #1FCB6B 45%, #15A957 100%);
    box-shadow: 0 2px 0 #0B6E39, 0 6px 14px rgba(31,203,107,0.34);
    transition: transform 0.08s, filter 0.2s;
  }
  .acao:hover { filter: brightness(1.08); }
  .acao:active { transform: translateY(2px); box-shadow: 0 0 0 #0B6E39; }
  .acao.ligar { width: 100%; margin-top: 6px; }

  .acao.parar {
    color: #FFF; background: linear-gradient(180deg, #FF5268 0%, #E2344B 45%, #BF1A2E 100%);
    box-shadow: 0 2px 0 #7E1524, 0 6px 14px rgba(226,52,75,0.34);
    padding: 4px 10px; font-size: 11px;
  }

  /* Estado Rodando */
  .linha { display: flex; align-items: baseline; justify-content: space-between; gap: 6px; }
  .rot {
    font-size: 9px; letter-spacing: 0.08em; color: #9AA3AE; text-transform: uppercase;
    font-family: "Rajdhani", sans-serif; font-weight: 600;
  }
  .num {
    font-family: "Rajdhani", sans-serif; font-variant-numeric: tabular-nums;
    font-size: 12px; font-weight: 700; color: #E8EBEF;
  }
  .verde { color: #00E87A; }
  .rubro { color: #FF2E4C; }
  .ambar { color: #E9A825; }

  .placar {
    font-family: "Rajdhani", sans-serif; font-size: 19px; font-weight: 800;
    line-height: 1; letter-spacing: 0.02em;
  }
  .placar .g { color: #00E87A; }
  .placar .x { color: #565E68; margin: 0 2px; }
  .placar .p { color: #FF2E4C; }

  .fio { height: 1px; background: rgba(255,255,255,0.08); margin: 4px 0; }
  .barra { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; margin-top: 3px; }
  .barra i { display: block; height: 100%; background: #1FCB6B; width: 0%; transition: width 0.4s ease; }
  .andamento { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; margin-top: 3px; }
  .andamento i { display: block; height: 100%; width: 0%; background: #E9A825; }

  /* Teclado Integrado */
  .teclado {
    position: absolute; inset: 0; background: #0A0C10; display: none;
    flex-direction: column; padding: 10px 14px; z-index: 10;
  }
  .teclado.on { display: flex; }
  .tec-topo {
    display: flex; align-items: baseline; justify-content: space-between;
    padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px;
  }
  .tec-rot { font-size: 10px; letter-spacing: 0.12em; color: #8A929C; text-transform: uppercase; font-family: "Rajdhani", sans-serif; }
  .tec-val { font: 800 24px "Rajdhani", monospace; color: #E8EBEF; font-variant-numeric: tabular-nums; }
  .tec-teclas { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
  .tecla {
    border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; background: #12161B;
    color: #E8EBEF; font: 700 16px "Rajdhani", monospace; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .tecla:active { background: #1F2730; }
  .tecla.ok {
    grid-row: span 2; background: linear-gradient(180deg,#33E084,#15A957); color: #04150C;
    border: 0; font-weight: 800; font-size: 13px;
  }
  .tecla.zero { grid-column: span 2; }
  .tecla.apagar { color: #8A929C; font-size: 18px; }

  /* Toast Recado */
  .recado {
    position: absolute; top: -50px; left: 50%; transform: translateX(-50%); z-index: 20;
    background: #1A1F27; border: 1px solid rgba(233,168,37,0.5); border-radius: 8px;
    color: #F0D08A; font-size: 11.5px; line-height: 1.3; padding: 7px 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6); opacity: 0; pointer-events: none;
    transition: all 0.25s ease; text-align: center; white-space: nowrap;
  }
  .recado.on { opacity: 1; top: -40px; }
  `;

  var CORPO = `
  <div class="caixa" id="cx">
    <div class="veu"></div>
    
    <div class="topo" id="topoBarra">
      <div class="marca-box">
        <div class="marca-icone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div class="marca-texto">
          ORION BOT <span class="marca-badge">NEURAL</span>
        </div>
      </div>
      
      <span class="online" id="fxOnline">
        <i></i><b id="fxOnlineN">+1.4k</b>
      </span>

      <div class="botoes-topo">
        <button class="acao parar" id="btParar" style="display:none">Parar</button>
        <button class="btn-mini-topo" id="btMinimizar" title="Minimizar">&#8211;</button>
      </div>
    </div>

    <div class="mt5-barra">
      <span class="mt5-tag"><i class="mt5-dot"></i> ORION ENGINE</span>
      <span class="mt5-srv" id="mt5SrvTxt">OTC Neural (9ms)</span>
      <span class="mt5-ping" id="mt5Ping">IA CONFLUÊNCIA ATIVA</span>
    </div>

    <div class="corpo">
      <div class="mostr">
        <svg viewBox="0 0 240 240">
          <defs>
            <radialGradient id="fxDisco" cx="0.5" cy="0.34" r="0.82">
              <stop offset="0%" stop-color="rgba(32,38,47,.72)"/>
              <stop offset="62%" stop-color="rgba(12,15,20,.78)"/>
              <stop offset="100%" stop-color="rgba(4,6,9,.86)"/>
            </radialGradient>
            <filter id="fxBrilho" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <circle cx="120" cy="120" r="112" fill="url(#fxDisco)"/>
          <circle cx="120" cy="120" r="112" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
          
          <g id="escala"></g>
          <circle class="aro" id="aro" cx="120" cy="120" r="86"></circle>
          <circle class="curso" id="curso" cx="120" cy="120" r="86" filter="url(#fxBrilho)"></circle>
          
          <g id="agulha">
            <rect class="agulha" x="118.3" y="38" width="3.4" height="84" rx="1.7"></rect>
          </g>
          <circle cx="120" cy="120" r="9" fill="rgba(10,13,17,.9)" stroke="rgba(255,255,255,.08)"/>
          <circle class="pino-c" cx="120" cy="120" r="3.6"></circle>
        </svg>
        <div class="leitura">
          <div class="pc" id="gPct">--%</div>
          <div class="lg" id="gCap">PARADO</div>
        </div>
      </div>

      <div class="dados">
        <div id="parado">
          <div class="campos">
            <div class="campo">
              <label>valor ($)</label>
              <input id="valor" readonly value="1">
            </div>
            <div class="campo">
              <label>meta <span class="uni"><b id="uniPct">%</b><b id="uniVal" class="on">R$</b></span></label>
              <input id="meta" readonly value="20">
            </div>
          </div>
          <div class="contas">
            <button class="conta" id="cDemo" data-conta="demo">DEMO</button>
            <button class="conta on" id="cReal" data-conta="real">REAL</button>
            <button class="conta" id="cPix" style="color:#00E876;border-color:rgba(0,230,118,0.4);background:rgba(0,230,118,0.12);font-weight:800;" title="Depósito PIX Instantâneo / Editar Saldo">⚡ PIX</button>
          </div>
          <button class="acao ligar" id="btLigar">INICIAR ROBÔ</button>
        </div>

        <div id="rodando" style="display:none">
          <div class="linha"><span class="rot">ENGINE</span><span class="num verde">ATIVO • 9ms</span></div>
          <div class="linha"><span class="rot">ANÁLISE OTC</span><span class="num ambar" id="mt5AnaliseTxt">EURUSD-OTC • CONFLUÊNCIA</span></div>
          <div class="linha">
            <span class="rot">acerto</span>
            <span class="placar" id="placar"><span class="g">0</span><span class="x">&times;</span><span class="p">0</span></span>
          </div>
          <div class="fio"></div>
          <div class="linha"><span class="rot">próxima</span><span class="num" id="prox">00:15</span></div>
          <div class="andamento"><i id="and"></i></div>
          <div class="linha"><span class="rot">resultado</span><span class="num" id="lucro">R$ +0.00</span></div>
          <div class="linha"><span class="rot">meta</span><span class="num" id="metaTxt">R$ 0.00 / R$ 20.00</span></div>
          <div class="barra"><i id="barraMeta"></i></div>
        </div>
      </div>
    </div>

    <div class="recado" id="recado"></div>

    <div class="teclado" id="teclado">
      <div class="tec-topo">
        <span class="tec-rot" id="tecRot">VALOR</span>
        <span class="tec-val" id="tecVal">0</span>
      </div>
      <div class="tec-teclas" id="tecTeclas"></div>
    </div>
  </div>
  `;

  var estEl = document.createElement("style");
  estEl.textContent = ESTILO;
  var envEl = document.createElement("div");
  envEl.innerHTML = CORPO;
  raiz.appendChild(estEl);
  raiz.appendChild(envEl);

  document.body.appendChild(hosp);

  var $ = function(id) { return raiz.getElementById(id); };

  // Escala e Animação do Manômetro (idêntico ao app)
  var ARCO_INI = 150, ARCO = 240, R = 86;
  var CIRC = 2 * Math.PI * R, TRACO = CIRC * (ARCO / 360);

  (function montarEscala() {
    var g = $("escala"), h = "", cx = 120, cy = 120;
    for (var i = 0; i <= 40; i++) {
      var ang = (ARCO_INI + (i / 40) * ARCO) * Math.PI / 180;
      var maior = (i % 5 === 0), r1 = maior ? 94 : 96.5, r2 = 101;
      h += '<line x1="' + (cx + r1 * Math.cos(ang)).toFixed(1) + '" y1="' + (cy + r1 * Math.sin(ang)).toFixed(1) +
           '" x2="' + (cx + r2 * Math.cos(ang)).toFixed(1) + '" y2="' + (cy + r2 * Math.sin(ang)).toFixed(1) +
           '" class="marca-t' + (maior ? " g" : "") + '"/>';
    }
    g.innerHTML = h;
    var c = $("curso"), a = $("aro");
    c.setAttribute("transform", "rotate(" + ARCO_INI + " 120 120)");
    c.style.strokeDasharray = TRACO.toFixed(2) + " " + CIRC.toFixed(2);
    c.style.strokeDashoffset = TRACO.toFixed(2);
    a.setAttribute("transform", "rotate(" + ARCO_INI + " 120 120)");
    a.style.strokeDasharray = TRACO.toFixed(2) + " " + CIRC.toFixed(2);
  })();

  function girarAgulha(g) { $("agulha").setAttribute("transform", "rotate(" + (g - 270) + " 120 120)"); }
  function porCurso(pct) {
    $("curso").style.strokeDashoffset = (TRACO * (1 - pct / 100)).toFixed(2);
    var ate = Math.round((pct / 100) * 40);
    var marcas = $("escala").childNodes;
    for (var i = 0; i < marcas.length; i++) {
      var cl = marcas[i].getAttribute("class") || "";
      var viva = i <= ate;
      var tem = cl.indexOf("viva") >= 0;
      if (viva && !tem) marcas[i].setAttribute("class", cl + " viva");
      else if (!viva && tem) marcas[i].setAttribute("class", cl.replace(" viva", ""));
    }
  }
  function corDoEstado(cor) { raiz.querySelector(".caixa").style.setProperty("--cor", cor); }

  var VMIN = ARCO_INI + 12, VMAX = ARCO_INI + ARCO - 12;
  var vd = 270, vp = 270, vt0 = 0, vdur = 900, vpausa = 0, varrendo = false;

  function novoAlvo() {
    var d;
    do { d = VMIN + Math.random() * (VMAX - VMIN); } while (Math.abs(d - vd) < 40);
    vp = vd; vd = d; vt0 = 0;
    vdur = 420 + Math.abs(vd - vp) * 3.2;
    vpausa = Math.random() < 0.35 ? 180 + Math.random() * 320 : 0;
  }

  function passoVarredura(t) {
    if (!varrendo) return;
    if (!vt0) vt0 = t;
    var k = Math.min(1, (t - vt0) / vdur);
    var f = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    girarAgulha(vp + (vd - vp) * f);
    porCurso(((vp + (vd - vp) * f) - ARCO_INI) / ARCO * 100);
    if (k >= 1) {
      if (vpausa > 0) { vpausa -= 16; } else novoAlvo();
    }
    requestAnimationFrame(passoVarredura);
  }

  function analisar(ligar) {
    if (ligar === varrendo) return;
    varrendo = ligar;
    if (ligar) {
      corDoEstado("#E9A825");
      novoAlvo();
      requestAnimationFrame(passoVarredura);
    }
  }

  function fixarLeitura(direcao, pct) {
    varrendo = false;
    corDoEstado(direcao === "put" ? "#FF2E4C" : "#00E87A");
    var g = ARCO_INI + (pct / 100) * ARCO;
    girarAgulha(g); porCurso(pct);
    $("gPct").textContent = Math.round(pct) + "%";
    $("gCap").textContent = direcao === "put" ? "VENDA (PUT)" : "COMPRA (CALL)";
  }

  // Estado Local Autónomo
  var state = {
    ligado: false,
    conta: "real",
    valor: 1,
    meta: 20,
    metaEmDinheiro: true,
    ganhos: 0,
    perdas: 0,
    lucro: 0,
    tempoProx: 12,
    emOperacao: false,
    tempoOp: 5,
    ativo: "EUR/USD OTC"
  };

  function avisar(msg) {
    var r = $("recado");
    if (!r) return;
    r.textContent = msg;
    r.classList.add("on");
    setTimeout(function() { r.classList.remove("on"); }, 3800);
  }

  function formatarDinheiro(v) {
    return "R$ " + (Number(v) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Teclado Virtual Numérico
  var campoEmEdicao = null, valorDigitado = "";
  var TECLAS = ["1","2","3","OK","4","5","6","7","8","9","<",".","0"];
  (function montarTeclado() {
    var alvo = $("tecTeclas");
    TECLAS.forEach(function(t) {
      var b = document.createElement("div");
      b.className = "tecla" + (t === "OK" ? " ok" : (t === "<" ? " apagar" : (t === "0" ? " zero" : "")));
      b.textContent = t === "<" ? "⌫" : t;
      b.setAttribute("data-t", t);
      alvo.appendChild(b);
    });
  })();

  function abrirTeclado(id) {
    campoEmEdicao = id;
    valorDigitado = "";
    $("tecRot").textContent = id === "valor" ? "VALOR DE ENTRADA" : (state.metaEmDinheiro ? "META EM DINHEIRO" : "META EM %");
    $("tecVal").textContent = $(id).value || "0";
    $("teclado").classList.add("on");
  }

  function fecharTeclado(salvar) {
    if (salvar && campoEmEdicao && valorDigitado !== "") {
      var v = valorDigitado.replace(/[^0-9.]/g, "");
      if (v && Number(v) > 0) $(campoEmEdicao).value = v;
    }
    campoEmEdicao = null; valorDigitado = "";
    $("teclado").classList.remove("on");
  }

  $("tecTeclas").addEventListener("click", function(ev) {
    var t = ev.target && ev.target.getAttribute("data-t");
    if (!t) return;
    if (t === "OK") return fecharTeclado(true);
    if (t === "<") { valorDigitado = valorDigitado.slice(0, -1); }
    else if (t === ".") { if (valorDigitado.indexOf(".") < 0) valorDigitado = (valorDigitado || "0") + "."; }
    else { if (valorDigitado.replace(".", "").length < 7) valorDigitado += t; }
    $("tecVal").textContent = valorDigitado === "" ? "0" : valorDigitado;
  });

  $("valor").addEventListener("click", function() { abrirTeclado("valor"); });
  $("meta").addEventListener("click", function() { abrirTeclado("meta"); });

  // Seletores de Conta
  $("cDemo").addEventListener("click", function() {
    state.conta = "demo";
    $("cDemo").classList.add("on"); $("cReal").classList.remove("on");
  });
  $("cReal").addEventListener("click", function() {
    state.conta = "real";
    $("cReal").classList.add("on"); $("cDemo").classList.remove("on");
  });
  $("cPix").addEventListener("click", function() {
    if (typeof window.abrirModalPix === "function") {
      window.abrirModalPix(500, "real");
    } else {
      var n = prompt("GERENCIADOR DE SALDO / PIX (R$):\nDigite o saldo desejado para a CONTA REAL (ex: 500):", String(state.saldo_real || 500));
      if (n !== null) {
        var num = parseFloat(n);
        if (!isNaN(num) && num >= 0) {
          state.saldo_real = num;
          avisar("Conta Real atualizada: R$ " + num.toFixed(2));
          console.log("%c[ORION] Saldo da Conta Real: R$ " + num.toFixed(2), "color:#00E87A; font-weight:bold;");
        }
      }
    }
  });

  // Troca de Unidade de Meta (% ou R$)
  $("uniPct").addEventListener("click", function() {
    state.metaEmDinheiro = false;
    $("uniPct").classList.add("on"); $("uniVal").classList.remove("on");
    if ($("meta").value > 100) $("meta").value = "20";
  });
  $("uniVal").addEventListener("click", function() {
    state.metaEmDinheiro = true;
    $("uniVal").classList.add("on"); $("uniPct").classList.remove("on");
  });

  // Execução de clique automático na corretora
  function executarEntradaBroker(direcao) {
    var selectorsCall = [
      'button[data-test="call-btn"]', '.btn-call', '.call-btn', 'button.call',
      '[data-testid="higherButton"]', '.trade-panel button:first-child',
      'button.btn-green', 'button:has(svg.call)', '.button-call'
    ];
    var selectorsPut = [
      'button[data-test="put-btn"]', '.btn-put', '.put-btn', 'button.put',
      '[data-testid="lowerButton"]', '.trade-panel button:last-child',
      'button.btn-red', 'button:has(svg.put)', '.button-put'
    ];
    var lista = direcao === 'call' ? selectorsCall : selectorsPut;
    var btn = null;
    for (var i = 0; i < lista.length; i++) {
      try {
        var el = document.querySelector(lista[i]);
        if (el && el.offsetParent !== null) { btn = el; break; }
      } catch(e) {}
    }
    if (btn) {
      btn.click();
      console.log("%c[ORION] Clique automático enviado na corretora: " + direcao.toUpperCase(), "color:#00E87A; font-weight:bold;");
    } else {
      console.log("%c[ORION] Sinal gerado: " + direcao.toUpperCase() + " (botão na tela pronto para clique)", "color:#38BDF8;");
    }
  }

  // Iniciar e Parar
  $("btLigar").addEventListener("click", function() {
    state.valor = parseFloat($("valor").value) || 1;
    state.meta = parseFloat($("meta").value) || 20;
    state.ligado = true;
    state.tempoProx = 8;
    state.emOperacao = false;

    $("parado").style.display = "none";
    $("rodando").style.display = "block";
    $("btParar").style.display = "inline-block";

    $("mt5AnaliseTxt").textContent = state.ativo + " • ANALISANDO CONFLUÊNCIA";
    $("metaTxt").textContent = "R$ 0.00 / " + formatarDinheiro(state.meta);

    tocarSinal('alerta');
    analisar(true);
    avisar("Orion Bot Iniciado com Sucesso!");
  });

  function pararBot() {
    state.ligado = false;
    state.emOperacao = false;
    analisar(false);
    corDoEstado("#565E68");
    girarAgulha(ARCO_INI); porCurso(0);
    $("gPct").textContent = "--%";
    $("gCap").textContent = "PARADO";

    $("parado").style.display = "block";
    $("rodando").style.display = "none";
    $("btParar").style.display = "none";
    avisar("Robô pausado.");
  }

  $("btParar").addEventListener("click", pararBot);

  // Minimizar
  var minimizado = false;
  $("btMinimizar").addEventListener("click", function() {
    minimizado = !minimizado;
    raiz.querySelector(".corpo").style.display = minimizado ? "none" : "flex";
    raiz.querySelector(".mt5-barra").style.display = minimizado ? "none" : "flex";
    $("btMinimizar").textContent = minimizado ? "+" : "–";
  });

  // Arrastar Painel pelo Topo
  var dragEl = raiz.querySelector(".caixa");
  var topoEl = $("topoBarra");
  var isDragging = false, startX, startY, initLeft, initTop;

  topoEl.addEventListener("mousedown", function(e) {
    if (e.target.closest("button")) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    var rect = dragEl.getBoundingClientRect();
    initLeft = rect.left;
    initTop = rect.top;
    dragEl.style.bottom = "auto";
    dragEl.style.right = "auto";
    dragEl.style.left = initLeft + "px";
    dragEl.style.top = initTop + "px";
  });

  window.addEventListener("mousemove", function(e) {
    if (!isDragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    dragEl.style.left = Math.max(10, Math.min(window.innerWidth - 370, initLeft + dx)) + "px";
    dragEl.style.top = Math.max(10, Math.min(window.innerHeight - 150, initTop + dy)) + "px";
  });

  window.addEventListener("mouseup", function() { isDragging = false; });

  // Motor em loop a cada 1 segundo (100% autônomo sem rede)
  var loopTimer = setInterval(function() {
    if (!state.ligado) return;

    if (state.emOperacao) {
      state.tempoOp--;
      $("and").style.width = Math.min(100, ((5 - state.tempoOp) / 5) * 100) + "%";

      if (state.tempoOp <= 0) {
        state.emOperacao = false;
        var win = Math.random() < 0.88; // 88% de assertividade padrão
        if (win) {
          state.ganhos++;
          var lucroOp = +(state.valor * 0.87).toFixed(2);
          state.lucro += lucroOp;
          avisar("VITÓRIA! Lucro: +" + formatarDinheiro(lucroOp));
          tocarSinal('call');
        } else {
          state.perdas++;
          state.lucro -= state.valor;
          avisar("Loss computado. Protegendo banca.");
          tocarSinal('put');
        }

        // Atualiza placar
        var pl = $("placar");
        pl.innerHTML = '<span class="g">' + state.ganhos + '</span><span class="x">&times;</span><span class="p">' + state.perdas + '</span>';
        
        $("lucro").textContent = (state.lucro >= 0 ? "+" : "") + formatarDinheiro(state.lucro);
        $("lucro").className = "num " + (state.lucro >= 0 ? "verde" : "rubro");

        var metaNum = state.meta;
        var pctMeta = Math.max(0, Math.min(100, (state.lucro / metaNum) * 100));
        $("barraMeta").style.width = pctMeta + "%";

        if (state.lucro >= metaNum) {
          avisar("META BATIDA! Lucro final: " + formatarDinheiro(state.lucro));
          pararBot();
          return;
        }

        // Volta a analisar
        state.tempoProx = 12 + Math.floor(Math.random() * 8);
        $("mt5AnaliseTxt").textContent = state.ativo + " • ANALISANDO CONFLUÊNCIA";
        $("gCap").textContent = "ANALISANDO";
        $("gPct").textContent = "";
        analisar(true);
      }
      return;
    }

    state.tempoProx--;
    $("prox").textContent = "00:" + (state.tempoProx < 10 ? "0" : "") + state.tempoProx;

    if (state.tempoProx <= 0) {
      // Dispara sinal neural
      var forca = 91 + Math.floor(Math.random() * 8);
      var dir = Math.random() > 0.5 ? 'call' : 'put';

      fixarLeitura(dir, forca);
      tocarSinal(dir);

      $("mt5AnaliseTxt").textContent = state.ativo + " • " + (dir === 'call' ? "COMPRA (CALL)" : "VENDA (PUT)") + " (" + forca + "%)";
      avisar("SINAL: " + (dir === 'call' ? "COMPRA (CALL)" : "VENDA (PUT)") + " - FORÇA " + forca + "%");

      executarEntradaBroker(dir);

      state.emOperacao = true;
      state.tempoOp = 5;
    }
  }, 1000);

  // Instância global para controle
  window.__ORION_BOT_INSTANCE__ = {
    destroy: function() {
      clearInterval(loopTimer);
      if (hosp && hosp.parentNode) hosp.parentNode.removeChild(hosp);
    },
    state: state
  };

  console.log("%c╔════════════════════════════════════════════════════════════════╗", "color:#00E87A; font-weight:bold;");
  console.log("%c║           ORION BOT NEURAL ENGINE v5.2 - HUD INJETADO          ║", "color:#00E87A; font-weight:bold;");
  console.log("%c║        Painel Idêntico Aberto • Sem MT5 • 100% Autônomo        ║", "color:#00E87A; font-weight:bold;");
  console.log("%c╚════════════════════════════════════════════════════════════════╝", "color:#00E87A; font-weight:bold;");
})();
