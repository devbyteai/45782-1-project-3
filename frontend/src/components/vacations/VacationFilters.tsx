import { VacationFilters as FilterType } from '../../models/Vacation';

interface VacationFiltersProps {
    filters: FilterType;
    onChange: (filters: FilterType) => void;
}

function VacationFilters({ filters, onChange }: VacationFiltersProps) {
    const handleFilterChange = (key: keyof FilterType, value: boolean) => {
        const newFilters: FilterType = {
            ...filters,
            liked: key === 'liked' ? value : false,
            future: key === 'future' ? value : false,
            active: key === 'active' ? value : false,
            page: 1
        };
        onChange(newFilters);
    };

    const filterOptions = [
        { key: 'liked' as keyof FilterType, label: 'Liked', icon: '❤️' },
        { key: 'future' as keyof FilterType, label: 'Upcoming', icon: '🔜' },
        { key: 'active' as keyof FilterType, label: 'Active Now', icon: '✈️' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filterOptions.map(({ key, label, icon }) => (
                <button
                    key={key}
                    onClick={() => handleFilterChange(key, !filters[key])}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        filters[key]
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                    <span>{icon}</span>
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}

export default VacationFilters;
