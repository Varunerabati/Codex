import { Filter } from 'lucide-react';
import { Card } from './ui/Card';
import { Select } from './ui/Select';

interface FilterPanelProps {
  categories: string[];
  filters: {
    category: string;
    priority: string;
    sort: 'asc' | 'desc';
  };
  onChange: (filters: any) => void;
}

export const FilterPanel = ({ categories, filters, onChange }: FilterPanelProps) => {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Filters</h2>
      </div>

      <div className="space-y-3">
        <Select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </Select>

        <Select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as 'asc' | 'desc' })}
        >
          <option value="asc">Due Date (Earliest)</option>
          <option value="desc">Due Date (Latest)</option>
        </Select>
      </div>
    </Card>
  );
};
