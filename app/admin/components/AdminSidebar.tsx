"use client";
import { useState } from "react";

// ─── tipos de item ────────────────────────────────────────────────────────────
export type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

// ─── ícones inline simples (sem dependência extra) ────────────────────────────
const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .25s" }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// ─── componente principal ─────────────────────────────────────────────────────
type Props = {
  items: SidebarItem[];
  defaultActiveId?: string;
};

export default function AdminSidebar({ items, defaultActiveId }: Props) {
  const [activeId, setActiveId]   = useState(defaultActiveId ?? items[0]?.id);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = items.find((i) => i.id === activeId);

  return (
    <>
      {/* ── estilos ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --black:   #0a0a0a;
          --surface: #111111;
          --border:  #1f1f1f;
          --gold-dim: #8a6f2e;
          --text:    #e8e2d5;
          --muted:   #5a5550;
          --sidebar-w: 240px;
          --sidebar-collapsed: 64px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--black); }

        .admin-shell {
          display: flex;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
        }

        /* ── sidebar ── */
        .sidebar {
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
          width: var(--sidebar-w);
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transition: width .3s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
        }
        .sidebar.collapsed { width: var(--sidebar-collapsed); }

        .sidebar-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 16px;
          border-bottom: 1px solid var(--border);
          min-height: 64px;
          white-space: nowrap; overflow: hidden;
        }
        .sidebar-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600;
          color: var(--gold);
          letter-spacing: .04em;
          opacity: 1; transition: opacity .2s;
        }
        .collapsed .sidebar-logo { opacity: 0; pointer-events: none; }

        .collapse-btn {
          background: none; border: none; cursor: pointer;
          color: var(--muted); padding: 4px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: color .15s, background .15s;
          flex-shrink: 0;
        }
        .collapse-btn:hover { color: var(--gold); background: rgba(201,168,76,.08); }

        .sidebar-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px 8px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 6px;
          cursor: pointer; white-space: nowrap; overflow: hidden;
          border: 1px solid transparent;
          transition: background .15s, border-color .15s, color .15s;
          position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,.04); }
        .nav-item.active {
          background: rgba(201,168,76,.1);
          border-color: rgba(201,168,76,.2);
          color: var(--gold);
        }
        .nav-icon {
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px;
        }
        .nav-label {
          font-size: 13px; font-weight: 400; letter-spacing: .01em;
          opacity: 1; transition: opacity .2s;
        }
        .collapsed .nav-label { opacity: 0; }

        /* tooltip no collapsed */
        .nav-item .tooltip {
          display: none;
          position: absolute; left: calc(100% + 10px); top: 50%;
          transform: translateY(-50%);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 4px 10px; border-radius: 4px;
          font-size: 12px; color: var(--text);
          white-space: nowrap;
          pointer-events: none;
        }
        .collapsed .nav-item:hover .tooltip { display: block; }

        /* gold divider entre grupos */
        .nav-divider {
          height: 1px; background: var(--border);
          margin: 8px 4px;
        }

        .sidebar-footer {
          padding: 16px 8px;
          border-top: 1px solid var(--border);
          font-size: 11px; color: var(--muted);
          text-align: center;
          white-space: nowrap; overflow: hidden;
          transition: opacity .2s;
        }
        .collapsed .sidebar-footer { opacity: 0; }

        /* ── main ── */
        .admin-main {
          flex: 1;
          margin-left: var(--sidebar-w);
          transition: margin-left .3s cubic-bezier(.4,0,.2,1);
          min-height: 100vh;
        }
        .admin-main.collapsed { margin-left: var(--sidebar-collapsed); }

        .admin-topbar {
          height: 64px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center;
          padding: 0 28px;
          gap: 12px;
        }
        .topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600;
          color: var(--gold);
          letter-spacing: .03em;
        }
        .topbar-badge {
          font-size: 10px; letter-spacing: .08em; text-transform: uppercase;
          background: rgba(201,168,76,.15);
          border: 1px solid rgba(201,168,76,.3);
          color: var(--gold-dim);
          padding: 2px 8px; border-radius: 99px;
        }

        .admin-content {
          padding: 32px 28px;
        }

        /* ── mobile overlay ── */
        .mobile-toggle {
          display: none;
          position: fixed; top: 14px; left: 14px; z-index: 200;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px; cursor: pointer; color: var(--gold);
          transition: background .15s;
        }
        .mobile-toggle:hover { background: rgba(201,168,76,.1); }

        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; z-index: 90;
          background: rgba(0,0,0,.6);
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform .3s cubic-bezier(.4,0,.2,1), width .3s;
          }
          .sidebar.mobile-visible { transform: translateX(0); width: var(--sidebar-w) !important; }
          .sidebar-overlay.visible { display: block; }
          .admin-main { margin-left: 0 !important; }
          .mobile-toggle { display: flex; }
          .collapse-btn { display: none; }
        }
      `}</style>

      {/* mobile toggle */}
      <button className="mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
        <IconMenu />
      </button>

      {/* overlay mobile */}
      <div
        className={`sidebar-overlay${mobileOpen ? " visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="admin-shell">
        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-visible" : ""}`}>
          <div className="sidebar-header">
            <span className="sidebar-logo">Admin Panel</span>
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Colapsar menu">
              <IconChevron open={!collapsed} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {items.map((item, idx) => (
              <div key={item.id}>
                {/* divisor visual a cada 4 itens */}
                {idx > 0 && idx % 4 === 0 && <div className="nav-divider" />}
                <div
                  className={`nav-item${activeId === item.id ? " active" : ""}`}
                  onClick={() => { setActiveId(item.id); setMobileOpen(false); }}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveId(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  <span className="tooltip">{item.label}</span>
                </div>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">v1.0 · Admin</div>
        </aside>

        {/* ── MAIN ── */}
        <main className={`admin-main${collapsed ? " collapsed" : ""}`}>
          <div className="admin-topbar">
            <span className="topbar-title">{active?.label}</span>
            <span className="topbar-badge">admin</span>
          </div>
          <div className="admin-content">
            {active?.component}
          </div>
        </main>
      </div>
    </>
  );
}