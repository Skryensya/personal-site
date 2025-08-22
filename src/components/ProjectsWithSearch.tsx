import * as React from 'react';
import ProjectsSearch from './ProjectsSearch';
import ProjectsGrid from './ProjectsGrid';

const { useState, useCallback } = React;

type ProjectData = {
  readonly id: string;
  readonly data: {
    readonly name: string;
    readonly hook?: string;
    readonly tags?: readonly string[];
    readonly publishDate: string;
  };
};

type ProjectsWithSearchProps = {
  readonly initialProjects: readonly ProjectData[];
  readonly language: string;
};

export default function ProjectsWithSearch({ initialProjects, language }: ProjectsWithSearchProps) {
  const [filteredProjects, setFilteredProjects] = useState<readonly ProjectData[]>(initialProjects);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const handleFilteredProjectsChange = useCallback((projects: readonly ProjectData[]) => {
    setFilteredProjects(projects);
  }, []);

  // Pass search query through context or state management
  React.useEffect(() => {
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      const handleInput = () => setCurrentSearchQuery(searchInput.value);
      searchInput.addEventListener('input', handleInput);
      return () => searchInput.removeEventListener('input', handleInput);
    }
  }, []);

  return (
    <div className="space-y-8">
      <ProjectsSearch
        projects={initialProjects}
        language={language}
        onFilteredProjectsChange={handleFilteredProjectsChange}
      />
      
      <ProjectsGrid
        projects={filteredProjects}
        language={language}
        searchQuery={currentSearchQuery}
      />
    </div>
  );
}