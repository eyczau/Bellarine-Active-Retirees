export type PrimaryCategory =
  | 'Move'
  | 'Nature'
  | 'Create'
  | 'Connect'
  | 'Give Back'
  | 'Learn'
  | 'Play';

export interface GroupRecord {
  id: string;
  groupName: string;
  location: string;
  townLocation: string;
  days: string[];
  daysText: string;
  costCategories: string[];
  costCategoryText: string;
  imageUrl: string | null;
  categories: string[];
  aboutTheGroup: string;
  groupDetailedInformation: string;
  yourFirstVisit: string;
  getInvolved: string;
  moreInformation: string;
  website: string | null;
  bestContact: string;
  facebook: string | null;
  email: string;
  phone: string;
}

export interface GroupsApiResponse {
  isFallback: boolean;
  records: GroupRecord[];
}

export interface AdvertiserInquiryPayload {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  message: string;
}
