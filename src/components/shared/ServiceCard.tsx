import type { Service } from '@/lib/placeholder-data';
import { iconMap } from '@/lib/placeholder-data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, HelpCircle } from 'lucide-react';
import type { Locale } from '@/lib/i18n/i18n-config';

interface ServiceCardProps {
  service: Service;
  lang: Locale;
}

// Función para obtener texto internacionalizado con fallbacks
function getLocalizedText(
  text: string | Record<Locale, string> | undefined, 
  lang: Locale,
  defaultValue: string
): string {
  if (!text) return defaultValue;
  
  if (typeof text === 'string') {
    return text;
  }
  
  return text[lang] || text.en || defaultValue;
}

export default function ServiceCard({ service, lang }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName] || HelpCircle;
  
  // Obtener todos los textos internacionalizados con fallbacks
  const title = getLocalizedText(service.title, lang, 'Service Title');
  const shortDescription = getLocalizedText(
    service.shortDescription, 
    lang, 
    'Short service description'
  );
  const description = getLocalizedText(
    service.description, 
    lang, 
    'Service description'
  );
  const priceInfo = getLocalizedText(
    service.priceInfo, 
    lang, 
    'Contact us for pricing'
  );
  const learnMoreText = lang === 'es' 
    ? 'Más información' 
    : lang === 'fr' 
      ? 'En savoir plus' 
      : 'Learn More';

  return (
    <Card className="group flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden hover:-translate-y-1">
      <CardHeader className="p-0">
        {service.image && (
          <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
            <Image 
              src={service.image} 
              alt={title} 
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{objectFit: 'cover'}}
              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <IconComponent className="w-8 h-8" />
          </div>
          <CardTitle className="text-xl font-semibold mb-2">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-foreground/75 min-h-[3rem] line-clamp-2">
            {shortDescription}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-4 border-t flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between sm:items-center">
        <p className="text-lg font-semibold text-accent text-center sm:text-left">
          {priceInfo}
        </p>
        <Button 
          asChild 
          variant="default" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
        >
          <Link href={`/${lang}/contact`}>
            {learnMoreText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
