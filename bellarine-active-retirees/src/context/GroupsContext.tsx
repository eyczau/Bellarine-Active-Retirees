import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { GroupRecord, GroupsApiResponse } from '../types/group.ts';

interface PersistedFilters {
  selectedCategory: string;
  selectedLocations: string[];
  selectedDays: string[];
  selectedCostCategories: string[];
  searchQuery: string;
}

const FILTERS_STORAGE_KEY = 'bar_directory_filters_v1';
const SCROLL_STORAGE_KEY = 'bar_directory_scroll_v1';

const DEFAULT_FILTERS: PersistedFilters = {
  selectedCategory: 'All',
  selectedLocations: [],
  selectedDays: [],
  selectedCostCategories: [],
  searchQuery: '',
};

function loadInitialFilters(): PersistedFilters {
  try {
    const raw = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<PersistedFilters>;
    return {
      selectedCategory:
        typeof parsed.selectedCategory === 'string' && parsed.selectedCategory
          ? parsed.selectedCategory
          : 'All',
      selectedLocations: Array.isArray(parsed.selectedLocations)
        ? parsed.selectedLocations.filter((x): x is string => typeof x === 'string')
        : [],
      selectedDays: Array.isArray(parsed.selectedDays)
        ? parsed.selectedDays.filter((x): x is string => typeof x === 'string')
        : [],
      selectedCostCategories: Array.isArray(parsed.selectedCostCategories)
        ? parsed.selectedCostCategories.filter((x): x is string => typeof x === 'string')
        : [],
      searchQuery: typeof parsed.searchQuery === 'string' ? parsed.searchQuery : '',
    };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function loadInitialPendingScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return null;
    const num = Number(raw);
    return Number.isFinite(num) && num >= 0 ? num : null;
  } catch {
    return null;
  }
}

interface GroupsContextValue {
  groups: GroupRecord[];
  isFallback: boolean;
  bannerDismissed: boolean;
  dismissBanner: () => void;
  loading: boolean;
  error: string | null;
  reload: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  selectedCostCategories: string[];
  setSelectedCostCategories: (costs: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearAllFilters: () => void;
  saveDirectoryScrollPosition: (scrollY: number) => void;
  peekDirectoryScrollPosition: () => number | null;
  clearDirectoryScrollPosition: () => void;
}

const GroupsContext = createContext<GroupsContextValue | null>(null);

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<GroupRecord[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchNonce, setFetchNonce] = useState(0);

  const initialFiltersRef = useRef<PersistedFilters | null>(null);
  if (initialFiltersRef.current === null) {
    initialFiltersRef.current = loadInitialFilters();
  }

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFiltersRef.current.selectedCategory
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialFiltersRef.current.selectedLocations
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialFiltersRef.current.selectedDays
  );
  const [selectedCostCategories, setSelectedCostCategories] = useState<string[]>(
    initialFiltersRef.current.selectedCostCategories
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialFiltersRef.current.searchQuery
  );

  const pendingScrollYRef = useRef<number | null>(loadInitialPendingScroll());

  useEffect(() => {
    try {
      const payload: PersistedFilters = {
        selectedCategory,
        selectedLocations,
        selectedDays,
        selectedCostCategories,
        searchQuery,
      };
      sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota or private-mode restrictions
    }
  }, [
    selectedCategory,
    selectedLocations,
    selectedDays,
    selectedCostCategories,
    searchQuery,
  ]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedLocations([]);
    setSelectedDays([]);
    setSelectedCostCategories([]);
    setSearchQuery('');
  }, []);

  const saveDirectoryScrollPosition = useCallback((scrollY: number) => {
    const safeY = Number.isFinite(scrollY) && scrollY >= 0 ? scrollY : 0;
    pendingScrollYRef.current = safeY;
    try {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, String(safeY));
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const peekDirectoryScrollPosition = useCallback(() => {
    return pendingScrollYRef.current;
  }, []);

  const clearDirectoryScrollPosition = useCallback(() => {
    pendingScrollYRef.current = null;
    try {
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadGroups() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/groups', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Unable to load groups (status ${res.status})`);
        }
        const data = (await res.json()) as GroupsApiResponse;
        if (!active) return;
        setGroups(Array.isArray(data.records) ? data.records : []);
        setIsFallback(Boolean(data.isFallback));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load groups right now.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadGroups();
    return () => {
      active = false;
    };
  }, [fetchNonce]);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        isFallback,
        bannerDismissed,
        dismissBanner: () => setBannerDismissed(true),
        loading,
        error,
        reload: () => setFetchNonce((n) => n + 1),
        selectedCategory,
        setSelectedCategory,
        selectedLocations,
        setSelectedLocations,
        selectedDays,
        setSelectedDays,
        selectedCostCategories,
        setSelectedCostCategories,
        searchQuery,
        setSearchQuery,
        clearAllFilters,
        saveDirectoryScrollPosition,
        peekDirectoryScrollPosition,
        clearDirectoryScrollPosition,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups(): GroupsContextValue {
  const ctx = useContext(GroupsContext);
  if (!ctx) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return ctx;
}
