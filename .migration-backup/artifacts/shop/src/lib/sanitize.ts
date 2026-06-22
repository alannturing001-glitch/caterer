export function sanitize(text: string | null | undefined): string {
  if (!text) return '';
  if (typeof window !== 'undefined') {
    // Client-side: basic HTML stripping
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
}

export function sanitizeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
}
