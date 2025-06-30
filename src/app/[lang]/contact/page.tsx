import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSiteContentAction } from '@/components/admin/actions';
import { defaultSiteContent } from '@/lib/placeholder-data';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';

// Función para validar idioma de forma segura
function getSafeLang(lang: string | undefined): Locale { 
  if (!lang) return i18n.defaultLocale; 
  return i18n.locales.includes(lang as Locale) ? (lang as Locale) : i18n.defaultLocale;
}

interface ContactPageParams {
  params: Promise<{ lang: string }> | { lang: string }; 
}

// Add generateStaticParams to ensure proper static generation
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }));
}

export async function generateMetadata({ params }: ContactPageParams): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const lang = getSafeLang(params?.lang);
    
    const siteContent = await getSiteContentAction();
    const contact = siteContent?.contactPage || defaultSiteContent.contactPage;
    
    return {
      title: contact.pageTitle?.[lang] || "Contact Us",
      description: contact.subHeading?.[lang] || "Get in touch with us.",
    };
  } catch (error) {
    console.error('Error generating metadata for contact page:', error);
    return {
      title: "Contact Us",
      description: "Get in touch with us.",
    };
  }
}

export default async function ContactPage({ params }: ContactPageParams) {
  try {
    const resolvedParams = await params; 
    const lang = getSafeLang(params?.lang);
    
     const [dictionary, siteContent] = await Promise.all([
      getDictionary(lang),
      getSiteContentAction().catch(() => null) // Maneja errores en getSiteContentAction
    ]);
    
    const contact = siteContent?.contactPage || defaultSiteContent.contactPage;

      const pageTitle = contact.pageTitle?.[lang] || dictionary.contact?.title || "Contact Us";
    const subHeading = contact.subHeading?.[lang] || dictionary.contact?.subtitle || "Get in touch with us";
    
    const contactMethods = [
      {
        icon: Mail,
         title: contact.emailLabel?.[lang] || dictionary.contact?.form?.email || "Email Us",
        value: contact.emailValue || "",
        href: `mailto:${contact.emailValue || ''}`
      },
      {
        icon: Phone,
        title: contact.phoneLabel?.[lang] || dictionary.contact?.form?.phone ||"Call Us",
        value: contact.phoneValue || "",
        href: `tel:${(contact.phoneValue || '').replace(/\s/g, '')}`
      },
      {
        icon: MapPin,
        title: contact.addressLabel?.[lang] || dictionary.contact?.form?.address || "Visit Us",
        value: contact.addressValue?.[lang] || "",
        href: "#"
      },
    ];

    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {contact.pageTitle?.[lang] || dictionary.contact?.title || "Contact Us"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {contact.subHeading?.[lang] || dictionary.contact?.subtitle || "Get in touch with us"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                {dictionary.contact?.info || "Contact Information"}
              </h2>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{method.title}</h3>
                      {method.href === "#" ? (
                        <p className="text-muted-foreground">{method.value}</p>
                      ) : (
                        <Link 
                          href={method.href} 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {method.value}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionary.contact?.form?.title || "Send us a message"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        {dictionary.contact?.form?.firstName || "First Name"}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        {dictionary.contact?.form?.lastName || "Last Name"}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {dictionary.contact?.form?.email || "Email"}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      {dictionary.contact?.form?.subject || "Subject"}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {dictionary.contact?.form?.message || "Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {dictionary.contact?.form?.send || "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering contact page:', error);
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Sorry, there was an error loading the contact page.
          </p>
        </div>
      </div>
    );
  }
}
