export const STATUS_TONES = {
  // Registrations / orders
  CONFIRMED: 'green',
  PAID: 'green',
  CAPTURED: 'green',
  ACTIVE: 'green',
  LIVE: 'green',
  PUBLISHED: 'green',
  SENT: 'green',

  PENDING: 'amber',
  PAYMENT_PENDING: 'amber',
  CREATED: 'amber',
  AUTHORIZED: 'amber',
  PENDING_VERIFICATION: 'amber',
  DRAFT: 'amber',

  USED: 'blue',
  CLOSED: 'zinc',
  INACTIVE: 'zinc',
  EXPIRED: 'zinc',

  FAILED: 'red',
  CANCELLED: 'red',
  SUSPENDED: 'red',
  REFUNDED: 'purple',
  REFUND: 'purple',
};

export const tenantToneFor = (status) => STATUS_TONES[status] || 'zinc';

export const TICKET_TYPE_OPTIONS = [
  { value: 'TEXT', label: 'Short text' },
  { value: 'TEXTAREA', label: 'Long text' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'SELECT', label: 'Dropdown' },
  { value: 'RADIO', label: 'Single choice' },
  { value: 'CHECKBOX', label: 'Checkboxes' },
  { value: 'DATE', label: 'Date' },
  { value: 'FILE', label: 'File upload' },
];

export const CHOICE_FIELD_TYPES = ['SELECT', 'RADIO', 'CHECKBOX'];

export default { STATUS_TONES, tenantToneFor, TICKET_TYPE_OPTIONS, CHOICE_FIELD_TYPES };
