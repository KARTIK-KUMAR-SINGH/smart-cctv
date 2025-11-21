import React from 'react';

export default function Home(){
  return (
    <div className="home-root">
      <style>{`
        :root{
          --bg:#0f1724;
          --card:#0b1220;
          --accent:#00d1ff;
          --muted:#9aa4b2;
          --glass: rgba(255,255,255,0.03);
          --glass-2: rgba(255,255,255,0.02);
        }

        /* Page layout */
        .home-root{
          min-height: 100vh;
          box-sizing: border-box;
          padding: clamp(20px, 4vw, 48px);
          background:
            radial-gradient(800px 400px at 10% 10%, rgba(0,209,255,0.06), transparent 8%),
            radial-gradient(600px 300px at 90% 90%, rgba(0,200,255,0.03), transparent 10%),
            var(--bg);
          color: #e6eef6;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        /* Card container */
        .cctv-card{
          width: 100%;
          max-width: 1100px;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), var(--glass-2));
          border-radius: 14px;
          padding: clamp(18px, 2.4vw, 34px);
          box-shadow:
            0 8px 30px rgba(2,6,23,0.6),
            0 1px 0 rgba(255,255,255,0.02) inset;
          border: 1px solid rgba(255,255,255,0.03);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(6px) saturate(1.05);
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: clamp(16px, 2vw, 28px);
          align-items: start;
        }

        /* Bright "lighting" highlight in front */
        .cctv-card::before{
          content: "";
          position: absolute;
          left: -10%;
          top: -25%;
          width: 50%;
          height: 200%;
          transform: rotate(-18deg);
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,209,255,0.06));
          filter: blur(40px) saturate(1.05);
          pointer-events: none;
          mix-blend-mode: screen;
        }

        header.title{
          margin: 0 0 12px 0;
          display:flex;
          gap:12px;
          align-items:center;
        }

        h1{
          font-size: clamp(20px, 2.6vw, 28px);
          margin:0;
          letter-spacing: -0.02em;
          color: #f8fbff;
        }

        .badge{
          font-size: 12px;
          padding:6px 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(0,209,255,0.12), rgba(0,114,255,0.06));
          color: var(--accent);
          border: 1px solid rgba(0,209,255,0.08);
        }

        /* Left column — description & features */
        .left{
          padding-right: 6px;
        }

        p.lead{
          margin: 0 0 18px 0;
          color: var(--muted);
          line-height: 1.6;
          font-size: 15px;
        }

        ul.features{
          list-style: none;
          padding: 0;
          margin: 0 0 18px 0;
          display: grid;
          gap:10px;
        }

        ul.features li{
          background: linear-gradient(180deg, rgba(255,255,255,0.012), transparent);
          border: 1px solid rgba(255,255,255,0.02);
          padding: 10px 12px;
          border-radius: 10px;
          display:flex;
          gap:10px;
          align-items:center;
          font-size: 14px;
          color: #e6eef6;
        }

        .dot{
          min-width:38px;
          height:38px;
          display:grid;
          place-items:center;
          border-radius:8px;
          background: linear-gradient(180deg, rgba(0,209,255,0.12), rgba(0,114,255,0.06));
          color:var(--accent);
          font-weight:700;
          font-size:13px;
          border: 1px solid rgba(0,209,255,0.06);
        }

        /* Right column — visual preview / controls */
        .right{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .preview{
          background: linear-gradient(180deg, rgba(10,14,20,0.45), rgba(6,10,16,0.6));
          border-radius: 10px;
          padding: 12px;
          min-height: 220px;
          display:flex;
          flex-direction:column;
          gap:10px;
          justify-content:center;
          align-items:center;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .preview .placeholder{
          width: 100%;
          height: 160px;
          border-radius:8px;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.15), rgba(255,255,255,0.02)),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0 8px, transparent 8px 16px);
          display:flex;
          align-items:center;
          justify-content:center;
          color: var(--muted);
          font-size: 14px;
          border: 1px dashed rgba(255,255,255,0.03);
          width: 100%;
        }

        .controls{
          width:100%;
          display:flex;
          gap:8px;
          justify-content:space-between;
        }

        .btn{
          flex:1;
          padding:10px 12px;
          border-radius: 999px;
          border: none;
          cursor:pointer;
          background: linear-gradient(90deg, var(--accent), #2dd4bf);
          color: #02212a;
          font-weight: 600;
          box-shadow: 0 6px 18px rgba(0,209,255,0.06);
          transition: transform .15s ease, box-shadow .15s ease;
        }

        .btn.secondary{
          background: transparent;
          color: #d8e9f2;
          border: 1px solid rgba(255,255,255,0.04);
          box-shadow: none;
        }

        .btn:active{ transform: translateY(1px); }
        .btn:hover{ transform: translateY(-3px); }

        /* Footer small text */
        .meta{
          margin-top:6px;
          font-size:12px;
          color: var(--muted);
        }

        /* Responsive stack */
        @media (max-width: 980px){
          .cctv-card{
            grid-template-columns: 1fr;
          }
          .right{ order: -1; }
        }
      `}</style>

      <div className="cctv-card" role="region" aria-label="Smart CCTV overview">
        <div className="left">
          <header className="title">
            <h1>About Our Smart CCTV</h1>
            <span className="badge" aria-hidden>Live • AI</span>
          </header>

          <p className="lead">
            Welcome to the Smart CCTV dashboard. This app monitors live camera feeds, detects crowd density,
            raises alerts, and provides control interfaces for PTZ/servo integration. (Replace this content
            with your project details and images.)
          </p>

          <ul className="features" aria-label="Key features">
            <li><span className="dot">1</span><div><strong>Real-time detection</strong><div style={{color:'var(--muted)', fontSize:13}}>YOLO-based people & object detection</div></div></li>
            <li><span className="dot">2</span><div><strong>Crowd density & alerts</strong><div style={{color:'var(--muted)', fontSize:13}}>Thresholds, email/push notifications, & logs</div></div></li>
            <li><span className="dot">3</span><div><strong>PTZ / Servo control</strong><div style={{color:'var(--muted)', fontSize:13}}>Smooth control & preset positions for follow-up</div></div></li>
          </ul>

          <div className="meta">Tip: keep UI controls high-contrast and place critical alerts at the top of the dashboard for instant attention.</div>
        </div>

        <aside className="right" aria-hidden>
          <div className="preview">
            <div className="placeholder">Live preview / camera tile (use an <code>&lt;img&gt;</code> or video element here)</div>
            <div className="controls">
              <button className="btn">Open Live Feed</button>
              <button className="btn secondary">Open Alerts</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
