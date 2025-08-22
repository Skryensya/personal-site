import * as React from 'react';
import { Search, X, Filter, Tag } from 'lucide-react';

const { useState, useMemo, useCallback } = React;

type ProjectData = {
  readonly id: string;
  readonly data: {
    readonly name: string;
    readonly hook?: string;
    readonly tags?: readonly string[];
    readonly publishDate: string;
  };
};

type SearchFilters = {
  readonly query: string;
  readonly selectedTags: readonly string[];
  readonly sortBy: 'date' | 'name' | 'relevance';
  readonly sortOrder: 'asc' | 'desc';
};

type ProjectsSearchProps = {
  readonly projects: readonly ProjectData[];
  readonly language: string;
  readonly onFilteredProjectsChange: (projects: readonly ProjectData[]) => void;
};

const filterProjectsByQuery = (projects: readonly ProjectData[], query: string): readonly ProjectData[] => {
  if (!query.trim()) return projects;
  
  const searchTerm = query.toLowerCase().trim();
  return projects.filter(project => 
    project.data.name.toLowerCase().includes(searchTerm) ||
    (project.data.hook?.toLowerCase().includes(searchTerm)) ||
    (project.data.tags?.some(tag => tag.toLowerCase().includes(searchTerm)))
  );
};

const filterProjectsByTags = (projects: readonly ProjectData[], selectedTags: readonly string[]): readonly ProjectData[] => {
  if (selectedTags.length === 0) return projects;
  
  return projects.filter(project =>
    selectedTags.every(tag =>
      project.data.tags?.some(projectTag => projectTag.toLowerCase() === tag.toLowerCase())
    )
  );
};

const sortProjects = (projects: readonly ProjectData[], sortBy: string, sortOrder: string): readonly ProjectData[] => {
  return [...projects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.data.name.localeCompare(b.data.name);
        break;
      case 'date':
        comparison = new Date(a.data.publishDate).getTime() - new Date(b.data.publishDate).getTime();
        break;
      case 'relevance':
      default:
        comparison = 0;
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

const extractAllTags = (projects: readonly ProjectData[]): readonly string[] => {
  const tagSet = new Set<string>();
  projects.forEach(project => {
    project.data.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

const SearchInput: React.FC<{
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onClear: () => void;
  readonly placeholder: string;
}> = React.memo(({ value, onChange, onClear, placeholder }) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-main opacity-60" />
    </div>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-12 pr-12 py-3 bg-secondary border-2 border-main text-main font-mono text-sm placeholder-main placeholder-opacity-60 focus:outline-none focus:border-main focus:bg-main focus:text-secondary"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-main opacity-60 hover:opacity-100"
        aria-label="Clear search"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
));

const FilterButton: React.FC<{
  readonly isActive: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}> = React.memo(({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 border-2 border-main font-mono text-sm transition-colors ${
      isActive
        ? 'bg-main text-secondary'
        : 'bg-secondary text-main hover:bg-main hover:text-secondary'
    }`}
  >
    {children}
  </button>
));

const TagFilter: React.FC<{
  readonly tags: readonly string[];
  readonly selectedTags: readonly string[];
  readonly onTagToggle: (tag: string) => void;
  readonly isExpanded: boolean;
  readonly onToggleExpanded: () => void;
}> = React.memo(({ tags, selectedTags, onTagToggle, isExpanded, onToggleExpanded }) => {
  const visibleTags = isExpanded ? tags : tags.slice(0, 8);
  const hasMoreTags = tags.length > 8;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-main opacity-60" />
        <span className="font-mono text-sm text-main opacity-70 uppercase tracking-wide">
          Filter by tags
        </span>
        {selectedTags.length > 0 && (
          <span className="px-2 py-1 bg-main text-secondary font-mono text-xs">
            {selectedTags.length} selected
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`px-3 py-2 border-2 border-main font-mono text-xs transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-main text-secondary'
                : 'bg-secondary text-main hover:bg-main hover:text-secondary'
            }`}
          >
            <Tag className="h-3 w-3 inline mr-1" />
            {tag}
          </button>
        ))}
        
        {hasMoreTags && (
          <button
            onClick={onToggleExpanded}
            className="px-3 py-2 border-2 border-main font-mono text-xs bg-secondary text-main opacity-70 hover:opacity-100 hover:bg-main hover:text-secondary"
          >
            {isExpanded ? 'Show less' : `+${tags.length - 8} more`}
          </button>
        )}
      </div>
    </div>
  );
});

const SortControls: React.FC<{
  readonly sortBy: string;
  readonly sortOrder: string;
  readonly onSortChange: (sortBy: string, sortOrder: string) => void;
}> = React.memo(({ sortBy, sortOrder, onSortChange }) => (
  <div className="flex items-center gap-2">
    <span className="font-mono text-sm text-main opacity-70 whitespace-nowrap">
      Sort by:
    </span>
    <div className="flex">
      <FilterButton
        isActive={sortBy === 'date'}
        onClick={() => onSortChange('date', sortBy === 'date' && sortOrder === 'desc' ? 'asc' : 'desc')}
      >
        Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
      </FilterButton>
      <FilterButton
        isActive={sortBy === 'name'}
        onClick={() => onSortChange('name', sortBy === 'name' && sortOrder === 'desc' ? 'asc' : 'desc')}
      >
        Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
      </FilterButton>
    </div>
  </div>
));

export default function ProjectsSearch({ projects, language, onFilteredProjectsChange }: ProjectsSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    selectedTags: [],
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);
  
  const allTags = useMemo(() => extractAllTags(projects), [projects]);
  
  const filteredProjects = useMemo(() => {
    let result = projects;
    
    result = filterProjectsByQuery(result, filters.query);
    result = filterProjectsByTags(result, filters.selectedTags);
    result = sortProjects(result, filters.sortBy, filters.sortOrder);
    
    return result;
  }, [projects, filters]);
  
  const handleQueryChange = useCallback((query: string) => {
    updateFilters({ query });
    onFilteredProjectsChange?.(filteredProjects);
  }, [updateFilters, onFilteredProjectsChange, filteredProjects]);
  
  const handleQueryClear = useCallback(() => {
    updateFilters({ query: '' });
  }, [updateFilters]);
  
  const handleTagToggle = useCallback((tag: string) => {
    const isSelected = filters.selectedTags.includes(tag);
    const newSelectedTags = isSelected
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    updateFilters({ selectedTags: newSelectedTags });
  }, [filters.selectedTags, updateFilters]);
  
  const handleSortChange = useCallback((sortBy: string, sortOrder: string) => {
    updateFilters({ sortBy, sortOrder });
  }, [updateFilters]);
  
  const handleClearAllFilters = useCallback(() => {
    setFilters({
      query: '',
      selectedTags: [],
      sortBy: 'date',
      sortOrder: 'desc',
    });
  }, []);
  
  const hasActiveFilters = filters.query || filters.selectedTags.length > 0;
  const resultCount = filteredProjects.length;
  
  React.useEffect(() => {
    onFilteredProjectsChange(filteredProjects);
  }, [filteredProjects, onFilteredProjectsChange]);
  
  return (
    <div className="bg-secondary border-2 border-main p-6 mb-8 space-y-6">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={filters.query}
          onChange={handleQueryChange}
          onClear={handleQueryClear}
          placeholder="Search projects by name, description, or tags..."
        />
        
        <div className="flex gap-2">
          <SortControls
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />
          
          {hasActiveFilters && (
            <FilterButton isActive={false} onClick={handleClearAllFilters}>
              Clear all
            </FilterButton>
          )}
        </div>
      </div>
      
      {/* Tag Filters */}
      {allTags.length > 0 && (
        <TagFilter
          tags={allTags}
          selectedTags={filters.selectedTags}
          onTagToggle={handleTagToggle}
          isExpanded={isTagsExpanded}
          onToggleExpanded={() => setIsTagsExpanded(!isTagsExpanded)}
        />
      )}
      
      {/* Results Summary */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-main">
        <div className="font-mono text-sm text-main opacity-70">
          {resultCount === projects.length
            ? `${resultCount} projects`
            : `${resultCount} of ${projects.length} projects`}
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-main opacity-60">
              Active filters:
            </span>
            {filters.query && (
              <span className="px-2 py-1 bg-main text-secondary font-mono text-xs">
                "{filters.query}"
              </span>
            )}
            {filters.selectedTags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-main text-secondary font-mono text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}