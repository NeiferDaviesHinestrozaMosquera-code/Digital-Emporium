import ProjectCard from '@/components/shared/ProjectCard';
import type { Metadata } from 'next';
import { Briefcase } from 'lucide-react';
import type { Project } from '@/lib/placeholder-data';
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
    title: dictionary.projectsPageTitle as string || "Our Projects",
    description: dictionary.projectsPageDescription as string || "Explore our portfolio of successful projects",
  };
}

// Obtener proyectos de Firebase
async function getProjectsFromDB(): Promise<Project[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects`));
    
    if (snapshot.exists()) {
      const projectsObject = snapshot.val();
      return Object.keys(projectsObject)
        .map(key => ({ 
          id: key, 
          ...projectsObject[key],
          // Asegurar valores para internacionalización
          title: projectsObject[key].title || { en: "Project Title" },
          description: projectsObject[key].description || { en: "Project description" },
          shortDescription: projectsObject[key].shortDescription || { en: "Short project description" }
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error);
    return [];
  }
}

// Componente de página
export default async function ProjectsPage({
  params
}: {
  params: { lang: string }
}) {
  const lang = getSafeLang(params?.lang);
  const projects = await getProjectsFromDB();
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <Briefcase className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {dictionary.projectsPageHeading || "Our Portfolio"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {dictionary.projectsPageSubHeading || 
            "Discover the innovative solutions and impactful projects we've delivered for our clients."}
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`animate-in fade-in slide-in-from-bottom-10 duration-500`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ProjectCard project={project} lang={lang} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">
            {dictionary.noProjectsMessage || "We are currently updating our project portfolio."}
          </p>
        </div>
      )}
    </div>
  );
}
