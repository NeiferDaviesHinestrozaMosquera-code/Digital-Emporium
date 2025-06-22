import type { Metadata } from 'next';
import Image from 'next/image';
import { Users, Target, Eye } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContentAction } from '@/components/admin/actions';
import type { AboutPageContent } from '@/lib/placeholder-data';

interface AboutPageProps {
  params: Promise<{ lang: Locale }> | { lang: Locale };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  // Await params if it's a Promise (Next.js 15+ pattern)
  const resolvedParams = await Promise.resolve(params);
  const { lang } = resolvedParams;
  
  try {
    const siteContent = await getSiteContentAction();
    return {
      title: siteContent.aboutPage.pageTitle[lang] || "About Us",
      description: siteContent.aboutPage.subHeading[lang] || "Learn more about our company.",
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "About Us",
      description: "Learn more about our company.",
    };
  }
}

export default async function AboutUsPage({ params }: AboutPageProps) {
  // Await params if it's a Promise (Next.js 15+ pattern)
  const resolvedParams = await Promise.resolve(params);
  
  // Safety check for params
  if (!resolvedParams || !resolvedParams.lang) {
    console.error('Missing params or lang in AboutUsPage');
    // Fallback to English if params are missing
    const fallbackLang: Locale = 'en';
    return <AboutPageContent lang={fallbackLang} />;
  }

  const { lang } = resolvedParams;
  
  return <AboutPageContent lang={lang} />;
}

// Separate component to handle the actual page content
async function AboutPageContent({ lang }: { lang: Locale }) {
  try {
    const dictionary = await getDictionary(lang);
    const siteContent = await getSiteContentAction();
    const about = siteContent.aboutPage;
    
    // Safety check for about page content
    if (!about) {
      return (
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
            <p className="text-muted-foreground">Content is currently being loaded...</p>
          </div>
        </div>
      );
    }

    const valuesArray = about.valuesList?.[lang]?.split('\n').filter(value => value.trim() !== '') || [];

    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            {about.heading?.[lang] || 'About Us'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {about.subHeading?.[lang] || 'Learn more about our company.'}
          </p>
        </header>

        <section className="mb-12 md:mb-16">
          <Card className="shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="relative h-64 md:h-full w-full">
                <Image 
                  src={about.section1ImageURL || "https://placehold.co/800x600.png"} 
                  alt={about.section1Heading?.[lang] || "About us image"} 
                  fill 
                  style={{objectFit: 'cover'}} 
                  data-ai-hint={about.section1ImageHint || "team"} 
                  className="transition-transform duration-500 hover:scale-105" 
                />
              </div>
              <div className="p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  {about.section1Heading?.[lang] || 'Our Story'}
                </h2>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  {about.section1Paragraph1?.[lang] || 'We are committed to excellence.'}
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  {about.section1Paragraph2?.[lang] || 'Our team works together to deliver the best results.'}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16 text-center">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Target className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-primary">
                {about.missionHeading?.[lang] || 'Mission'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {about.missionText?.[lang] || 'Our mission is to provide excellent service.'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Eye className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-primary">
                {about.visionHeading?.[lang] || 'Vision'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {about.visionText?.[lang] || 'Our vision is to be the best in our field.'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Users className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-primary">
                {about.valuesHeading?.[lang] || 'Values'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1 list-inside text-left">
                {valuesArray.length > 0 ? (
                  valuesArray.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))
                ) : (
                  <li>Excellence, Integrity, Innovation</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="bg-secondary/30 p-6 md:p-8 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-primary mb-4 text-center">
            {about.finalSectionHeading?.[lang] || 'Get in Touch'}
          </h3>
          <p className="text-foreground/80 leading-relaxed text-center max-w-2xl mx-auto">
            {about.finalSectionText?.[lang] || 'We would love to hear from you and discuss how we can help.'}
          </p>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error rendering AboutPageContent:', error);
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
          <p className="text-muted-foreground">
            We're sorry, there was an error loading the page content. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

// Export dynamic config to prevent static generation issues
export const dynamic = 'force-dynamic';
