import * as React from 'react';
import { Calendar, Tag, ExternalLink } from 'lucide-react';

const { useMemo } = React;

type ProjectData = {
  readonly id: string;
  readonly data: {
    readonly name: string;
    readonly hook?: string;
    readonly tags?: readonly string[];
    readonly publishDate: string;
  };
};

type ProjectsGridProps = {
  readonly projects: readonly ProjectData[];
  readonly language: string;
  readonly searchQuery: string;
};

const getProjectUrl = (projectId: string, language: string): string => {
  const slug = projectId.replace(`${language}/`, '').replace('.md', '');
  return `/${language === 'es' ? 'es/proyectos' : language === 'en' ? 'en/projects' : 'no/prosjekter'}/${slug}`;
};

const highlightSearchTerm = (text: string, searchQuery: string): React.ReactNode => {
  if (!searchQuery.trim()) return text;
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-main text-secondary px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const ProjectCard: React.FC<{
  readonly project: ProjectData;
  readonly language: string;
  readonly searchQuery: string;
}> = React.memo(({ project, language, searchQuery }) => {
  const projectUrl = getProjectUrl(project.id, language);
  const formattedDate = useMemo(() => {
    const date = new Date(project.data.publishDate);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : language === 'no' ? 'no-NO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [project.data.publishDate, language]);

  return (
    <article className="group bg-secondary border-2 border-main hover:bg-main hover:text-secondary transition-colors duration-200 relative overflow-hidden">
      <a href={projectUrl} className="block p-6 h-full no-underline">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-mono font-bold mb-2 group-hover:text-secondary leading-tight">
              {highlightSearchTerm(project.data.name, searchQuery)}
            </h2>
            {project.data.hook && (
              <p className="text-sm leading-relaxed opacity-80 group-hover:text-secondary line-clamp-3">
                {highlightSearchTerm(project.data.hook, searchQuery)}
              </p>
            )}
          </div>
          
          <div className="ml-4 opacity-60 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>

        {/* Tags */}
        {project.data.tags && project.data.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-3 w-3 opacity-60" />
              <span className="font-mono text-xs opacity-60 uppercase tracking-wide">
                Technologies
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.data.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 border-2 border-main font-mono bg-main text-secondary group-hover:bg-secondary group-hover:text-main group-hover:border-secondary transition-colors"
                >
                  {highlightSearchTerm(tag, searchQuery)}
                </span>
              ))}
              {project.data.tags.length > 4 && (
                <span className="text-xs px-2 py-1 border-2 border-main font-mono opacity-70 group-hover:text-secondary transition-colors">
                  +{project.data.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t-2 border-main border-opacity-20 group-hover:border-secondary">
          <Calendar className="h-3 w-3 opacity-60" />
          <time
            dateTime={project.data.publishDate}
            className="font-mono text-xs opacity-70 group-hover:text-secondary"
          >
            {formattedDate}
          </time>
        </div>
      </a>
    </article>
  );
});

const EmptyState: React.FC<{
  readonly searchQuery: string;
  readonly hasFilters: boolean;
}> = React.memo(({ searchQuery, hasFilters }) => (
  <div className="col-span-full bg-secondary border-2 border-main p-12 text-center">
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-6xl opacity-20">🔍</div>
      <h3 className="font-mono text-xl font-bold text-main">
        No projects found
      </h3>
      {searchQuery ? (
        <p className="font-mono text-sm text-main opacity-70">
          No projects match your search for "<strong>{searchQuery}</strong>"
        </p>
      ) : hasFilters ? (
        <p className="font-mono text-sm text-main opacity-70">
          No projects match your current filters
        </p>
      ) : (
        <p className="font-mono text-sm text-main opacity-70">
          No projects available at the moment
        </p>
      )}
      <div className="pt-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border-2 border-main bg-main text-secondary hover:bg-secondary hover:text-main font-mono text-sm transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  </div>
));

export default function ProjectsGrid({ projects, language, searchQuery }: ProjectsGridProps) {
  const hasResults = projects.length > 0;
  const hasFilters = searchQuery.trim().length > 0;

  if (!hasResults) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState searchQuery={searchQuery} hasFilters={hasFilters} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          language={language}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}