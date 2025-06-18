
import ProjectCard from '@/components/shared/ProjectCard';
import { Metadata } from 'next';
import { Briefcase } from 'lucide-react';
import type { Project } from '@/lib/placeholder-data';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";

export const metadata: Metadata = {
  title: 'Our Projects - Digital Emporium',
  description: 'Explore a selection of projects delivered by Digital Emporium, showcasing our expertise in web development, app creation, and AI solutions.',
};

async function getProjectsFromDB(): Promise<Project[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects`));
    if (snapshot.exists()) {
      const projectsObject = snapshot.val();
      const projectsArray = Object.keys(projectsObject)
        .map(key => ({ id: key, ...projectsObject[key] }))
        .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically
      return projectsArray as Project[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects from Firebase DB for public page:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectsFromDB();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <Briefcase className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Our Portfolio
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover the innovative solutions and impactful projects we've delivered for our clients. Each project reflects our commitment to quality, creativity, and cutting-edge technology.
        </p>
      </div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={project.id} className={`animate-in fade-in slide-in-from-bottom-10 duration-500`} style={{ animationDelay: `${index * 150}ms` }}>
                <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">We are currently updating our project portfolio. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
