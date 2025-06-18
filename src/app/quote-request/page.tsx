
import QuoteRequestForm from '@/components/forms/QuoteRequestForm';
import { Metadata } from 'next';
import type { Service } from '@/lib/placeholder-data';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";

export const metadata: Metadata = {
  title: 'Request a Quote - Digital Emporium',
  description: 'Get a personalized quote for your digital project. Fill out our form to tell us about your needs.',
};

async function getServicesForDropdown(): Promise<Service[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `services`));
    if (snapshot.exists()) {
      const servicesObject = snapshot.val();
      const servicesArray = Object.keys(servicesObject)
        .map(key => ({ id: key, ...servicesObject[key] }))
        .sort((a, b) => a.title.localeCompare(b.title));
      return servicesArray as Service[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching services for quote form from Firebase DB:", error);
    return []; 
  }
}


export default async function QuoteRequestPage() {
  const services = await getServicesForDropdown();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Request a Custom Quote
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a specific project in mind? Fill out the form below with your requirements, and our team will get back to you with a personalized quote and consultation.
        </p>
      </div>
      <QuoteRequestForm availableServices={services} />
    </div>
  );
}
