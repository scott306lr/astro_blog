type PublicationLinkKey = 'paper' | 'code' | 'project';

type EventLinkKey = 'url' | 'slides' | 'video';

type ExperienceLinkKey = 'org' | 'project' | 'paper';

function assertObject(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string' || v.trim().length === 0)) {
    throw new Error(`${label} must be an array of non-empty strings`);
  }
}

function assertBooleanIfPresent(
  value: unknown,
  label: string,
): asserts value is boolean | undefined {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new Error(`${label} must be a boolean if present`);
  }
}

function assertLinksObject(
  value: unknown,
  label: string,
  allowedKeys: readonly string[],
): asserts value is Record<string, string> {
  if (value === undefined) return;
  assertObject(value, label);
  for (const [key, v] of Object.entries(value)) {
    if (!allowedKeys.includes(key)) {
      throw new Error(`${label} has unknown key: ${key}`);
    }
    assertString(v, `${label}.${key}`);
  }
}

function assertIsoDate(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} must be YYYY-MM-DD`);
  }
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) {
    throw new Error(`${label} must be a valid date`);
  }
}

export type Publication = {
  title: string;
  authors: string[];
  date: string; // YYYY-MM-DD
  venue?: string;
  kind?: 'paper' | 'preprint' | 'thesis' | 'poster' | 'talk';
  links?: Partial<Record<PublicationLinkKey, string>>;
  featured?: boolean;
};

export type Event = {
  title: string;
  date: string; // YYYY-MM-DD
  location?: string;
  kind?: 'talk' | 'workshop' | 'conference' | 'seminar' | 'award' | 'other';
  links?: Partial<Record<EventLinkKey, string>>;
};

export type Experience = {
  org: string;
  role: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  location?: string;
  highlights: string[];
  links?: Partial<Record<ExperienceLinkKey, string>>;
  featured?: boolean;
};

export function validatePublications(value: unknown): Publication[] {
  if (!Array.isArray(value)) throw new Error('publications.json must be an array');

  return value.map((item, index) => {
    assertObject(item, `publications[${index}]`);

    assertString(item.title, `publications[${index}].title`);
    assertStringArray(item.authors, `publications[${index}].authors`);
    assertIsoDate(item.date, `publications[${index}].date`);

    if (item.venue !== undefined) assertString(item.venue, `publications[${index}].venue`);
    if (item.kind !== undefined) {
      assertString(item.kind, `publications[${index}].kind`);
    }
    assertBooleanIfPresent(item.featured, `publications[${index}].featured`);
    assertLinksObject(item.links, `publications[${index}].links`, ['paper', 'code', 'project']);

    return item as Publication;
  });
}

export function validateEvents(value: unknown): Event[] {
  if (!Array.isArray(value)) throw new Error('events.json must be an array');

  return value.map((item, index) => {
    assertObject(item, `events[${index}]`);

    assertString(item.title, `events[${index}].title`);
    assertIsoDate(item.date, `events[${index}].date`);

    if (item.location !== undefined) assertString(item.location, `events[${index}].location`);
    if (item.kind !== undefined) {
      assertString(item.kind, `events[${index}].kind`);
    }
    assertLinksObject(item.links, `events[${index}].links`, ['url', 'slides', 'video']);

    return item as Event;
  });
}

export function validateExperience(value: unknown): Experience[] {
  if (!Array.isArray(value)) throw new Error('experience.json must be an array');

  return value.map((item, index) => {
    assertObject(item, `experience[${index}]`);

    assertString(item.org, `experience[${index}].org`);
    assertString(item.role, `experience[${index}].role`);
    assertIsoDate(item.startDate, `experience[${index}].startDate`);
    if (item.endDate !== undefined) assertIsoDate(item.endDate, `experience[${index}].endDate`);
    if (item.location !== undefined) assertString(item.location, `experience[${index}].location`);
    assertStringArray(item.highlights, `experience[${index}].highlights`);
    assertBooleanIfPresent(item.featured, `experience[${index}].featured`);
    assertLinksObject(item.links, `experience[${index}].links`, ['org', 'project', 'paper']);

    if (item.endDate !== undefined) {
      const start = new Date(item.startDate).getTime();
      const end = new Date(item.endDate).getTime();
      if (end < start) {
        throw new Error(`experience[${index}].endDate must be >= startDate`);
      }
    }

    return item as Experience;
  });
}

export function sortByDateStringDesc<T extends { date: string }>(a: T, b: T) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
