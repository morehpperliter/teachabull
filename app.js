const PGS = ['home','calc','dash','pricing','faq'];

function go(id) {
  PGS.forEach(p => {
    document.getElementById('p-' + p).classList.toggle('on', p === id);
  });
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('on', PGS[i] === id);
  });
  if (id === 'dash') initDash();
}

// Ticker
const TKD = [
  {s:'ES',  v:'5,421.25', c:'+0.42%', u:1},
  {s:'NQ',  v:'19,884.50',c:'+0.61%', u:1},
  {s:'CL',  v:'78.34',    c:'-0.18%', u:0},
  {s:'GC',  v:'2,318.10', c:'+0.29%', u:1},
  {s:'BTC', v:'67,420',   c:'+1.14%', u:1},
  {s:'SPY', v:'541.22',   c:'+0.38%', u:1},
  {s:'EURUSD',v:'1.0832', c:'-0.12%', u:0},
  {s:'TLT', v:'94.17',    c:'+0.21%', u:1},
  {s:'VIX', v:'14.82',    c:'-0.90%', u:0},
  {s:'ETH', v:'3,512',    c:'+0.87%', u:1}
];
const tk = document.getElementById('tkr');
if (tk) {
  tk.innerHTML = [...TKD, ...TKD]
    .map(t => `<span class="ti"><span class="ts">${t.s}</span><span class="tv">${t.v}</span><span class="${t.u ? 'tu' : 'td2'}">${t.c}</span></span>`)
    .join('');
}

// Ring chart
function drawRing(score, color) {
  const c = document.getElementById('rc');
  if (!c) return;
  const ctx = c.getContext('2d'), cx = 70, cy = 70, r = 54, lw = 8;
  ctx.clearRect(0, 0, 140, 140);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = lw; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 100));
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
}

// Calculator
function calc() {
  const d  = +document.getElementById('s-d').value;
  const c  = +document.getElementById('s-c').value;
  const r  = +document.getElementById('s-r').value;
  const dd = +document.getElementById('s-dd').value;
  const w  = +document.getElementById('s-w').value;

  ['d','c','r','dd','w'].forEach(k => {
    const val = k === 'd' ? d : k === 'c' ? c : k === 'r' ? r : k === 'dd' ? dd : w;
    document.getElementById('v-' + k).textContent = val;
    document.getElementById('fc-' + k).textContent = val;
  });

  const score = Math.round((d + c + r + dd + w) / 5);
  document.getElementById('tts-n').textContent = score;

  let col, grade, cap, plan;
  if (score < 40) {
    col = '#d94040'; grade = 'Needs significant work'; cap = 'No allocation'; plan = 'Core only';
  } else if (score < 60) {
    col = '#d4891a'; grade = 'Developing'; cap = 'No allocation yet'; plan = 'Core recommended';
  } else if (score < 75) {
    col = '#d4891a'; grade = 'Progressing'; cap = '$10,000 – $25,000'; plan = 'Performance Track';
  } else if (score < 85) {
    col = '#00c87a'; grade = 'Proficient'; cap = '$25,000 – $50,000'; plan = 'Performance Track+';
  } else {
    col = '#00c87a'; grade = 'Elite'; cap = '$50,000 – $100,000+'; plan = 'Performance Track+';
  }

  document.getElementById('tts-n').style.color = col;
  const gb = document.getElementById('gbadge');
  gb.textContent = grade;
  gb.style.background = col === '#00c87a' ? 'rgba(0,200,122,0.09)' : 'rgba(212,137,26,0.11)';
  gb.style.color = col;
  document.getElementById('t-cap').textContent = cap;
  document.getElementById('t-cap').style.color = col;
  document.getElementById('t-plan').textContent = plan;
  document.getElementById('t-bar').style.width = Math.min(score, 100) + '%';
  document.getElementById('t-bar').style.background = col;
  drawRing(score, col);
}

// Dashboard P&L chart
let dashDone = false;
function initDash() {
  if (dashDone) return;
  dashDone = true;
  const days = Array.from({length: 30}, (_, i) => {
    const dt = new Date(2026, 1, 18 + i);
    return dt.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  });
  let cum = 0;
  const vals = days.map(() => { const d = (Math.random() - 0.38) * 700; cum += d; return Math.round(cum); });

  new Chart(document.getElementById('pnl-c'), {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        data: vals,
        borderColor: '#00c87a',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.35,
        fill: true,
        backgroundColor: 'rgba(0,200,122,0.05)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {display: false}},
      scales: {
        x: {
          ticks: {color: '#333d4d', font: {size: 9}, maxTicksLimit: 7, autoSkip: true},
          grid: {color: 'rgba(255,255,255,0.03)'},
          border: {display: false}
        },
        y: {
          ticks: {
            color: '#333d4d',
            font: {size: 9},
            callback: v => '$' + (v < 0 ? '-' : '') + Math.abs(Math.round(v)).toLocaleString()
          },
          grid: {color: 'rgba(255,255,255,0.03)'},
          border: {display: false}
        }
      }
    }
  });
}

// FAQ accordion
const FAQS = [
  {
    q: 'What is RGOS?',
    a: 'RGOS — the Risk Governance Operating System — is Teachabull\'s proprietary engine for evaluating trader behavior. It analyzes your live trade data across multiple dimensions and produces your Trader Track Score (TTS). The specific criteria and methodology within RGOS are proprietary and not disclosed publicly.'
  },
  {
    q: 'What is the TTS and what does it measure?',
    a: 'The Trader Track Score is a single composite number (0–100) that reflects the quality of your trading behavior as evaluated by RGOS. It considers factors including rule discipline, consistency, risk management, drawdown control, and performance quality. Your score updates daily based on live trade data.'
  },
  {
    q: 'How does capital allocation work?',
    a: 'Capital allocation is tied directly to your TTS and plan tier. Traders on Performance Track are eligible for allocation once their TTS reaches a qualifying level. Performance Track+ traders can access larger allocations. Exact thresholds are communicated to eligible traders privately. Allocations are reviewed on a regular cycle and adjust automatically with your score.'
  },
  {
    q: 'Can my allocation decrease?',
    a: 'Yes. Capital follows your TTS in both directions. A drop in score can result in a reduced allocation at the next review cycle. Significant or sustained risk violations may trigger an out-of-cycle review. Traders are notified before any allocation change takes effect.'
  },
  {
    q: 'What brokers are supported?',
    a: 'Current integrations include NinjaTrader, TradeStation, Interactive Brokers, Tradovate, and Apex Trader Funding. Additional brokers are added on a rolling basis. Core connects 1 account; Performance Track allows 3; Performance Track+ is unlimited.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Performance Track includes a 14-day free trial — no credit card required. Core is available immediately at $59/mo. Performance Track+ has a sales-assisted onboarding process; contact us to arrange a trial period.'
  },
  {
    q: 'How is this different from a prop firm challenge?',
    a: 'Prop firm challenges require passing a one-time evaluation, often under artificial time pressure. Teachabull evaluates your real trading behavior continuously — there is no single test to pass. Your allocation grows or contracts based on sustained, verified performance measured over time by RGOS.'
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes — upgrade or downgrade anytime from account settings. Upgrades apply immediately. Downgrades take effect at the next billing cycle. Downgrading from Performance Track may affect capital allocation eligibility depending on your current TTS.'
  }
];

const fl = document.getElementById('faq-l');
if (fl) {
  fl.innerHTML = FAQS.map((f, i) => `
    <div class="faq-i" id="fi-${i}">
      <div class="faq-q" onclick="tf(${i})">
        <span class="faq-qt">${f.q}</span>
        <svg class="faq-cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="faq-a">${f.a}</div>
    </div>`).join('');
}

function tf(i) {
  document.getElementById('fi-' + i).classList.toggle('open');
}

// Init
calc();
