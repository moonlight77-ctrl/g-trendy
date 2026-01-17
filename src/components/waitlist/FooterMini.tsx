import Link from 'next/link'; // <--- N'oubliez pas l'import

export default function FooterMini() {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-600">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-8">
        <p>© {new Date().getFullYear()} GrandDressing</p>
        <ul className="flex items-center gap-5">
          
          {/* Utilisez Link ici pour la navigation interne */}
          <li>
            <Link href="/mentions" className="hover:text-emerald-700 transition-colors">
              Mentions légales
            </Link>
          </li>
          
          {/* Les mailto et liens externes restent des <a> */}
          <li>
            <a href="mailto:gdcreativebrand@gmail.com" className="hover:text-emerald-700 transition-colors">
              Contact
            </a>
          </li>
          <li>
            <a 
              href="https://www.instagram.com/gdcreativebrand?igsh=MWZkamQ2anNuYnIzaA=="
              target="_blank" 
              rel="noopener noreferrer" // Sécurité recommandée pour target blank
              className="hover:text-emerald-700 transition-colors"
            >
              Instagram
            </a>
          </li>
                    <li>
            <a 
              href="https://www.tiktok.com/@gdcreativebrand?_r=1&_t=ZN-939rSfzYDeI"
              target="_blank" 
              rel="noopener noreferrer" // Sécurité recommandée pour target blank
              className="hover:text-emerald-700 transition-colors"
            >
             tiktok
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}