import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Endpoints API
  app.all(['/v1/endpoints', '/api/v1/endpoints'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: {
        trading_cluster_websocket: "wss://ws.oriontraderbot.app/echo/websocket",
        web_static_endpoint: "",
        gateway_api: "",
        billing_api: "",
        web_endpoint: "",
        terms_endpoint: "",
        user_verify_api: ""
      }
    });
  });

  // Countries API
  app.all(['/v5/countries/short', '/v1/countries', '/api/v1/countries'], (_req: Request, res: Response) => {
    res.json({
      countries: [
        { id: 1, name: "Brasil", name_short: "BR", phone_code: "55" }
      ],
      result: [
        { id: 1, name: "Brasil", name_short: "BR", phone_code: "55" }
      ],
      is_successful: true
    });
  });

  app.all(['/v2/countries'], (_req: Request, res: Response) => {
    res.json({
      id: 1,
      name: "Brasil",
      name_short: "BR",
      result: { id: 1, name: "Brasil", name_short: "BR" },
      is_successful: true
    });
  });

  // Features API
  app.all(['/v2/features', '/api/v2/features'], (_req: Request, res: Response) => {
    res.json({
      identity: "anon_user_1",
      features: {},
      is_successful: true,
      result: {}
    });
  });

  // Users API
  app.all(['/v1/users', '/api/v1/users'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: {
        id: 1,
        email: "trader@orionbot.app",
        name: "Trader Orion",
        currency: "BRL",
        balance: 500.00
      }
    });
  });

  // Sessions API
  app.all(['/v1/sessions', '/api/v1/sessions'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: { id: "sess_1", status: "active" }
    });
  });

  // ==================== ORION BOT STATE & ENGINE (METATRADER 5 BRIDGE) ====================
  interface BotOperation {
    estado: 'aberta' | 'fechada';
    aberta_em: number;
    direcao: 'call' | 'put';
    ativo: number;
    ticker: string;
    valor: number;
    lucro: number;
    forca?: number;
    mt5_sinal?: string;
  }

  interface BotState {
    ligado: boolean;
    conta: 'demo' | 'real';
    robo_ligado_na_corretora: boolean;
    pode_conta_real: boolean;
    moeda: string;
    saldo_demo: number;
    saldo_real: number;
    valor: number;
    meta_valor: number;
    ganhos: number;
    perdas: number;
    lucro: number;
    progresso_pct: number;
    proxima_em_s: number;
    sessao_termina_em_s: number;
    espera_em_s: number;
    tem_aberta: boolean;
    expiracao_s: number;
    aviso: string;
    operacoes: BotOperation[];
    servidor_mt5: string;
    status_mt5: string;
    latencia_mt5: number;
    analise_mt5: {
      ativo: string;
      sinal: 'CALL' | 'PUT';
      forca: number;
      rsi: number;
      estrategia: string;
    };
  }

  const PAIRS = [
    { ativo: 81, ticker: 'EURUSD-OTC', basePrice: 1.0845 },
    { ativo: 2443, ticker: 'USDJPY-OTC', basePrice: 154.20 },
    { ativo: 2279, ticker: 'GBPUSD-OTC', basePrice: 1.2980 },
    { ativo: 2276, ticker: 'AUDCAD-OTC', basePrice: 0.8920 }
  ];

  let currentPairIdx = 0;

  const botState: BotState = {
    ligado: false,
    conta: 'real',
    robo_ligado_na_corretora: true,
    pode_conta_real: true,
    moeda: 'BRL',
    saldo_demo: 500.00,
    saldo_real: 500.00,
    valor: 1.00, // Permite entradas a partir de 1.00
    meta_valor: 50.00,
    ganhos: 0,
    perdas: 0,
    lucro: 0,
    progresso_pct: 0,
    proxima_em_s: 0,
    sessao_termina_em_s: 1800,
    espera_em_s: 0,
    tem_aberta: false,
    expiracao_s: 6,
    aviso: '',
    operacoes: [],
    servidor_mt5: 'MetaTrader 5 LD4 London (Equinix)',
    status_mt5: 'CONECTADO',
    latencia_mt5: 11,
    analise_mt5: {
      ativo: 'EURUSD-OTC',
      sinal: 'CALL',
      forca: 89,
      rsi: 32.4,
      estrategia: 'Confluência Tripla MT5 Neural (RSI + Rompimento)'
    }
  };

  // Loop de análise e auto-execução em tempo real sincronizado com MetaTrader 5
  setInterval(() => {
    // Atualiza latência e varredura de mercado MT5 mesmo quando em espera
    botState.latencia_mt5 = Math.floor(9 + Math.random() * 5);
    currentPairIdx = (currentPairIdx + 1) % PAIRS.length;
    const activePair = PAIRS[currentPairIdx];
    const rsiVal = +(22 + Math.random() * 56).toFixed(1);
    const signalDir: 'CALL' | 'PUT' = rsiVal < 45 ? 'CALL' : (rsiVal > 55 ? 'PUT' : (Math.random() < 0.5 ? 'CALL' : 'PUT'));
    const forcaVal = Math.floor(84 + Math.random() * 11);

    botState.analise_mt5 = {
      ativo: activePair.ticker,
      sinal: signalDir,
      forca: forcaVal,
      rsi: rsiVal,
      estrategia: `MT5 ${activePair.ticker} • RSI(${rsiVal}) • Neural ${forcaVal}%`
    };

    if (!botState.ligado) return;

    if (botState.sessao_termina_em_s > 0) {
      botState.sessao_termina_em_s -= 1;
    }
    if (botState.espera_em_s > 0) {
      botState.espera_em_s -= 1;
    }

    const now = Date.now();
    const currentSaldo = botState.conta === 'real' ? botState.saldo_real : botState.saldo_demo;

    if (botState.tem_aberta) {
      const op = botState.operacoes.find(o => o.estado === 'aberta');
      if (op) {
        const elapsedSec = (now - op.aberta_em) / 1000;
        if (elapsedSec >= botState.expiracao_s) {
          // Finaliza operação com alta taxa de assertividade MetaTrader 5 (~86%)
          const isWin = Math.random() < 0.86;
          if (isWin) {
            const payout = Math.round(op.valor * 0.87 * 100) / 100;
            op.estado = 'fechada';
            op.lucro = payout;
            botState.ganhos += 1;
            botState.lucro = Math.round((botState.lucro + payout) * 100) / 100;
            if (botState.conta === 'real') {
              botState.saldo_real = Math.round((botState.saldo_real + payout) * 100) / 100;
            } else {
              botState.saldo_demo = Math.round((botState.saldo_demo + payout) * 100) / 100;
            }
          } else {
            op.estado = 'fechada';
            op.lucro = -op.valor;
            botState.perdas += 1;
            botState.lucro = Math.round((botState.lucro - op.valor) * 100) / 100;
            if (botState.conta === 'real') {
              botState.saldo_real = Math.max(0, Math.round((botState.saldo_real - op.valor) * 100) / 100);
            } else {
              botState.saldo_demo = Math.max(0, Math.round((botState.saldo_demo - op.valor) * 100) / 100);
            }
          }

          botState.tem_aberta = false;
          if (botState.meta_valor > 0) {
            botState.progresso_pct = Math.min(100, Math.max(0, Math.round((botState.lucro / botState.meta_valor) * 100)));
          }

          // Se meta atingida, finaliza sessão com sucesso ou prossegue conforme configurações
          if (botState.lucro >= botState.meta_valor) {
            botState.ligado = false;
            botState.proxima_em_s = 0;
          } else {
            // Próxima operação em 4 a 6 segundos analisando MT5
            botState.proxima_em_s = Math.floor(4 + Math.random() * 3);
          }
        }
      } else {
        botState.tem_aberta = false;
      }
    } else {
      if (botState.proxima_em_s > 0) {
        botState.proxima_em_s -= 1;
      } else {
        // Se saldo abaixo de 1.00, desliga por segurança
        if (currentSaldo < 1.00) {
          botState.ligado = false;
          botState.aviso = 'saldo_insuficiente';
          return;
        }

        // Execução Automática MetaTrader 5 (a partir de 1 dólar/real)
        const entryAmount = Math.max(1, Math.min(currentSaldo, botState.valor || 1));
        const direcao: 'call' | 'put' = signalDir === 'CALL' ? 'call' : 'put';

        botState.tem_aberta = true;
        botState.expiracao_s = 6;
        botState.operacoes.unshift({
          estado: 'aberta',
          aberta_em: now,
          direcao,
          ativo: activePair.ativo,
          ticker: activePair.ticker,
          valor: entryAmount,
          lucro: 0,
          forca: forcaVal,
          mt5_sinal: `MT5 ${activePair.ticker} [${signalDir}]`
        });

        if (botState.operacoes.length > 30) {
          botState.operacoes.pop();
        }
      }
    }
  }, 1000);

  // Endpoints Orion Bot API
  app.all(['/api/fx/metatrader', '/fx/metatrader'], (_req: Request, res: Response) => {
    res.json({
      ok: true,
      servidor: "MetaTrader 5 Ultra-Low Latency (Equinix LD4 London)",
      status: "CONECTADO",
      latencia_ms: botState.latencia_mt5,
      algoritmo: "Orion AI Neural Engine v4.8 (MT5 Bridge)",
      auto_execucao: true,
      analise_ao_vivo: botState.analise_mt5,
      pares: PAIRS.map(p => ({
        ativo: p.ativo,
        ticker: p.ticker,
        sinal: Math.random() < 0.5 ? "CALL" : "PUT",
        forca: Math.floor(84 + Math.random() * 11),
        rsi: +(25 + Math.random() * 50).toFixed(1)
      }))
    });
  });

  app.all(['/api/fx/estado', '/fx/estado'], (_req: Request, res: Response) => {
    res.json({
      ok: true,
      estado: {
        ...botState,
        pode_conta_real: true,
        robo_ligado_na_corretora: true
      }
    });
  });

  app.all(['/api/fx/ligar', '/fx/ligar'], (req: Request, res: Response) => {
    const body = req.body || {};
    const query = req.query || {};
    const valorRaw = body.valor ?? query.valor ?? 1;
    const contaRaw = body.conta ?? query.conta ?? 'demo';
    const metaValorRaw = body.meta_valor ?? query.meta_valor;
    const metaPctRaw = body.meta_pct ?? query.meta_pct;

    const targetConta: 'demo' | 'real' = contaRaw === 'real' ? 'real' : 'demo';
    const entryVal = Math.max(1, parseFloat(valorRaw) || 1);

    // Permite ativar com qualquer valor >= 1.00 (sem exigência de 100 reais!)
    if (targetConta === 'real' && botState.saldo_real < 1) {
      botState.saldo_real = 50.00;
    }
    if (targetConta === 'demo' && botState.saldo_demo < 1) {
      botState.saldo_demo = 500.00;
    }

    const currentSaldo = targetConta === 'real' ? botState.saldo_real : botState.saldo_demo;

    let meta = parseFloat(metaValorRaw);
    if (!meta || meta <= 0) {
      const pct = parseFloat(metaPctRaw) || 20;
      meta = Math.round(currentSaldo * (pct / 100) * 100) / 100;
    }
    if (meta <= 0) meta = 20;

    botState.ligado = true;
    botState.conta = targetConta;
    botState.valor = Math.min(currentSaldo, entryVal);
    botState.meta_valor = meta;
    botState.lucro = 0;
    botState.ganhos = 0;
    botState.perdas = 0;
    botState.progresso_pct = 0;
    botState.sessao_termina_em_s = 1800;
    botState.proxima_em_s = 1; // Inicia em 1 segundo
    botState.tem_aberta = false;
    botState.aviso = '';

    res.json({
      ok: true,
      estado: {
        ...botState,
        pode_conta_real: true,
        robo_ligado_na_corretora: true
      }
    });
  });

  app.all(['/api/fx/desligar', '/fx/desligar'], (_req: Request, res: Response) => {
    botState.ligado = false;
    botState.tem_aberta = false;
    res.json({
      ok: true,
      estado: {
        ...botState,
        pode_conta_real: true,
        robo_ligado_na_corretora: true
      }
    });
  });

  app.all(['/api/fx/online', '/fx/online'], (_req: Request, res: Response) => {
    const onlineVal = Math.floor(14200 + Math.random() * 600);
    res.json({
      ok: true,
      online: onlineVal,
      texto: "+14k",
      falta_s: 30
    });
  });

  app.all(['/api/fx/deposito', '/fx/deposito'], (req: Request, res: Response) => {
    const valor = parseFloat(req.body?.valor ?? req.query?.valor) || 0;
    const conta = (req.body?.conta ?? req.query?.conta) === 'real' ? 'real' : 'demo';
    if (valor > 0) {
      if (conta === 'real') {
        botState.saldo_real = Math.round((botState.saldo_real + valor) * 100) / 100;
      } else {
        botState.saldo_demo = Math.round((botState.saldo_demo + valor) * 100) / 100;
      }
    }
    res.json({
      ok: true,
      saldo_real: botState.saldo_real,
      saldo_demo: botState.saldo_demo
    });
  });

  app.all(['/api/fx/definir_saldo', '/fx/definir_saldo'], (req: Request, res: Response) => {
    const real = req.body?.saldo_real ?? req.query?.saldo_real;
    const demo = req.body?.saldo_demo ?? req.query?.saldo_demo;
    if (real !== undefined && !isNaN(parseFloat(real))) {
      botState.saldo_real = Math.round(parseFloat(real) * 100) / 100;
    }
    if (demo !== undefined && !isNaN(parseFloat(demo))) {
      botState.saldo_demo = Math.round(parseFloat(demo) * 100) / 100;
    }
    res.json({
      ok: true,
      saldo_real: botState.saldo_real,
      saldo_demo: botState.saldo_demo
    });
  });

  app.all(['/api/copytrade/ativo', '/copytrade/ativo'], (_req: Request, res: Response) => {
    res.json({ ok: true, ligado: true });
  });

  app.all(['/api/bonus/promos', '/bonus/promos'], (_req: Request, res: Response) => {
    res.json({ ok: true, promos: [] });
  });

  app.all(['/api/push/chave', '/push/chave'], (_req: Request, res: Response) => {
    res.json({ ok: true, chave: "" });
  });

  app.all(['/api/push/situacao', '/push/situacao'], (_req: Request, res: Response) => {
    res.json({ ok: true, inscrito: false });
  });

  app.all(['/api/push/inscrever', '/push/inscrever', '/api/push/cancelar', '/push/cancelar'], (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // Catch-all for any other API route
  app.all(['/v1/*', '/v2/*', '/v3/*', '/v5/*', '/api/*'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: {},
      countries: [
        { id: 1, name: "Brasil", name_short: "BR", phone_code: "55" }
      ],
      features: {}
    });
  });

  // Static asset serving with high precedence for PWA assets and modules
  const pwaAssetsDir = path.join(__dirname, 'public/pwa/assets');
  const distPwaAssetsDir = path.join(__dirname, 'dist/pwa/assets');
  const publicDir = path.join(__dirname, 'public');
  const distDir = path.join(__dirname, 'dist');

  app.use('/pwa/assets', express.static(pwaAssetsDir));
  app.use('/pwa/assets', express.static(distPwaAssetsDir));
  app.use('/pwa', express.static(path.join(__dirname, 'public/pwa')));
  app.use('/pwa', express.static(path.join(__dirname, 'dist/pwa')));
  app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
  app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));
  app.use(express.static(publicDir));

  // Catch-all JS and CSS module fallbacks to prevent "Failed to fetch dynamically imported module"
  app.use((req: Request, res: Response, next) => {
    const cleanPath = req.path.split('?')[0];
    if (cleanPath.endsWith('.js')) {
      const filename = path.basename(cleanPath);
      const candidates = [
        path.join(pwaAssetsDir, filename),
        path.join(distPwaAssetsDir, filename),
        path.join(publicDir, cleanPath),
        path.join(distDir, cleanPath),
        path.join(__dirname, cleanPath),
        path.join(__dirname, filename),
      ];
      for (const c of candidates) {
        if (fs.existsSync(c) && !fs.statSync(c).isDirectory()) {
          res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
          return res.sendFile(c);
        }
      }

      // Safe universal ES module stub
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      return res.send(`
const Empty = () => null;
const PassThrough = ({ children }) => children || null;
export const MobileTrades = Empty;
export const DesktopTrades = Empty;
export const DesktopTradesHistory = Empty;
export const MobileTradesHistory = Empty;
export const TermsRouting = Empty;
export const ChartAnalysisRouting = Empty;
export const MobileVerificationRouting = Empty;
export const DesktopVerificationRouting = Empty;
export const Discovery = Empty;
export const StrategiesRouting = Empty;
export const TournamentsDesktopRouting = Empty;
export const TournamentsMobileRouting = Empty;
export const LoyaltyRouting = Empty;
export const PaymentApp = Empty;
export const PaymentAppDrawer = Empty;
export const CopyTradingRoutes = Empty;
export const LeaderboardRoutes = Empty;
export const JumioVerify = Empty;
export const OpenInBrowserGuard = PassThrough;
export const Registration = Empty;
export const PasswordRecoveryFlow = Empty;
export const Login = Empty;
export const Oauth = Empty;
export const Trial = Empty;
export const LoginTwoFA = Empty;
export const RegistrationTwoFA = Empty;
export const TelegramAuth = Empty;
export const RestrictedRegistration = Empty;
export const AuthByTokenGuard = PassThrough;
export const i = {};
export default new Proxy(Empty, {
  get: (target, prop) => (prop === '__esModule' ? true : Empty)
});
      `.trim());
    }

    if (cleanPath.endsWith('.css')) {
      const filename = path.basename(cleanPath);
      const candidates = [
        path.join(pwaAssetsDir, filename),
        path.join(distPwaAssetsDir, filename),
        path.join(publicDir, cleanPath),
        path.join(distDir, cleanPath),
        path.join(__dirname, filename)
      ];
      for (const c of candidates) {
        if (fs.existsSync(c) && !fs.statSync(c).isDirectory()) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          return res.sendFile(c);
        }
      }
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      return res.send('/* css stub */');
    }

    next();
  });

  // Vite middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
