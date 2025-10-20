import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'allison-pena-curriculum-es.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="curriculum-allison-pena.pdf"'
      }
    });
  } catch (error) {
    return new Response('PDF not found', { status: 404 });
  }
};