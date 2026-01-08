export interface CloudflareImage {
    id: string;
    filename: string;
    meta?: {
      category?: 'personal' | 'professional';
      alt_text?: string;
    };
    requireSignedURLs: boolean;
    uploaded: string;
    variants: string[];
  }
  
  export async function listAllImages(): Promise<CloudflareImage[]> {
    const response = await fetch('/.netlify/functions/images');
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
  
    return response.json();
  }