import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { GroupRecord } from './src/types/group.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AIRTABLE_BASE_ID = 'app9QGRbfrRITJGdo';
const DEFAULT_TABLE_NAME = 'Groups & Activities';
const DEFAULT_UPDATES_TABLE_NAME = 'Update Requests';
const DEFAULT_ADVERTISERS_TABLE_NAME = 'Advertising Inquiries';
const PORT = Number(process.env.PORT) || 3000;

interface AirtableAttachment {
  url?: string;
}

interface AirtableFields {
  'Group Name'?: unknown;
  Location?: unknown;
  'Town / Location'?: unknown;
  Days?: unknown;
  'Day of Week'?: unknown;
  Image?: unknown;
  Category?: unknown;
  'Cost Category'?: unknown;
  'About the Group'?: unknown;
  'Group Detailed Information'?: unknown;
  'Your First Visit'?: unknown;
  'Get Involved'?: unknown;
  'More Information'?: unknown;
  Website?: unknown;
  'Best Contact'?: unknown;
  Facebook?: unknown;
  Email?: unknown;
  Phone?: unknown;
  Phase?: unknown;
}

interface AirtableApiRecord {
  id: string;
  fields?: AirtableFields;
}

interface AirtableApiResponse {
  records?: AirtableApiRecord[];
  offset?: string;
}

const FALLBACK_GROUPS: GroupRecord[] = [
  {
    id: 'fallback-drysdale-bushcare',
    groupName: 'Drysdale Lake Lorne Bushcare & Walkers',
    location: 'Drysdale',
    townLocation: 'Drysdale — Lake Lorne Reserve',
    days: ['Tuesday'],
    daysText: 'Tuesdays, 9:00 AM – 11:30 AM',
    costCategories: ['Free'],
    costCategoryText: 'Free',
    imageUrl: '/src/assets/images/drysdale_bushcare_walkers_1795225133991.jpg',
    categories: ['Nature', 'Give Back', 'Move'],
    aboutTheGroup:
      'Friendly Tuesday lakeside walks and gentle native bushcare around Lake Lorne.',
    groupDetailedInformation:
      'A friendly, easy-paced group of Bellarine locals who love spending Tuesday mornings outdoors around Lake Lorne and the Bellarine Rail Trail.\n\nEach session starts with an optional 30-minute flat lakeside stroll, followed by gentle native planting, weeding, and habitat care with plenty of chats along the way.',
    yourFirstVisit:
      'Meet us beside the Lake Lorne rotunda near the car park off Reserve Road. Wear sturdy closed-toe shoes, a sun hat, and bring a water bottle.\n\nNo gardening experience is needed — we supply gloves, hand tools, and a warm morning tea at 10:45 AM under the gum trees. Just turn up and say hello to Margaret or Ron!',
    getInvolved:
      '• Come along any Tuesday morning — no ongoing commitment required\n• Join just for the flat lakeside walk, the bushcare, or both\n• Help out with morning tea thermos duty once a month if you enjoy baking',
    moreInformation:
      'Free to attend. Accessible concrete and compacted gravel paths around the main lake loop, with public toilets and easy parking right next to our meeting spot.',
    website: 'https://www.bellarinecoastalcare.example.org.au',
    bestContact: 'Margaret Henderson (Coordinator)',
    facebook: 'https://www.facebook.com',
    email: 'lakelorne.walkers@bellarine-community.example.org',
    phone: '0412 345 678',
  },
  {
    id: 'fallback-ocean-grove-art',
    groupName: 'Ocean Grove Coastal Art & Sketching Circle',
    location: 'Ocean Grove',
    townLocation: 'Ocean Grove — Surfside Community Hub',
    days: ['Wednesday'],
    daysText: 'Wednesdays, 10:00 AM – 12:30 PM',
    costCategories: ['Gold Coin'],
    costCategoryText: 'Gold Coin',
    imageUrl: '/src/assets/images/ocean_grove_art_studio_1795225133824.jpg',
    categories: ['Create', 'Learn', 'Connect'],
    aboutTheGroup:
      'Relaxed coastal watercolour and sketching mornings in our sunlit Ocean Grove studio.',
    groupDetailedInformation:
      'Whether you have painted for decades or have never held a watercolour brush since school, our bright sunlit studio overlooking the dunes is a relaxed place to create.\n\nWe share simple coastal landscape demonstrations, swap tips over tea and biscuits, and encourage every person to enjoy their own creative pace.',
    yourFirstVisit:
      'Your first two Wednesday sessions are completely free, and we lend out starter watercolour palettes, paper, and brushes so you do not need to buy a thing.\n\nWhen you arrive at Surfside Community Hub on Hodgson Street, follow the ramp to Studio Room 2 where Helen will welcome you at the door and make you a cuppa.',
    getInvolved:
      '• Try watercolours, pastels, acrylics, or simple pencil sketching\n• Optional local café lunch together after studio once a month\n• Exhibit a favourite piece in our annual Bellarine Seniors Art Show',
    moreInformation:
      '$5 gold coin contribution after your first two free visits to cover studio room hire and tea/coffee supplies. Wheelchair accessible entry and drop-off bay.',
    website: 'https://www.oceangroveart.example.org.au',
    bestContact: 'Helen McAllister (Studio Host)',
    facebook: 'https://www.facebook.com',
    email: 'hello@oceangroveart.example.org',
    phone: '03 5255 0192',
  },
  {
    id: 'fallback-portarlington-bocce',
    groupName: 'Portarlington Foreshore Social Bocce & Coffee',
    location: 'Portarlington',
    townLocation: 'Portarlington — Pier Street Foreshore Lawn',
    days: ['Thursday'],
    daysText: 'Thursdays, 1:30 PM – 3:30 PM',
    costCategories: ['Free'],
    costCategoryText: 'Free',
    imageUrl: '/src/assets/images/portarlington_foreshore_bocce_1795225133880.jpg',
    categories: ['Play', 'Connect', 'Move'],
    aboutTheGroup:
      'Light-hearted social bocce by the bay followed by coffee on Pier Street.',
    groupDetailedInformation:
      'Light-hearted social bocce right on the grassy foreshore overlooking Port Phillip Bay. Our focus is laughter, gentle movement, and making new neighbours feel at home — never strict competition.\n\nAfter two relaxed games, most of us wander across to the Pier Street bakery for a coffee and a catch-up.',
    yourFirstVisit:
      'No equipment or prior bocce knowledge needed — we have four full sets of boules ready to borrow. Simply wear flat-soled shoes and a hat.\n\nLook for our group near the big Norfolk pine trees beside the Portarlington rotunda. Peter will pair you up straight away in a friendly doubles team.',
    getInvolved:
      '• Drop in whenever the weather is fine — rain-day backup is indoor board games at the Neighbourhood House\n• Bring along a friend or come solo; everyone mixes teams each week\n• Help set out the light boundary cones if you arrive five minutes early',
    moreInformation:
      'No membership fee. Flat level lawn right next to foreshore seating, shaded picnic tables, and accessible public amenities.',
    website: null,
    bestContact: 'Peter Sullivan (Group Organiser)',
    facebook: 'https://www.facebook.com',
    email: 'bocce@portarlington-locals.example.org',
    phone: '0428 774 310',
  },
  {
    id: 'fallback-queenscliff-harbour',
    groupName: 'Queenscliff Harbour Maritime Heritage Volunteers',
    location: 'Queenscliff',
    townLocation: 'Queenscliff — Historic Boat Shed & Pier',
    days: ['Friday', 'Sunday'],
    daysText: 'Fridays & Sundays, 9:30 AM – 1:00 PM',
    costCategories: ['Free'],
    costCategoryText: 'Free',
    imageUrl: '/src/assets/images/queenscliff_harbour_volunteers_1795225134179.jpg',
    categories: ['Give Back', 'Learn', 'Connect'],
    aboutTheGroup:
      'Share maritime stories and welcome guests at the historic Queenscliff boathouse.',
    groupDetailedInformation:
      'Share the rich maritime stories of Port Phillip Heads with visiting families and fellow locals. Our volunteers help welcome guests at the historic boathouse, care for local timber boat displays, and preserve archival photographs.\n\nMany members joined looking for purposeful retirement routines and stayed for the lifelong friendships.',
    yourFirstVisit:
      'Drop in for a relaxed 30-minute walk-through with our roster coordinator Sue before deciding if you would like to join a shift.\n\nYou will never be thrown in the deep end — new volunteers always shadow an experienced guide for their first few mornings.',
    getInvolved:
      '• Front-desk visitor welcoming (seated option available)\n• Story sharing and short guided harbour walks\n• Archival photo scanning and oral history recording indoors',
    moreInformation:
      'Full orientation, volunteer vest, and free hot drinks provided during every shift. Easy level parking beside the Harbour precinct.',
    website: 'https://www.queenscliffheritage.example.org.au',
    bestContact: 'Sue & Graham Clarke (Volunteer Coordinators)',
    facebook: 'https://www.facebook.com',
    email: 'volunteers@queenscliffmaritime.example.org',
    phone: '03 5258 0411',
  },
];

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function sanitizeServerUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const schemeMatch = /^([a-zA-Z][a-zA-Z\d+\-.]*):/.exec(trimmed);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') {
      return null;
    }
  }
  const candidate = schemeMatch ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function extractImageUrl(imageField: unknown): string | null {
  if (!Array.isArray(imageField) || imageField.length === 0) {
    return null;
  }
  const first = imageField[0] as AirtableAttachment | undefined;
  return sanitizeServerUrl(first?.url);
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function extractLocation(fields: AirtableFields): { location: string; townLocation: string } {
  const rawLocation = Array.isArray(fields.Location)
    ? asStringArray(fields.Location).join(', ')
    : asString(fields.Location);
  const rawTownLocation = asString(fields['Town / Location']);

  if (rawLocation && rawTownLocation) {
    return { location: rawLocation, townLocation: rawTownLocation };
  }
  if (rawLocation) {
    return { location: rawLocation, townLocation: rawLocation };
  }
  if (rawTownLocation) {
    const firstPart = rawTownLocation.split(/\s*[—–-]\s*/)[0]?.trim() || rawTownLocation;
    return { location: firstPart, townLocation: rawTownLocation };
  }
  return { location: '', townLocation: '' };
}

function normalizeDaysList(values: string[]): string[] {
  const found: string[] = [];
  const seen = new Set<string>();

  for (const val of values) {
    let matchedWeekday = false;
    for (const day of WEEKDAYS) {
      if (new RegExp(`\\b${day}s?\\b`, 'i').test(val)) {
        matchedWeekday = true;
        if (!seen.has(day)) {
          seen.add(day);
          found.push(day);
        }
      }
    }
    if (!matchedWeekday && val.trim()) {
      const cleaned = val.trim();
      if (!seen.has(cleaned)) {
        seen.add(cleaned);
        found.push(cleaned);
      }
    }
  }
  return found;
}

function extractDays(fields: AirtableFields): { days: string[]; daysText: string } {
  const rawField = fields.Days !== undefined ? fields.Days : fields['Day of Week'];
  if (Array.isArray(rawField)) {
    const items = asStringArray(rawField);
    return {
      days: normalizeDaysList(items),
      daysText: items.join(', '),
    };
  }
  const text = asString(rawField);
  if (!text) {
    return { days: [], daysText: '' };
  }
  return {
    days: normalizeDaysList([text]),
    daysText: text,
  };
}

function extractCostCategories(rawField: unknown): {
  costCategories: string[];
  costCategoryText: string;
} {
  const items = asStringArray(rawField);
  return {
    costCategories: items,
    costCategoryText: items.join(', '),
  };
}

function mapAirtableRecord(record: AirtableApiRecord): GroupRecord {
  const fields = record.fields ?? {};
  const { location, townLocation } = extractLocation(fields);
  const { days, daysText } = extractDays(fields);
  const { costCategories, costCategoryText } = extractCostCategories(
    fields['Cost Category']
  );

  return {
    id: record.id,
    groupName: asString(fields['Group Name']) || 'Community Group',
    location,
    townLocation,
    days,
    daysText,
    costCategories,
    costCategoryText,
    imageUrl: extractImageUrl(fields.Image),
    categories: asStringArray(fields.Category),
    aboutTheGroup: asString(fields['About the Group']),
    groupDetailedInformation: asString(fields['Group Detailed Information']),
    yourFirstVisit: asString(fields['Your First Visit']),
    getInvolved: asString(fields['Get Involved']),
    moreInformation: asString(fields['More Information']),
    website: sanitizeServerUrl(fields.Website),
    bestContact: asString(fields['Best Contact']),
    facebook: sanitizeServerUrl(fields.Facebook),
    email: asString(fields.Email),
    phone: asString(fields.Phone),
  };
}

async function fetchAirtableGroups(): Promise<{ isFallback: boolean; records: GroupRecord[] }> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim();
  const tableName = process.env.AIRTABLE_TABLE_NAME?.trim() || DEFAULT_TABLE_NAME;

  if (!apiKey) {
    return { isFallback: true, records: FALLBACK_GROUPS };
  }

  try {
    const allRecords: GroupRecord[] = [];
    let offset: string | undefined;
    let pageCount = 0;

    do {
      const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
      const url = new URL(baseUrl);
      url.searchParams.set('filterByFormula', 'OR({Phase} = 1, {Phase} & "" = "1")');
      if (offset) {
        url.searchParams.set('offset', offset);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.warn(`Airtable API returned status ${response.status}; serving fallback records.`);
        return { isFallback: true, records: FALLBACK_GROUPS };
      }

      const data = (await response.json()) as AirtableApiResponse;
      const mapped = (data.records ?? [])
        .map(mapAirtableRecord)
        .filter((item) => item.groupName.length > 0);

      allRecords.push(...mapped);
      offset = typeof data.offset === 'string' && data.offset.length > 0 ? data.offset : undefined;
      pageCount += 1;
    } while (offset && pageCount < 10);

    return { isFallback: false, records: allRecords };
  } catch (error) {
    console.warn('Airtable fetch failed; serving fallback records.', error instanceof Error ? error.message : '');
    return { isFallback: true, records: FALLBACK_GROUPS };
  }
}

async function createAirtableRecord(
  tableName: string,
  fields: Record<string, string>,
  requestLabel: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim();

  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error: `Submissions require AIRTABLE_API_KEY to be configured on the server.`,
    };
  }

  try {
    const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      let errorType = 'UNKNOWN';
      try {
        const errBody = (await response.json()) as { error?: { type?: string } };
        if (typeof errBody?.error?.type === 'string') {
          errorType = errBody.error.type;
        }
      } catch {
        // Ignore non-JSON error body
      }
      console.warn(
        `Airtable ${requestLabel} failed with status ${response.status} (${errorType}).`
      );
      return {
        ok: false,
        status: 502,
        error: `We could not save your ${requestLabel} right now. Please try again shortly.`,
      };
    }

    return { ok: true };
  } catch (error) {
    console.warn(
      `Airtable ${requestLabel} error.`,
      error instanceof Error ? error.message : ''
    );
    return {
      ok: false,
      status: 502,
      error: `We could not reach Airtable to save your ${requestLabel}. Please try again shortly.`,
    };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/groups', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    const payload = await fetchAirtableGroups();
    res.status(200).json(payload);
  });

  app.post('/api/advertiser-inquiries', async (req, res) => {
    const rawBody: unknown = req.body;
    if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
      res.status(400).json({ ok: false, error: 'Invalid request payload.' });
      return;
    }

    const body = rawBody as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const businessName = typeof body.businessName === 'string' ? body.businessName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || name.length > 120) {
      res.status(400).json({ ok: false, error: 'Please enter your name.' });
      return;
    }
    if (!businessName || businessName.length > 160) {
      res.status(400).json({ ok: false, error: 'Please enter your business or organisation name.' });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
      return;
    }
    if (phone.length > 40 || message.length > 2000) {
      res.status(400).json({ ok: false, error: 'One of the fields exceeds the maximum length.' });
      return;
    }

    const advertisersTableName =
      process.env.AIRTABLE_ADVERTISERS_TABLE_NAME?.trim() ||
      DEFAULT_ADVERTISERS_TABLE_NAME;

    const saveResult = await createAirtableRecord(
      advertisersTableName,
      {
        'Contact Name': name,
        'Business Name': businessName,
        Email: email,
        Phone: phone,
        Message: message,
      },
      'advertising inquiry'
    );

    if (!saveResult.ok) {
      res.status(saveResult.status).json({ ok: false, error: saveResult.error });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Thank you for your interest in supporting Bellarine Active Retirees. Our local coordinator will be in touch shortly.',
    });
  });

  app.post('/api/group-change-requests', async (req, res) => {
    const rawBody: unknown = req.body;
    if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
      res.status(400).json({ ok: false, error: 'Invalid request payload.' });
      return;
    }

    const body = rawBody as Record<string, unknown>;
    const groupId = typeof body.groupId === 'string' ? body.groupId.trim() : '';
    const groupName = typeof body.groupName === 'string' ? body.groupName.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const relationship =
      typeof body.relationship === 'string' ? body.relationship.trim() : '';
    const details = typeof body.details === 'string' ? body.details.trim() : '';

    if (!groupId || groupId.length > 100 || !groupName || groupName.length > 200) {
      res.status(400).json({ ok: false, error: 'Missing group information for this request.' });
      return;
    }
    if (!name || name.length > 120) {
      res.status(400).json({ ok: false, error: 'Please enter your name.' });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
      return;
    }
    if (relationship.length > 80) {
      res.status(400).json({ ok: false, error: 'Connection field exceeds the maximum length.' });
      return;
    }
    if (!details || details.length < 5 || details.length > 2000) {
      res.status(400).json({
        ok: false,
        error: 'Please describe what needs to be updated (at least 5 characters).',
      });
      return;
    }

    const updatesTableName =
      process.env.AIRTABLE_UPDATES_TABLE_NAME?.trim() || DEFAULT_UPDATES_TABLE_NAME;

    const saveResult = await createAirtableRecord(
      updatesTableName,
      {
        'Group Name': groupName,
        'Group ID': groupId,
        'Requester Name': name,
        'Requester Email': email,
        Connection: relationship || 'Not specified',
        'Requested Changes': details,
      },
      'update request'
    );

    if (!saveResult.ok) {
      res.status(saveResult.status).json({ ok: false, error: saveResult.error });
      return;
    }

    res.status(200).json({
      ok: true,
      message: `Thank you, ${name}. Your update request for ${groupName} has been sent to our local coordinator.`,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bellarine Active Retirees server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
