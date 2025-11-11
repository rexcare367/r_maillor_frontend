import Link from 'next/link';
import { Copyright } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gold-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className='flex flex-col justify-between'>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">Meillor</h3>
            <p className="text-sm text-muted-foreground">
              Discover and collect rare coins from around the world.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Copyright className="h-4 w-4" />
          <span>{currentYear} Meillor. All rights reserved.</span>
        </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/coins" className="text-muted-foreground hover:text-foreground transition-colors">
                  Coins
                </Link>
              </li>
              <li>
              <Link href="/membership" className="text-muted-foreground hover:text-foreground transition-colors">Pricing &amp; Plans</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

