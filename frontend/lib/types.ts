export interface LinkItemData {
  id: string;
  title: string;
  url: string;
  order: number;
  click_count: number;
  comment?: string;
}

export interface MultiLinkData {
  id: string;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  items: LinkItemData[];
}

export interface CreateLinkItemPayload {
  title: string;
  url: string;
  comment?: string;
  order: number;
}

export interface CreateMultiLinkPayload {
  title: string;
  description?: string;
  items: CreateLinkItemPayload[];
}

export interface ClickResponse {
  click_count: number;
}
