import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSiteContentAction } from '@/components/admin/actions';
import { defaultSiteContent } from '@/lib/placeholder-data';
import { i18n } from '@/lib/i18n/i18n-config';

// Validar idioma de forma segura
function getSafeLang(lang: string | undefined): Locale {
  return lang && i18n.locales.includes(lang as Locale) 
    ? lang as Locale 
    : i18n.defaultLocale;
}

export async function generateMetadata({
  params
}: {
  params?: { lang?: string }
}): Promise<Metadata> {
  const lang = getSafeLang(params?.lang);
  const siteContent = await getSiteContentAction();
  const contact = siteContent?.contactPage || defaultSiteContent.contactPage;
  
  return {
    title: contact.pageTitle?.[lang] || "Contact Us",
    description: contact.subHeading?.[lang] || "Get in touch with us.",
  };
}

export default async function ContactPage({
  params
}: {
  params?: { lang?: string }
}) {
  const lang = getSafeLang(params?.lang);
  const dictionary = await getDictionary(lang);
  const siteContent = await getSiteContentAction();
  const contact = siteContent?.contactPage || defaultSiteContent.contactPage;

  const contactMethods = [
    { 
      icon: Mail, 
      title: contact.emailLabel?.[lang] || "Email Us", 
      value: contact.emailValue || "", 
      href: `mailto:${contact.emailValue}` 
    },
    { 
      icon: Phone, 
      title: contact.phoneLabel?.[lang] || "Call Us", 
      value: contact.phoneValue || "", 
      href: `tel:${(contact.phoneValue || '').replace(/\s/g, '')}` 
    },
    { 
      icon: MapPin, 
      title: contact.addressLabel?.[lang] || "Visit Us", 
      value: contact.addressValue?.[lang] || "", 
      href: "#" 
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* ... (resto del componente permanece igual) ... */}
    </div>
  );
}
