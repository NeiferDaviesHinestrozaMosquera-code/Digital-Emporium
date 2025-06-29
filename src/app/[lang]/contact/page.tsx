import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSiteContentAction } from '@/components/admin/actions';
import { defaultSiteContent } from '@/lib/placeholder-data';
import { i18n } from '@/lib/i18n/i18n-config';

// Función para obtener el idioma de forma segura
function getSafeLang(langParam: any): 'en' | 'es' | 'fr' {
  return i18n.locales.includes(langParam) 
    ? langParam as 'en' | 'es' | 'fr'
    : i18n.defaultLocale;
}


// Generar metadatos
export async function generateMetadata({
  params
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const lang = getSafeLang(params?.lang);
  const siteContent = await getSiteContentAction();
  const contact = siteContent?.contactPage || defaultSiteContent.contactPage;

  return {
    title: contact.pageTitle?.[lang] || "Contact Us",
    description: contact.subHeading?.[lang] || "Get in touch with us.",
  };
}

// Componente de página
export default async function ContactPage({
  params
}: {
  params: { lang: string }
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
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
          {contact.heading?.[lang] || "Get in Touch"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {contact.subHeading?.[lang] || "We're here to help and answer any question you might have. We look forward to hearing from you!"}
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
        {contactMethods.map((method) => (
          <Card 
            key={method.title}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-accent/10 rounded-full text-accent mb-3">
                <method.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl text-primary">
                {method.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {method.href !== "#" ? (
                <Link 
                  href={method.href} 
                  className="text-muted-foreground hover:text-accent break-words"
                >
                  {method.value}
                </Link>
              ) : (
                <p className="text-muted-foreground break-words">
                  {method.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="text-center py-10 bg-secondary/30 rounded-lg shadow">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          {contact.ctaHeading?.[lang] || "Ready to Start?"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          {contact.ctaDescription?.[lang] || "Reach out to discuss your project and get a personalized quote."}
        </p>
        <Button 
          asChild 
          size="lg" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
        >
          <Link href={`/${lang}/quote-request`}>
            <Send className="mr-2 h-5 w-5" />
            {dictionary.requestAQuoteNow as string}
          </Link>
        </Button>
      </section>
    </div>
  );
}
