import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, type Locale } from '@/lib/i18n/i18n-config'; // Importa i18n para acceder a defaultLocale y locales
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSiteContentAction } from '@/components/admin/actions';
import type { ContactPageContent } from '@/lib/placeholder-data';
import { defaultSiteContent } from '@/lib/placeholder-data';

// Props interface for the page component
interface ContactPageProps {
  params?: { lang?: Locale }; // Hacemos params y lang opcionales aquí
}

// Updated generateMetadata function with more robust lang handling
export async function generateMetadata(props: ContactPageProps = {}): Promise<Metadata> {
  // Asegura que 'params' siempre sea un objeto, incluso si 'props' es undefined/null
  const params = props.params || {};
  
  // Asegura que 'lang' siempre sea un valor válido de Locale o el defaultLocale
  const lang: Locale = (params.lang && i18n.locales.includes(params.lang as Locale))
    ? params.lang
    : i18n.defaultLocale;

  console.log(`[generateMetadata] Attempting to get site content for lang: ${lang}`);
  const siteContent = await getSiteContentAction();
  console.log(`[generateMetadata] siteContent received:`, JSON.stringify(siteContent, null, 2));

  // Ensure contactPage exists, otherwise use default
  const contactPage = siteContent?.contactPage || defaultSiteContent.contactPage;

  // Check if the specific lang property exists in pageTitle and subHeading
  const pageTitle = contactPage.pageTitle?.[lang] || "Contact Us";
  const description = contactPage.subHeading?.[lang] || "Get in touch with us.";

  console.log(`[generateMetadata] Final title: ${pageTitle}, Final description: ${description}`);

  return {
    title: pageTitle,
    description: description,
  };
}

// Updated ContactPage component with more robust lang handling
export default async function ContactPage(props: ContactPageProps = {}) {
  // Asegura que 'params' siempre sea un objeto, incluso si 'props' es undefined/null
  const params = props.params || {};

  // Asegura que 'lang' siempre sea un valor válido de Locale o el defaultLocale
  const lang: Locale = (params.lang && i18n.locales.includes(params.lang as Locale))
    ? params.lang
    : i18n.defaultLocale;

  console.log(`[ContactPage] Rendering for lang: ${lang}`);
  const dictionary = await getDictionary(lang);
  const siteContent = await getSiteContentAction();
  console.log(`[ContactPage] siteContent received:`, JSON.stringify(siteContent, null, 2));

  // Ensure contact exists, otherwise use default
  const contact = siteContent?.contactPage || defaultSiteContent.contactPage;

  const contactMethods = [
    {
      icon: Mail,
      title: contact.emailLabel?.[lang] || "Email Us",
      value: contact.emailValue || "", // CORREGIDO: Eliminado ?.[lang]
      href: `mailto:${contact.emailValue || ""}`,
    },
    {
      icon: Phone,
      title: contact.phoneLabel?.[lang] || "Call Us",
      value: contact.phoneValue || "", // CORREGIDO: Eliminado ?.[lang]
      href: `tel:${(contact.phoneValue || "").replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      title: contact.addressLabel?.[lang] || "Visit Us",
      value: contact.addressValue?.[lang] || "",
      href: "#",
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
          <Card key={method.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-accent/10 rounded-full text-accent mb-3">
                <method.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl text-primary">{method.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {method.href !== "#" ? (
                <Link href={method.href} className="text-muted-foreground hover:text-accent break-words">
                  {method.value}
                </Link>
              ) : (
                <p className="text-muted-foreground break-words">{method.value}</p>
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
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg">
          <Link href={`/${lang}/quote-request`}>
            <Send className="mr-2 h-5 w-5" /> {dictionary.requestAQuoteNow as string}
          </Link>
        </Button>
      </section>
    </div>
  );
}
