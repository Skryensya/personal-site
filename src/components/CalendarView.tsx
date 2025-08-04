import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGitHubContributions } from './GithubGrid';
import type { ContributionDay } from './GithubGrid';

export interface CalendarViewProps {
    username?: string;
    className?: string;
}

interface CalendarState {
    currentMonth: number;
    currentYear: number;
}

export function CalendarView({ username = 'skryensya', className = '' }: CalendarViewProps) {
    const [contributions, setContributions] = React.useState<ContributionDay[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [calendar, setCalendar] = React.useState<CalendarState>({
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear()
    });
    const [tooltip, setTooltip] = React.useState<{ visible: boolean; content: string; x: number; y: number }>({
        visible: false,
        content: '',
        x: 0,
        y: 0
    });

    React.useEffect(() => {
        async function loadContributions() {
            try {
                setLoading(true);
                const data = await fetchGitHubContributions(username);
                setContributions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        }
        loadContributions();
    }, [username]);

    const getContributionStyle = (count: number) => {
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

    const getMonthName = (month: number) => {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return monthNames[month];
    };

    const getCalendarDays = () => {
        const firstDay = new Date(calendar.currentYear, calendar.currentMonth, 1);
        const startDate = new Date(firstDay);

        // Start from Sunday of the week containing the first day
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        // Generate 6 weeks worth of days (42 days) to ensure full calendar grid
        for (let i = 0; i < 42; i++) {
            const dateString = currentDate.toISOString().split('T')[0];
            const contribution = contributions.find((c) => c.date === dateString);
            const isCurrentMonth = currentDate.getMonth() === calendar.currentMonth;

            days.push({
                date: new Date(currentDate),
                dateString,
                contribution: contribution || { date: dateString, count: 0, level: '0' },
                isCurrentMonth
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCalendar((prev) => {
            const newMonth = direction === 'next' ? prev.currentMonth + 1 : prev.currentMonth - 1;

            if (newMonth > 11) {
                return { currentMonth: 0, currentYear: prev.currentYear + 1 };
            } else if (newMonth < 0) {
                return { currentMonth: 11, currentYear: prev.currentYear - 1 };
            } else {
                return { ...prev, currentMonth: newMonth };
            }
        });
    };

    const canNavigateNext = () => {
        const now = new Date();
        return calendar.currentYear < now.getFullYear() || (calendar.currentYear === now.getFullYear() && calendar.currentMonth < now.getMonth());
    };

    const canNavigatePrev = () => {
        // Limit to one year back from current date
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth());
        const currentCalendarDate = new Date(calendar.currentYear, calendar.currentMonth);
        return currentCalendarDate > oneYearAgo;
    };

    const handleDayClick = (event: React.MouseEvent, day: { date: Date; contribution: ContributionDay; isCurrentMonth: boolean }) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const date = new Date(day.date);
        const formatDate = date.toLocaleDateString('es-ES', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        setTooltip({
            visible: true,
            content: `${day.contribution.count} contribuciones el ${formatDate}`,
            x: rect.left + rect.width / 2,
            y: rect.top - 8
        });

        setTimeout(() => {
            setTooltip((prev) => ({ ...prev, visible: false }));
        }, 2000);
    };

    const getMonthStats = () => {
        const monthDays = getCalendarDays().filter((day) => day.isCurrentMonth);
        const totalContributions = monthDays.reduce((sum, day) => sum + day.contribution.count, 0);
        const activeDays = monthDays.filter((day) => day.contribution.count > 0).length;
        const maxDay = monthDays.reduce((max, day) => (day.contribution.count > max.contribution.count ? day : max), monthDays[0]);

        return {
            totalContributions,
            activeDays,
            maxDay: maxDay?.contribution.count || 0,
            totalDays: monthDays.length
        };
    };

    if (loading) {
        return (
            <div className={`space-y-2 ${className}`}>
                <h3 className="text-sm font-mono font-bold" style={{ color: 'var(--color-main)' }}>
                    Calendario de Contribuciones
                </h3>

                <div className="flex gap-6 text-xs font-mono mb-4" style={{ color: 'color-mix(in srgb, var(--color-main) 70%, transparent)' }}>
                    <div className="animate-pulse">
                        <span className="block w-20 h-3 mb-1" style={{ backgroundColor: 'color-mix(in srgb, var(--color-main) 30%, transparent)' }}></span>
                        <span className="text-xs">Total del mes</span>
                    </div>
                    <div className="animate-pulse">
                        <span className="block w-16 h-3 mb-1" style={{ backgroundColor: 'color-mix(in srgb, var(--color-main) 30%, transparent)' }}></span>
                        <span className="text-xs">Días activos</span>
                    </div>
                </div>

                <div className="inline-block">
                    <div
                        className="border p-4"
                        style={{
                            backgroundColor: 'var(--color-secondary)',
                            borderColor: 'var(--color-main)'
                        }}
                    >
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 42 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-8 w-8 aspect-square animate-pulse"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--color-main) 20%, transparent)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
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

    const calendarDays = getCalendarDays();
    const monthStats = getMonthStats();

    return (
        <>
            <div className={`space-y-2 ${className}`}>
                <h3 className="text-sm font-mono font-bold" style={{ color: 'var(--color-main)' }}>
                    Calendario de Contribuciones
                </h3>

                {/* Month Stats */}
                <div className="flex gap-6 text-xs font-mono" style={{ color: 'color-mix(in srgb, var(--color-main) 70%, transparent)' }}>
                    <div>
                        <div className="font-bold" style={{ color: 'var(--color-main)' }}>
                            {monthStats.totalContributions}
                        </div>
                        <div>Total del mes</div>
                    </div>
                    <div>
                        <div className="font-bold" style={{ color: 'var(--color-main)' }}>
                            {monthStats.activeDays}/{monthStats.totalDays}
                        </div>
                        <div>Días activos</div>
                    </div>
                    <div>
                        <div className="font-bold" style={{ color: 'var(--color-main)' }}>
                            {monthStats.maxDay}
                        </div>
                        <div>Día máximo</div>
                    </div>
                </div>

                <div className="inline-block">
                    <div
                        className="border p-4"
                        style={{
                            backgroundColor: 'var(--color-secondary)',
                            borderColor: 'var(--color-main)'
                        }}
                    >
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => navigateMonth('prev')}
                                disabled={!canNavigatePrev()}
                                className="p-1 text-sm font-mono border disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70 "
                                style={{
                                    backgroundColor: 'var(--color-secondary)',
                                    borderColor: 'var(--color-main)',
                                    color: 'var(--color-main)'
                                }}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <h4 className="text-lg font-mono font-bold" style={{ color: 'var(--color-main)' }}>
                                {getMonthName(calendar.currentMonth)} {calendar.currentYear}
                            </h4>

                            <button
                                onClick={() => navigateMonth('next')}
                                disabled={!canNavigateNext()}
                                className="p-1 text-sm font-mono border disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70 "
                                style={{
                                    backgroundColor: 'var(--color-secondary)',
                                    borderColor: 'var(--color-main)',
                                    color: 'var(--color-main)'
                                }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Calendar Grid - 7 columns x 6 rows */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`h-8 w-8 aspect-square cursor-pointer hover:opacity-75 ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
                                    style={{
                                        ...getContributionStyle(day.contribution.count)
                                    }}
                                    onClick={(e) => handleDayClick(e, day)}
                                />
                            ))}
                        </div>

                        {/* Legend */}
                        <div
                            className="flex items-center justify-between mt-4 text-xs font-mono"
                            style={{ color: 'color-mix(in srgb, var(--color-main) 70%, transparent)' }}
                        >
                            <span>Menos</span>
                            <div className="flex gap-1">
                                {[0, 1, 3, 6, 12, 25].map((count, index) => (
                                    <div key={index} className="h-3 w-3 aspect-square" style={getContributionStyle(count)} />
                                ))}
                            </div>
                            <span>Más</span>
                        </div>
                    </div>
                </div>
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
        </>
    );
}
