import { useSearchParams } from 'react-router-dom';

const MOCK_ASSIGNEES = ['JD', 'AS', 'MR', 'SK', 'PL', 'EW'];

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleArrayToggle = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const existing = newParams.getAll(key);
    if (existing.includes(value)) {
      const filtered = existing.filter(v => v !== value);
      newParams.delete(key);
      filtered.forEach(v => newParams.append(key, v));
    } else {
      newParams.append(key, value);
    }
    setSearchParams(newParams);
  };

  const handleDate = (key: string, val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val) newParams.delete(key);
    else newParams.set(key, val);
    setSearchParams(newParams);
  };

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  const FilterPill = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button 
      aria-label={`Toggle filter ${label}`}
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
        active 
          ? 'bg-gray-800 text-white border-gray-800 shadow-sm' 
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="px-6 py-4 shrink-0 flex flex-col gap-3">
      <div className="flex items-center justify-between">
         <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-widest">Filters</h2>
         {hasFilters && (
            <button 
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors cursor-pointer px-2 py-1 rounded hover:bg-gray-200/50"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Clear filters
            </button>
          )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          {['To Do', 'In Progress', 'In Review', 'Done'].map(s => (
            <FilterPill key={s} label={s} active={searchParams.getAll('status').includes(s)} onClick={() => handleArrayToggle('status', s)} />
          ))}
        </div>

        {/* Priority */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-200 w-px h-4 bg-gray-200 hidden sm:block mr-2 shadow-sm"></span>
          {['Critical', 'High', 'Medium', 'Low'].map(p => (
            <FilterPill key={p} label={p} active={searchParams.getAll('priority').includes(p)} onClick={() => handleArrayToggle('priority', p)} />
          ))}
        </div>
        
        {/* Assignees */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-200 w-px h-4 bg-gray-200 hidden sm:block mr-2 shadow-sm"></span>
          {MOCK_ASSIGNEES.map(a => (
            <FilterPill key={a} label={a} active={searchParams.getAll('assignee').includes(a)} onClick={() => handleArrayToggle('assignee', a)} />
          ))}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2">
           <span className="text-gray-200 w-px h-4 bg-gray-200 hidden sm:block mr-1 shadow-sm"></span>
           <input 
              type="date" 
              aria-label="Filter start date"
              value={searchParams.get('dueDateFrom') || ''} 
              onChange={e => handleDate(e.target.name, e.target.value)}
              name="dueDateFrom"
              className="text-xs text-gray-600 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gray-800 outline-none cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-shadow"
           />
           <span className="text-gray-400 text-xs">to</span>
           <input 
              type="date" 
              aria-label="Filter end date"
              value={searchParams.get('dueDateTo') || ''} 
              onChange={e => handleDate(e.target.name, e.target.value)}
              name="dueDateTo"
              className="text-xs text-gray-600 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gray-800 outline-none cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-shadow"
           />
        </div>
      </div>
    </div>
  );
}
