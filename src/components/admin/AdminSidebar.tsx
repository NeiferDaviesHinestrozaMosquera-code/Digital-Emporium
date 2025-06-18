
"use client";

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, MessageSquare, Users, CodeXml, LogOut, Briefcase, Settings } from 'lucide-react'; // Added Settings
import type { Locale } from '@/lib/i18n/i18n-config';

const getAdminNavLinks = (lang: Locale) => [
  { href: `/${lang}/admin`, label: 'Dashboard', icon: LayoutDashboard },
  { href: `/${lang}/admin/services`, label: 'Services', icon: ShoppingBag },
  { href: `/${lang}/admin/testimonials`, label: 'Testimonials', icon: Users },
  { href: `/${lang}/admin/projects`, label: 'Projects', icon: Briefcase },
  { href: `/${lang}/admin/inquiries`, label: 'Inquiries', icon: MessageSquare },
  { href: `/${lang}/admin/site-settings`, label: 'Site Settings', icon: Settings }, // New link
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as Locale || 'en';
  const adminNavLinks = getAdminNavLinks(lang);

  return (
    <aside className="w-64 bg-card text-card-foreground border-r border-border flex flex-col fixed top-0 left-0 h-full pt-4">
      <div className="px-6 mb-8">
        <Link href={`/${lang}/admin`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <CodeXml className="h-7 w-7" />
          <span className="font-bold text-xl">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-grow px-4 space-y-2">
        {adminNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              pathname === link.href || (link.href !== `/${lang}/admin` && pathname.startsWith(link.href))
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border mt-auto">
         <Link
            href={`/${lang}/`}
            className={cn(
              "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Back to Site
          </Link>
      </div>
    </aside>
  );
}

    