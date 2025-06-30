import 'server-only';
import type { Locale } from './i18n-config';

// Define a type for our dictionary structure for better type safety
export type Dictionary = {
  [key: string]: string | Dictionary;
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default as Dictionary),
  es: () => import('@/locales/es.json').then((module) => module.default as Dictionary),
  fr: () => import('@/locales/fr.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    const load = dictionaries[locale] || dictionaries.en; // Fallback to English
    const dictionary = await load();
    
    // Validar que el diccionario no esté vacío
    if (!dictionary || Object.keys(dictionary).length === 0) {
      console.warn(`Dictionary for locale '${locale}' is empty, falling back to English`);
      return await dictionaries.en();
    }
    
    return dictionary;
  } catch (error) {
    console.error(`Error loading dictionary for locale '${locale}':`, error);
    
    // Fallback a inglés en caso de error
    try {
      return await dictionaries.en();
    } catch (fallbackError) {
      console.error('Error loading fallback dictionary (en):', fallbackError);
      
      // Diccionario de emergencia
      return {
        siteTitle: 'Digital Emporium',
        siteDescription: 'Your one-stop solution for cutting-edge digital services.',
        contact: {
          title: 'Contact Us',
          subtitle: 'Get in touch with us',
          info: 'Contact Information',
          form: {
            title: 'Send us a message',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            send: 'Send Message'
          }
        }
      } as Dictionary;
    }
  }
};

// Función auxiliar para obtener una traducción específica con fallback
export const getTranslation = (
  dictionary: Dictionary,
  key: string,
  fallback: string = ''
): string => {
  const value = getNestedValue(dictionary, key);
  return typeof value === 'string' ? value : fallback;
};

// Función auxiliar para obtener valores anidados
function getNestedValue(obj: Dictionary, path: string): string | Dictionary | undefined {
  const keys = path.split('.');
  let current: string | Dictionary | undefined = obj;
  
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}
