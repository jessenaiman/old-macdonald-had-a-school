import Link from "next/link";
import styles from "./SiteChrome.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <nav className={styles.footerPrimary} aria-label="Site links">
          <Link href="/lessons">Browse all lessons</Link>
          <Link href="/#browse-by-subject">Browse by subject</Link>
          <Link href="/search">Search lessons</Link>
          <Link href="/about">About</Link>
          <Link href="/branding">Brand &amp; cast guide</Link>
        </nav>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Old MacDonald Had a School</p>
          <nav className={styles.footerLegal} aria-label="Legal and contact links">
            <Link href="/about#privacy-policy">Privacy Policy</Link>
            <Link href="/about#terms-of-use">Terms of Use</Link>
            <Link href="/about#contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
