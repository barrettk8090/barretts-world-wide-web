interface CloudflareImage {
    id: string;
    filename: string;
    metadata: Record<string, string>;
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