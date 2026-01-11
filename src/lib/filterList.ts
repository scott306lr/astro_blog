export type FilterListConfig = {
  inputId: string;
  itemSelector: string;
  emptyId?: string;
};

declare global {
  interface Window {
    __filterListConfigs?: FilterListConfig[];
    __filterListInitDone?: boolean;
  }
}

function isConfigEqual(a: FilterListConfig, b: FilterListConfig) {
  return a.inputId === b.inputId && a.itemSelector === b.itemSelector && a.emptyId === b.emptyId;
}

function registerConfig(config: FilterListConfig) {
  const list = (window.__filterListConfigs ??= []);
  if (list.some((existing) => isConfigEqual(existing, config))) return;
  list.push(config);
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.toLowerCase() : '';
}

function initOne(config: FilterListConfig) {
  const input = document.getElementById(config.inputId);
  if (!(input instanceof HTMLInputElement)) return;

  if (input.dataset.filterBound === 'true') return;
  input.dataset.filterBound = 'true';

  const empty = config.emptyId ? document.getElementById(config.emptyId) : null;
  const items = Array.from(document.querySelectorAll(config.itemSelector));

  function apply() {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    for (const el of items) {
      if (!(el instanceof HTMLElement)) continue;
      const hay = normalizeText(el.getAttribute('data-filter-text'));
      const show = !q || hay.includes(q);
      el.classList.toggle('hidden', !show);
      if (show) visible++;
    }

    if (empty instanceof HTMLElement) empty.classList.toggle('hidden', visible !== 0);
  }

  input.addEventListener('input', apply);
  apply();
}

export function registerFilterList(config: FilterListConfig) {
  if (typeof window === 'undefined') return;
  registerConfig(config);

  if (window.__filterListInitDone) return;
  window.__filterListInitDone = true;

  function initAll() {
    for (const cfg of window.__filterListConfigs ?? []) initOne(cfg);
  }

  // astro:page-load fires on initial load and client navigations.
  document.addEventListener('astro:page-load', initAll);

  // Defensive: handle cases where this registers after initial page-load.
  queueMicrotask(initAll);
}
