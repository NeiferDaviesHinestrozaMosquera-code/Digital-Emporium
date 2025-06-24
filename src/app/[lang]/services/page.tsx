import ServiceCard from '@/components/shared/ServiceCard';
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
    title: dictionary.servicesPageTitle as string || "Our Services",
    description: dictionary.servicesPageDescription as string || "Explore our range of digital services",
  };
}

// Obtener servicios de Firebase
async function getServicesFromDB(): Promise<Service[]> {
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
          description: servicesObject[key].description || { en: "Service description" },
          shortDescription: servicesObject[key].shortDescription || { en: "Short service description" }
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching services from Firebase:", error);
    return [];
  }
}

// Componente de página
export default async function ServicesPage({
  params
}: {
  params: { lang: string }
}) {
  const lang = getSafeLang(params?.lang);
  const services = await getServicesFromDB();
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-6">
        {dictionary.ourServices as string || "Our Services"}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12 md:mb-16 max-w-3xl mx-auto">
        {dictionary.ourServicesDescription as string || "Discover our comprehensive range of digital solutions"}
      </p>
      
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              lang={lang} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          {dictionary.noServicesMessage || "No services currently available. Please check back soon!"}
        </p>
      )}
    </div>
  );
}
