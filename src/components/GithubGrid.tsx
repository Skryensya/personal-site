import React from 'react';

export interface ContributionDay {
  date: string;
  count: number;
  level: string;
}

export async function fetchGitHubContributions(username: string = "skryensya"): Promise<ContributionDay[]> {
  // console.log(`🔍 Fetching contributions for ${username} via API...`);
  
  const url = `/api/github-contributions?username=${encodeURIComponent(username)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.error || 'API returned error');
  }

  // console.log(`📊 API returned ${data.totalDays} contribution days`);
  // console.log(`🎯 Sample data:`, data.contributions.slice(0, 5));
  
  return data.contributions;
}

interface ContributionStats {
  totalContributions: number;
  activeDays: number;
  averageDaily: string;
  maxDaily: number;
  currentStreak: number;
  topDays: ContributionDay[];
}

function analyzeContributions(contributions: ContributionDay[]): ContributionStats {
  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
  const activeDays = contributions.filter(day => day.count > 0).length;
  const averageDaily = (totalContributions / contributions.length).toFixed(2);
  const maxDaily = Math.max(...contributions.map(day => day.count));
  
  // Calculate current streak (days with contributions from today backwards)
  let currentStreak = 0;
  const sortedByDate = [...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const day of sortedByDate) {
    if (day.count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Get top 10 contribution days
  const topDays = [...contributions]
    .filter(day => day.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    totalContributions,
    activeDays,
    averageDaily,
    maxDaily,
    currentStreak,
    topDays
  };
}

function getContributionEmoji(count: number): string {
  if (count === 0) return '⬜';
  if (count <= 2) return '🟩';
  if (count <= 5) return '🟢';
  if (count <= 10) return '🔥';
  return '🚀';
}

function displayWeeklyView(contributions: ContributionDay[]): void {
  const weeks = [];
  const sortedContributions = [...contributions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by weeks (7 days each)
  for (let i = 0; i < sortedContributions.length; i += 7) {
    const week = sortedContributions.slice(i, i + 7);
    const weekTotal = week.reduce((sum, day) => sum + day.count, 0);
    const weekStart = week[0]?.date.split('-').slice(1).join('/');
    const weekEnd = week[week.length - 1]?.date.split('-').slice(1).join('/');
    
    weeks.push({
      'Semana': `${weekStart} - ${weekEnd}`,
      'Contribuciones': weekTotal,
      'Visual': week.map(day => getContributionEmoji(day.count)).join('')
    });
  }
  
  // Show only last 8 weeks
  console.table(weeks.slice(-8));
}

export interface GithubGridProps {
  username?: string;
  className?: string;
}

export function GithubGrid({ username = "skryensya", className = "" }: GithubGridProps) {
  const [contributions, setContributions] = React.useState<ContributionDay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tooltip, setTooltip] = React.useState<{ visible: boolean; content: string; x: number; y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });
  const [containerWidth, setContainerWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function loadContributions() {
      try {
        setLoading(true);
        const data = await fetchGitHubContributions(username);
        setContributions(data);
        
        // Enhanced console logging with statistics
        // const stats = analyzeContributions(data);
        // console.group(`🔥 GitHub Contributions para ${username}`);
        // console.log('📊 Estadísticas:');
        // console.table({
        //   'Total días': data.length,
        //   'Días con contribuciones': stats.activeDays,
        //   'Total contribuciones': stats.totalContributions,
        //   'Promedio diario': stats.averageDaily,
        //   'Máximo en un día': stats.maxDaily,
        //   'Racha actual': stats.currentStreak
        // });
        
        // console.log('\n🏆 Top 10 días con más contribuciones:');
        // console.table(stats.topDays.map(day => ({
        //   'Fecha': day.date,
        //   'Contribuciones': `${day.count} ${getContributionEmoji(day.count)}`,
        //   'Nivel': `${day.level}/4`
        // })));
        
        // console.log('\n📅 Vista semanal (últimas 8 semanas):');
        // displayWeeklyView(data);
        
        // console.groupEnd();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    loadContributions();
  }, [username]);

  // Measure container width and handle resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getContributionStyle = (count: number) => {
    // Determine opacity level (0-5 based on contribution count)
    let opacity = 0;
    if (count === 0) {
      opacity = 0.1;
    } else if (count <= 2) {
      opacity = 0.3;
    } else if (count <= 5) {
      opacity = 0.5;
    } else if (count <= 10) {
      opacity = 0.7;
    } else if (count <= 20) {
      opacity = 0.85;
    } else {
      opacity = 1.0;
    }

    return {
      backgroundColor: `color-mix(in srgb, var(--color-main) ${Math.round(opacity * 100)}%, transparent)`,
      borderColor: 'var(--color-main)',
      borderWidth: '1px',
      borderStyle: 'solid'
    };
  };

  const calculateGridDimensions = () => {
    const minCellSize = 12; // Minimum cell size (current size)
    const gap = 4; // Gap between cells
    const padding = 16; // Container padding (8px * 2)
    const availableWidth = containerWidth - padding;
    
    if (availableWidth <= 0) {
      return {
        cellSize: minCellSize,
        visibleWeeks: 53,
        startWeek: 0
      };
    }

    // Calculate how many weeks can fit with minimum size
    const minWidthPerWeek = minCellSize + gap;
    const maxWeeksWithMinSize = Math.floor((availableWidth + gap) / minWidthPerWeek);
    
    if (maxWeeksWithMinSize >= 53) {
      // If all weeks fit, calculate expanded cell size
      const totalGapWidth = 52 * gap; // 52 gaps between 53 weeks
      const availableForCells = availableWidth - totalGapWidth;
      const expandedCellSize = Math.max(minCellSize, availableForCells / 53);
      
      return {
        cellSize: expandedCellSize,
        visibleWeeks: 53,
        startWeek: 0
      };
    } else {
      // Show only the rightmost weeks that fit
      const visibleWeeks = Math.max(1, maxWeeksWithMinSize);
      const startWeek = 53 - visibleWeeks;
      
      return {
        cellSize: minCellSize,
        visibleWeeks,
        startWeek
      };
    }
  };

  const handleClick = (event: React.MouseEvent, day: ContributionDay) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const formatDate = new Date(day.date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
    
    setTooltip({
      visible: true,
      content: `${day.count} - ${formatDate}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    });

    // Hide tooltip after 2 seconds
    setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible: false }));
    }, 2000);
  };

  const getMonthLabels = () => {
    if (contributions.length === 0) return [];
    
    const months = [];
    const seenMonths = new Set();
    
    // Group contributions by week and find first occurrence of each month
    for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
      const dayIndex = weekIndex * 7; // Sunday of each week
      if (dayIndex < contributions.length) {
        const date = new Date(contributions[dayIndex].date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!seenMonths.has(monthKey)) {
          seenMonths.add(monthKey);
          const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
          months.push({
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1), // Capitalize
            column: weekIndex
          });
        }
      }
    }
    
    return months;
  };

  const getVisibleContributions = () => {
    const { startWeek, visibleWeeks } = calculateGridDimensions();
    
    // Filter contributions to show only visible weeks
    const visibleContributions = [];
    
    for (let week = startWeek; week < startWeek + visibleWeeks; week++) {
      for (let day = 0; day < 7; day++) {
        const index = week * 7 + day;
        if (index < contributions.length) {
          visibleContributions.push(contributions[index]);
        }
      }
    }
    
    return visibleContributions;
  };

  const calculateStats = () => {
    if (contributions.length === 0) {
      return {
        totalContributions: 0,
        maxDayCount: 0,
        maxDayDate: '',
        longestStreak: 0
      };
    }

    const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
    
    // Find day with most contributions
    const maxDay = contributions.reduce((max, day) => 
      day.count > max.count ? day : max, contributions[0]
    );

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 0;
    
    // Sort contributions by date
    const sortedContributions = [...contributions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const day of sortedContributions) {
      if (day.count > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      totalContributions,
      maxDayCount: maxDay.count,
      maxDayDate: maxDay.date,
      longestStreak
    };
  };


  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="text-sm font-mono font-bold" style={{ color: 'var(--color-main)' }}>
          Contribuciones en GitHub
        </h3>
        
        {/* Loading stats */}
        <div className="flex gap-6 text-xs font-mono mb-4" 
             style={{ color: 'color-mix(in srgb, var(--color-main) 70%, transparent)' }}>
          <div className="animate-pulse">
            <span className="block w-20 h-3 mb-1" 
                  style={{ backgroundColor: 'color-mix(in srgb, var(--color-main) 30%, transparent)' }}></span>
            <span className="text-xs">Total</span>
          </div>
          <div className="animate-pulse">
            <span className="block w-16 h-3 mb-1" 
                  style={{ backgroundColor: 'color-mix(in srgb, var(--color-main) 30%, transparent)' }}></span>
            <span className="text-xs">Día máximo</span>
          </div>
          <div className="animate-pulse">
            <span className="block w-12 h-3 mb-1" 
                  style={{ backgroundColor: 'color-mix(in srgb, var(--color-main) 30%, transparent)' }}></span>
            <span className="text-xs">Racha más larga</span>
          </div>
        </div>

        <div className="w-full" ref={containerRef}>
          {(() => {
            const { cellSize, visibleWeeks } = calculateGridDimensions();
            const totalCells = visibleWeeks * 7;
            
            return (
              <div className="border p-2"
                   style={{ 
                     backgroundColor: 'var(--color-secondary)',
                     borderColor: 'var(--color-main)'
                   }}>
                <div className="grid gap-1"
                     style={{
                       gridTemplateColumns: `repeat(${visibleWeeks}, ${cellSize}px)`,
                       gridTemplateRows: 'repeat(7, 12px)',
                       gridAutoFlow: 'column'
                     }}>
                  {Array.from({ length: totalCells }).map((_, i) => {
                    const weekIndex = Math.floor(i / 7);
                    const delay = weekIndex * 0.05; // Stagger animation by week
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          width: `${cellSize}px`,
                          height: '12px',
                          backgroundColor: 'color-mix(in srgb, var(--color-main) 20%, transparent)',
                          animation: `wave-opacity 2s ease-in-out infinite`,
                          animationDelay: `${delay}s`
                        }}
                        aria-hidden="true"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-main) 70%, transparent)' }}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* CSS for wave animation and accessibility */}
      <style>{`
        @keyframes wave-opacity {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
      
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-mono font-bold" style={{ color: 'var(--color-main)' }}>
        Contribuciones en GitHub
      </h3>
      
      {/* Stats */}
      {(() => {
        const stats = calculateStats();
        const maxDayFormatted = stats.maxDayDate ? 
          new Date(stats.maxDayDate).toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
          }) : '';
        
        return (
          <div className="flex gap-6 text-xs font-mono mb-4" 
               style={{ color: 'color-mix(in srgb, var(--color-main) 70%, transparent)' }}
               role="region"
               aria-label="Estadísticas de contribuciones">
            <div tabIndex={0} aria-label={`Total de contribuciones: ${stats.totalContributions.toLocaleString()}`}>
              <div className="font-bold" style={{ color: 'var(--color-main)' }}>
                {stats.totalContributions.toLocaleString()}
              </div>
              <div>Total contribuciones</div>
            </div>
            <div tabIndex={0} aria-label={`Día con más contribuciones: ${stats.maxDayCount} ${maxDayFormatted ? `el ${maxDayFormatted}` : ''}`}>
              <div className="font-bold" style={{ color: 'var(--color-main)' }}>
                {stats.maxDayCount} {maxDayFormatted && `(${maxDayFormatted})`}
              </div>
              <div>Día máximo</div>
            </div>
            <div tabIndex={0} aria-label={`Racha más larga: ${stats.longestStreak} días consecutivos`}>
              <div className="font-bold" style={{ color: 'var(--color-main)' }}>
                {stats.longestStreak} días
              </div>
              <div>Racha más larga</div>
            </div>
          </div>
        );
      })()}
      
      <div className="w-full" ref={containerRef}>
        {(() => {
          const { cellSize, visibleWeeks } = calculateGridDimensions();
          const visibleContributions = getVisibleContributions();
          
          return (
            <div 
              className="border p-2 focus:outline-2 focus:outline-offset-2 focus:outline-current"
              style={{ 
                backgroundColor: 'var(--color-secondary)',
                borderColor: 'var(--color-main)'
              }}
              tabIndex={0}
              role="img"
              aria-label={`Gráfico de contribuciones de GitHub con ${calculateStats().totalContributions} contribuciones totales`}
              aria-describedby="contributions-description"
            >
              <div className="grid gap-1"
                   style={{
                     gridTemplateColumns: `repeat(${visibleWeeks}, ${cellSize}px)`,
                     gridTemplateRows: 'repeat(7, 12px)',
                     gridAutoFlow: 'column'
                   }}>
                {visibleContributions.map((day) => (
                  <div
                    key={day.date}
                    className="cursor-pointer hover:opacity-75"
                    style={{
                      width: `${cellSize}px`,
                      height: '12px',
                      ...getContributionStyle(day.count),
                      aspectRatio: "1/1"
                    }}
                    onClick={(e) => handleClick(e, day)}
                    aria-hidden="true"
                  />
                ))}
              </div>
              
              {/* Hidden description for screen readers */}
              <div id="contributions-description" className="sr-only">
                {(() => {
                  const stats = calculateStats();
                  const activeDays = contributions.filter(d => d.count > 0).length;
                  return `Grilla de contribuciones mostrando actividad durante 365 días. ${stats.totalContributions} contribuciones totales en ${activeDays} días activos. Día con más contribuciones: ${stats.maxDayCount}. Racha más larga: ${stats.longestStreak} días consecutivos.`;
                })()}
              </div>
            </div>
          );
        })()}
      </div>
      
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-mono border pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)',
            backgroundColor: 'var(--color-main)',
            color: 'var(--color-secondary)',
            borderColor: 'var(--color-main)'
          }}
        >
          {tooltip.content}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
            style={{ borderTopColor: 'var(--color-main)' }}
          ></div>
        </div>
      )}
    </div>
    </>
  );
}

export default GithubGrid;