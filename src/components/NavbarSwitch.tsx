'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import NavbarLanding from './NavbarLanding';

export default function NavbarSwitch() {
  const pathname = usePathname();

  // Ici on décide : landing uniquement sur /waitlist
  const isWaitlist = pathname?.startsWith('/waitlist');

  if (isWaitlist) {
    return <NavbarLanding editionLabel=" – accès anticipé" />;
  }

  return <Navbar />;
}
