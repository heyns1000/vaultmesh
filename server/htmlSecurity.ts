/**
 * VaultMesh HTML Security System
 * Pure HTML rendering with security only - no modifications
 */

import { Request, Response } from 'express';

// HTML Security Interface
interface SecureHTML {
  id: string;
  originalHTML: string;
  securedHTML: string;
  timestamp: Date;
}

// Storage for secured HTML
const securedHTMLStorage: Map<string, SecureHTML> = new Map();

// Pure HTML Security Function
export function secureHTMLOnly(html: string): string {
  // Only security - remove dangerous scripts but preserve everything else exactly
  let secured = html;
  
  // Remove only script tags for security
  secured = secured.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- script removed for security -->');
  
  // Remove event handlers for security
  secured = secured.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Everything else stays exactly as-is
  return secured;
}

// Store and render HTML with security only
export function storeSecureHTML(html: string): string {
  const id = `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const securedHTML = secureHTMLOnly(html);
  
  const secureRecord: SecureHTML = {
    id,
    originalHTML: html,
    securedHTML,
    timestamp: new Date()
  };
  
  securedHTMLStorage.set(id, secureRecord);
  
  console.log(`[VaultMesh Security] HTML secured and stored: ${id}`);
  return id;
}

// Render secured HTML exactly as-is
export function renderSecuredHTML(id: string): string {
  const record = securedHTMLStorage.get(id);
  if (!record) return '';
  
  // Return HTML exactly as-is with only security applied
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VaultMesh Secured HTML</title>
</head>
<body>
${record.securedHTML}
</body>
</html>`;
}

// Route Handlers
export const htmlSecurityRoutes = {
  // Store HTML with security
  secureStore: async (req: Request, res: Response) => {
    try {
      const { html } = req.body;
      
      if (!html) {
        return res.status(400).json({ error: 'HTML content required' });
      }

      const id = storeSecureHTML(html);
      
      res.json({
        success: true,
        id,
        message: 'HTML secured and stored',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultMesh Security] Store error:', error);
      res.status(500).json({ 
        error: 'HTML security store failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Render secured HTML
  renderSecure: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const html = renderSecuredHTML(id);
      
      if (!html) {
        return res.status(404).json({ error: 'Secured HTML not found' });
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('[VaultMesh Security] Render error:', error);
      res.status(500).json({ 
        error: 'HTML security render failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get all secured HTML records
  getSecuredList: async (req: Request, res: Response) => {
    try {
      const records = Array.from(securedHTMLStorage.entries()).map(([id, record]) => ({
        id,
        timestamp: record.timestamp,
        size: record.originalHTML.length,
        secured: true
      }));

      res.json({
        success: true,
        data: records,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultMesh Security] List error:', error);
      res.status(500).json({ 
        error: 'Failed to get secured HTML list',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};