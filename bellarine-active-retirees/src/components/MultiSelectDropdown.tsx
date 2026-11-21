import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
  className?: string;
}

export function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selected,
  onChange,
  className = '',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function toggleOption(option: string) {
    const exists = selected.includes(option);
    if (exists) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  const summaryText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label
        id={labelId}
        className="block text-base font-bold text-slate-800 mb-1"
      >
        {label}
      </label>

      <button
        type="button"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[46px] flex items-center justify-between gap-2 rounded-xl border-2 bg-white px-3.5 py-2 text-left text-base sm:text-lg shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/25 ${
          isOpen || selected.length > 0
            ? 'border-teal-600 text-slate-900'
            : 'border-slate-300 text-slate-700 hover:border-teal-500'
        }`}
      >
        <span className="truncate font-medium">{summaryText}</span>
        <span className="flex items-center gap-1 shrink-0">
          {selected.length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold min-w-[22px] h-[22px] px-1.5 tabular-nums">
              {selected.length}
            </span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 min-w-[230px] z-20 mt-1.5 rounded-2xl border-2 border-teal-500 bg-white shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-teal-50 border-b border-teal-100">
            <span className="text-sm font-bold text-teal-900">
              {selected.length === 0
                ? 'Select one or more'
                : `${selected.length} selected`}
            </span>
            <div className="flex items-center gap-1.5">
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="min-h-[34px] inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-teal-800 hover:bg-teal-100 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="min-h-[34px] inline-flex items-center rounded-lg bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 text-sm font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 p-1.5">
            {options.length === 0 ? (
              <p className="px-3 py-4 text-base text-slate-600 text-center">
                No options available
              </p>
            ) : (
              options.map((option) => {
                const isChecked = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={isChecked}
                    onClick={() => toggleOption(option)}
                    className={`w-full min-h-[46px] flex items-center gap-3 rounded-xl px-3 py-2 text-left text-base sm:text-lg transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-teal-50 text-teal-950 font-bold'
                        : 'text-slate-800 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-white border-slate-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
