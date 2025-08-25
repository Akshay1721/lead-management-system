export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'referral', label: 'Referral' },
  { value: 'events', label: 'Events' },
  { value: 'other', label: 'Other' }
];

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
  { value: 'won', label: 'Won' }
];

export const FILTER_OPERATORS = {
  STRING: [
    { value: 'eq', label: 'Equals' },
    { value: 'contains', label: 'Contains' }
  ],
  ENUM: [
    { value: 'eq', label: 'Equals' },
    { value: 'in', label: 'In' }
  ],
  NUMBER: [
    { value: 'eq', label: 'Equals' },
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ],
  DATE: [
    { value: 'on', label: 'On' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' }
  ],
  BOOLEAN: [
    { value: 'eq', label: 'Equals' }
  ]
};