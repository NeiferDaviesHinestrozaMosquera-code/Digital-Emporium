import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSiteContentAction } from '@/components/admin/actions';
import type { ContactPageContent } from '@/lib/placeholder-data';

// Props interface for the page component
interface ContactPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  // Always await params since it's a Promise in Next.js 15
  const { lang } = await params;
  
  try {
    const siteContent = await getSiteContentAction();
    return {
      title: siteContent.contactPage.pageTitle[lang] || "Contact Us",
      description: siteContent.contactPage.subHeading[lang] || "Get in touch with us.",
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Contact Us",
      description: "Get in touch with us.",
    };
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  // Always await params since it's a Promise in Next.js 15
  const { lang } = await params;
  
  try {
    const [dictionary, siteContent] = await Promise.all([
      getDictionary(lang),
      getSiteContentAction()
    ]);

    const contact = siteContent.contactPage;

    const contactMethods = [
      {
        icon: Mail,
        title: contact.emailLabel[lang] || 'Email',
        value: contact.emailValue || '',
        href: `mailto:${contact.emailValue || ''}`,
      },
      {
        icon: Phone,
        title: contact.phoneLabel[lang] || 'Phone',
        value: contact.phoneValue || '',
        href: `tel:${(contact.phoneValue || '').replace(/\s/g, '')}`,
      },
      {
        icon: MapPin,
        title: contact.addressLabel[lang] || 'Address',
        value: contact.addressValue[lang] || '',
        href: "#", // Placeholder for map link or directions
      },
    ];

    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            {contact.heading[lang] || 'Contact Us'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {contact.subHeading[lang] || 'Get in touch with us.'}
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
          {contactMethods.map((method, index) => (
            <Card key={`${method.title}-${index}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full text-accent mb-3">
                  <method.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-primary">{method.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {method.href !== "#" && method.href !== "mailto:" && method.href !== "tel:" ? (
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
            {contact.ctaHeading[lang] || 'Ready to get started?'}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {contact.ctaDescription[lang] || 'Contact us today for a free consultation.'}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg">
            <Link href={`/${lang}/quote-request`}>
              <Send className="mr-2 h-5 w-5" />
              {(dictionary.requestAQuoteNow as string) || 'Request a Quote Now'}
            </Link>
          </Button>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error rendering contact page:', error);
    
    // Fallback UI in case of error
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us.
          </p>
        </header>
        
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            We're experiencing technical difficulties. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
