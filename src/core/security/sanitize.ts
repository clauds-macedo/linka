const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const SCRIPT_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const HTML_TAG_PATTERN = /<[^>]*>/g;
const URL_PATTERN = /javascript:/gi;
const EVENT_HANDLER_PATTERN = /on\w+\s*=/gi;

export const sanitizeHtml = (input: string): string => {
  return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] ?? char);
};

export const stripHtmlTags = (input: string): string => {
  return input
    .replace(SCRIPT_PATTERN, '')
    .replace(HTML_TAG_PATTERN, '')
    .replace(URL_PATTERN, '')
    .replace(EVENT_HANDLER_PATTERN, '');
};

export const sanitizeMessage = (input: string, maxLength = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();
  sanitized = stripHtmlTags(sanitized);
  sanitized = sanitized.slice(0, maxLength);
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
};

export const sanitizeUserName = (input: string, maxLength = 50): string => {
  if (!input || typeof input !== 'string') {
    return 'Anônimo';
  }

  let sanitized = input.trim();
  sanitized = stripHtmlTags(sanitized);
  sanitized = sanitized.replace(/[<>'"&]/g, '');
  sanitized = sanitized.slice(0, maxLength);

  return sanitized || 'Anônimo';
};

export const sanitizeRoomId = (input: string): string | null => {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const sanitized = input.replace(/[^a-zA-Z0-9-_]/g, '');
  
  if (sanitized.length < 5 || sanitized.length > 50) {
    return null;
  }

  return sanitized;
};

export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const isStrongPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos um número');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
