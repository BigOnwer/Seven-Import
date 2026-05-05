"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Heart, LogIn, LogOut, UserCircle } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Lançamentos", href: "/lancamentos" },
  { label: "Nike", href: "/produtos?categoria=Nike" },
  { label: "Jordan", href: "/produtos?categoria=Jordan" },
  { label: "Outlet", href: "/produtos?sale=true" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    showToast("Você saiu da conta.", "info", "👋");
  };

  return (
    <>
      <nav style={{
        background: "rgba(10,10,10,0.96)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(245,197,24,0.12)",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        {/* Promo bar */}
        <div style={{
          background: "var(--gold)", color: "var(--black)", textAlign: "center",
          fontSize: 11, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
          letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 16px",
        }}>
          ✈ Envio para todo o Brasil · 12x sem juros · Cupom{" "}
          <span style={{ background: "rgba(0,0,0,0.15)", padding: "0 6px", borderRadius: 2 }}>SEVEN10</span> → 10% OFF
        </div>

        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 64,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <CrownSVG />
            <div>
              <div className="font-display" style={{ fontSize: 26, color: "var(--gold)", lineHeight: 1, letterSpacing: "0.05em" }}>SEVEN</div>
              <div className="font-condensed" style={{ fontSize: 9, color: "var(--gray)", letterSpacing: "0.3em", textTransform: "uppercase", lineHeight: 1 }}>IMPORT BR</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 22 }} className="nav-desktop">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="nav-link"
                style={{ color: pathname === l.href ? "var(--gold)" : undefined }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/busca" style={{ color: "var(--gray)", display: "flex", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
              <Search size={18} />
            </Link>

            {/* Wishlist */}
            <Link href="/favoritos" style={{ color: "var(--gray)", position: "relative", display: "flex", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
              <Heart size={18} />
              {wishCount > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, background: "#e74c3c", color: "#fff", fontSize: 9, fontWeight: 700, width: 15, height: 15, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{wishCount}</span>
              )}
            </Link>

            {/* User menu */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenu(!userMenu)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
                {user ? (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--gold) 0%, #c9a000 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                    fontSize: 12, color: "var(--black)", letterSpacing: "0.03em",
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <UserCircle size={20} color="var(--gray)" />
                )}
              </button>

              {/* Dropdown */}
              {userMenu && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 10px)",
                  background: "var(--black-2)", border: "1px solid rgba(245,197,24,0.2)",
                  borderRadius: 10, minWidth: 200, overflow: "hidden",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  zIndex: 200,
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", letterSpacing: "0.03em" }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 2 }}>{user.email}</div>
                      </div>
                      {[
                        { label: "Minha conta", href: "/conta" },
                        { label: "Meus pedidos", href: "/conta" },
                        { label: "Favoritos", href: "/favoritos" },
                      ].map(item => (
                        <Link key={item.label} href={item.href}
                          onClick={() => setUserMenu(false)}
                          style={{
                            display: "block", padding: "11px 16px",
                            textDecoration: "none", fontSize: 13,
                            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600,
                            letterSpacing: "0.05em", color: "var(--gray)",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            transition: "color .2s, background .2s",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; (e.currentTarget as HTMLElement).style.background = "rgba(245,197,24,0.05)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--gray)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          {item.label}
                        </Link>
                      ))}
                      <button onClick={handleLogout}
                        style={{
                          width: "100%", padding: "11px 16px", background: "transparent",
                          border: "none", textAlign: "left", cursor: "pointer",
                          fontSize: 13, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600,
                          letterSpacing: "0.05em", color: "#e74c3c",
                          display: "flex", alignItems: "center", gap: 8,
                          transition: "background .2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(231,76,60,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <LogOut size={13} /> Sair da conta
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setUserMenu(false)}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", textDecoration: "none", fontSize: 13, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: "0.06em", color: "var(--gold)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,197,24,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <LogIn size={14} /> Entrar na conta
                      </Link>
                      <Link href="/cadastro" onClick={() => setUserMenu(false)}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", textDecoration: "none", fontSize: 13, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, letterSpacing: "0.06em", color: "var(--gray)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--white)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--gray)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        Criar conta grátis
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/carrinho" style={{ color: "var(--white)", position: "relative", display: "flex" }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, background: "var(--gold)", color: "var(--black)", fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </Link>

            <button className="nav-mobile-btn" onClick={() => setOpen(true)}
              style={{ background: "none", border: "none", color: "var(--white)", cursor: "pointer", display: "none" }}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Click outside to close user menu */}
      {userMenu && <div onClick={() => setUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />}

      {/* Mobile Drawer */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.75)" }} onClick={() => setOpen(false)}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 300, background: "var(--black-2)", borderLeft: "1px solid rgba(245,197,24,0.2)", padding: 32, display: "flex", flexDirection: "column" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "var(--black)" }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "var(--white)" }}>{user.name.split(" ")[0]}</div>
                    <div style={{ fontSize: 10, color: "var(--gray)" }}>Membro Seven</div>
                  </div>
                </div>
              ) : (
                <div className="font-display" style={{ fontSize: 20, color: "var(--gold)" }}>SEVEN</div>
              )}
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--white)", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
              {navLinks.map(l => (
                <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="font-condensed"
                  style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--white)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "13px 0", transition: "color .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
                  {l.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="font-condensed"
                  style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e74c3c", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "13px 0", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
                  <LogOut size={16} /> Sair
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="font-condensed"
                  style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "13px 0" }}>
                  Entrar / Cadastrar
                </Link>
              )}
            </div>

            <Link href="/carrinho" onClick={() => setOpen(false)} className="btn-gold"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 4, textDecoration: "none", fontSize: 14, marginTop: 20 }}>
              <ShoppingBag size={16} /> Carrinho {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:1024px){ .nav-desktop{display:none!important} .nav-mobile-btn{display:flex!important} }
      `}</style>
    </>
  );
}

function CrownSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M4 22L8 10L16 18L24 10L28 22H4Z" fill="#F5C518" />
      <circle cx="8" cy="10" r="2.5" fill="#F5C518" />
      <circle cx="16" cy="8" r="2.5" fill="#F5C518" />
      <circle cx="24" cy="10" r="2.5" fill="#F5C518" />
      <rect x="4" y="22" width="24" height="4" rx="1" fill="#C9A000" />
    </svg>
  );
}
