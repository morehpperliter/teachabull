const PAGES = ['home','calc','dash','pricing','faq'];

function go(id) {
  PAGES.forEach(p => document.getElementById('p-' + p).classList.toggle('on', p === id));
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('on', PAGES[i] === id));
  if (id === 'dash') initDash();
}

// Ticker
const TDATA = [
  {s:'ES',    v:'5,421.25',  c:'+0.42%', u:1},
  {s:'NQ',    v:'19,884.50', c:'+0.61%', u:1},
  {s:'CL',    v:'78.34',     c:'−0.18%', u:0},
  {s:'GC',    v:'2,318.10',  c:'+0.29%', u:1},
  {s:'BTC',   v:'67,420',    c:'+1.14%', u:1},
  {s:'SPY',   v:'541.22',    c:'+0.38%', u:1},
  {s:'EURUSD',v:'1.0832',    c:'−0.12%', u:0},
  {s:'TLT',   v:'94.17',     c:'+0.21%', u:1},
  {s:'VIX',   v:'14.82',     c:'−0.90%', u:0},
  {s:'ETH',   v:'3,512',     c:'+0.87%', u:1}
];
const tEl = document.getElementById('tkr');
if (tEl) {
  tEl.innerHTML = [...TDATA, ...TDATA]
    .map(t => `<span class="t-item"><span class="t-sym">${t.s}</span><span class="t-val">${t.v}</span><span class="${t.u ? 't-up' : 't-dn'}">${t.c}</span></span>`)
    .join('');
}

// Ring chart
function drawRing(score, col) {
  const c = document.getElementById('rc');
  if (!c) return;
  const ctx = c.getContext('2d'), cx = 65, cy = 65, r = 52, lw = 7;
  ctx.clearRect(0, 0, 130, 130);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = lw; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 100));
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
}

// Calculator
function calc() {
  const vals = {
    d:  +document.getElementById('s-d').value,
    c:  +document.getElementById('s-c').value,
    r:  +document.getElementById('s-r').value,
    dd: +document.getElementById('s-dd').value,
    w:  +document.getElementById('s-w').value
  };

  Object.entries(vals).forEach(([k, v]) => {
    document.getElementById('v-' + k).textContent = v;
    document.getElementById('bd-' + k).textContent = v;
  });

  const score = Math.round((vals.d + vals.c + vals.r + vals.dd + vals.w) / 5);
  document.getElementById('tts-n').textContent = score;

  let col, grade, cap, plan;
  if (score < 40) {
    col = '#9e3d3d'; grade = 'Needs work'; cap = 'No allocation'; plan = 'Core only';
  } else if (score < 60) {
    col = '#b87333'; grade = 'Developing'; cap = 'No allocation yet'; plan = 'Core recommended';
  } else if (score < 75) {
    col = '#b87333'; grade = 'Progressing'; cap = '$10,000 – $25,000'; plan = 'Performance Track';
  } else if (score < 85) {
    col = '#4a7fa5'; grade = 'Proficient'; cap = '$25,000 – $50,000'; plan = 'Performance Track+';
  } else {
    col = '#2d9e6b'; grade = 'Elite'; cap = '$50,000 – $100,000+'; plan = 'Performance Track+';
  }

  document.getElementById('tts-n').style.color = col;

  const gp = document.getElementById('grade-pill');
  gp.textContent = grade;
  const bgMap = {'#2d9e6b':'rgba(45,158,107,0.12)','#4a7fa5':'rgba(74,127,165,0.12)','#b87333':'rgba(184,115,51,0.12)','#9e3d3d':'rgba(158,61,61,0.12)'};
  gp.style.background = bgMap[col] || 'rgba(74,127,165,0.12)';
  gp.style.color = col;

  document.getElementById('tier-cap').textContent = cap;
  document.getElementById('tier-cap').style.color = col;
  document.getElementById('tier-plan').textContent = plan;
  document.getElementById('tier-bar').style.width = Math.min(score, 100) + '%';
  document.getElementById('tier-bar').style.background = col;
  drawRing(score, col);
}

// Dashboard P&L chart
let dashReady = false;
function initDash() {
  if (dashReady) return;
  dashReady = true;

  const days = Array.from({length: 30}, (_, i) => {
    const d = new Date(2026, 1, 18 + i);
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  });
  let cum = 0;
  const vals = days.map(() => { cum += (Math.random() - 0.38) * 700; return Math.round(cum); });

  new Chart(document.getElementById('pnl-c'), {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        data: vals,
        borderColor: '#4a7fa5',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(74,127,165,0.06)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#4a5262', font: { size: 9 }, maxTicksLimit: 7, autoSkip: true },
          grid: { color: 'rgba(255,255,255,0.03)' },
          border: { display: false }
        },
        y: {
          ticks: {
            color: '#4a5262',
            font: { size: 9 },
            callback: v => '$' + (v < 0 ? '-' : '') + Math.abs(Math.round(v)).toLocaleString()
          },
          grid: { color: 'rgba(255,255,255,0.03)' },
          border: { display: false }
        }
      }
    }
  });
}

// FAQ
const FAQS = [
  {
    q: 'What is RGOS?',
    a: "RGOS — the Risk Governance Operating System — is Teachabull's proprietary engine for evaluating trader behavior. It analyzes your live trade data across multiple dimensions and produces your Trader Track Score. The specific criteria and methodology are proprietary and not publicly disclosed."
  },
  {
    q: 'What does the TTS measure?',
    a: 'The Trader Track Score is a composite 0–100 number reflecting the quality of your trading behavior as assessed by RGOS. It considers rule discipline, consistency, risk management, drawdown control, and performance quality. It updates daily from live trade data.'
  },
  {
    q: 'How does capital allocation work?',
    a: 'Allocation is tied to your TTS and plan tier. Traders on Performance Track are eligible once their score reaches a qualifying level. Performance Track+ traders can access larger allocations. Exact thresholds are communicated privately to eligible traders. Allocations are reviewed on a regular cycle.'
  },
  {
    q: 'Can my allocation decrease?',
    a: 'Yes. Capital follows your TTS in both directions. A score drop can trigger a reduced allocation at the next review. Significant risk violations may trigger an immediate out-of-cycle review. You are notified before any change takes effect.'
  },
  {
    q: 'What brokers are supported?',
    a: 'Current integrations: NinjaTrader, TradeStation, Interactive Brokers, Tradovate, and Apex Trader Funding. More are added on a rolling basis. Core: 1 account. Performance Track: 3. Performance Track+: unlimited.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Performance Track includes a 14-day free trial — no credit card required. Core is available at $59/mo immediately. Performance Track+ has a sales-assisted onboarding process.'
  },
  {
    q: 'How is this different from a prop firm challenge?',
    a: "Prop challenges require passing a one-time evaluation under artificial conditions. Teachabull evaluates your real behavior continuously. There is no single test. Your allocation grows or contracts based on sustained, verified performance over time."
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes — upgrade or downgrade anytime from account settings. Upgrades apply immediately. Downgrades take effect at the next billing cycle.'
  }
];

const fs = document.getElementById('faq-stack');
if (fs) {
  fs.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" id="fi-${i}">
      <button class="faq-trigger" onclick="tf(${i})">
        <span class="faq-trigger-text">${f.q}</span>
        <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="faq-body">${f.a}</div>
    </div>`).join('');
}

function tf(i) {
  document.getElementById('fi-' + i).classList.toggle('open');
}

// Init
calc();
