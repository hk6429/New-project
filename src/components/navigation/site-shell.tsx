"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "/adventure", label: "冒險地圖" },
  { href: "/join", label: "加入課堂" },
  { href: "/review", label: "錯題復習" },
  { href: "/teacher", label: "教師入口" },
];

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const previousPathname = useRef(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>("#main-content")?.focus());
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">跳到主要內容</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="借代偵探學院首頁">
          <span className="brand-mark" aria-hidden="true">代</span>
          <span>借代偵探學院</span>
        </Link>
        <button
          ref={menuButtonRef}
          className="nav-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span aria-hidden="true">{isMenuOpen ? "×" : "☰"}</span>
          <span>{isMenuOpen ? "關閉選單" : "開啟選單"}</span>
        </button>
        <nav id="primary-navigation" className={isMenuOpen ? "is-open" : ""} aria-label="主要導覽">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="site-content">{children}</div>
      <footer className="site-footer">
        <div>
          <Link className="footer-brand" href="/">借代偵探學院</Link>
          <p>從詞語線索出發，練習看懂語言背後的關係。</p>
        </div>
        <nav aria-label="頁尾導覽">
          <Link href="/adventure">學習地圖</Link>
          <Link href="/join">加入課堂</Link>
          <Link href="/teacher">教師控制臺</Link>
        </nav>
      </footer>
    </div>
  );
}
