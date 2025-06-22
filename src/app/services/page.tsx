import ServiceCard from '@/components/shared/ServiceCard';
import { Metadata } from 'next';
import type { Service } from '@/lib/placeholder-data';
import type { Locale } from '@/lib/i18n/i18n-config';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";

// Generate metadata function that receives params
export async function generateMetadata(
  { params }: { params: Promise<{ lang: Locale }> | { lang: Locale } }
): Promise<Metadata> {
  return {
    title: 'Our Services - Digital Emporium',
    description: 'Explore the wide range of digital services offered by Digital Emporium, including app development, web design, AI solutions, and more.',
  };
}

async function getServicesFromDB(): Promise<Service[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `services`));
    
    if (snapshot.exists()) {
      const servicesObject = snapshot.val();
      const servicesArray = Object.keys(servicesObject)
        .map(key => ({ id: key, ...servicesObject[key] }))
        .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically
      
      return servicesArray as Service[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching services from Firebase DB for public page:", error);
    return [];
  }
}

// Props interface for the page component
interface ServicesPageProps {
  params: Promise<{ lang: Locale }> | { lang: Locale };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  // Resolve params if it's a Promise
  const resolvedParams = await Promise.resolve(params);
  const { lang } = resolvedParams;
  
  const services = await getServicesFromDB();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-6">
        Our Digital Services
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12 md:mb-16 max-w-3xl mx-auto">
        At Digital Emporium, we provide a comprehensive suite of digital services designed to 
        empower your business and bring your vision to life. Explore our offerings below.
      </p>
      
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No services currently available. Please check back soon!
        </p>
      )}
    </div>
  );
}
