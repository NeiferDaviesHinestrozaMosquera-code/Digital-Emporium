import QuoteRequestForm from '@/components/forms/QuoteRequestForm';
import type { Metadata } from 'next';
import type { Service } from '@/lib/placeholder-data';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n } from '@/lib/i18n/i18n-config';

// Función para obtener el idioma de forma segura
function getSafeLang(langParam: any): 'en' | 'es' | 'fr' {
  return i18n.locales.includes(langParam) 
    ? langParam as 'en' | 'es' | 'fr'
    : i18n.defaultLocale;
}

// Generar rutas estáticas
export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

// Generar metadatos
export async function generateMetadata({
  params
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const lang = getSafeLang(params?.lang);
  const dictionary = await getDictionary(lang);
  
  return {
    title: dictionary.requestQuotePageTitle as string || "Request a Quote",
    description: dictionary.requestQuotePageDescription as string || "Get a personalized quote for your project",
  };
}

// Obtener servicios de Firebase
async function getServicesForDropdown(): Promise<Service[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `services`));
    
    if (snapshot.exists()) {
      const servicesObject = snapshot.val();
      return Object.keys(servicesObject)
        .map(key => ({ 
          id: key, 
          ...servicesObject[key],
          // Asegurar valores para internacionalización
          title: servicesObject[key].title || { en: "Service Title" },
          description: servicesObject[key].description || { en: "Service description" }
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching services for quote form:", error);
    return [];
  }
}

// Componente de página
export default async function QuoteRequestPage({
  params
}: {
  params: { lang: string }
}) {
  const lang = getSafeLang(params?.lang);
  const services = await getServicesForDropdown();
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {dictionary.requestQuotePageHeading || "Request a Custom Quote"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.requestQuotePageSubHeading || 
            "Have a specific project in mind? Fill out the form below with your requirements, and our team will get back to you with a personalized quote and consultation."}
        </p>
      </div>
      <QuoteRequestForm availableServices={services} lang={lang} />
    </div>
  );
}
