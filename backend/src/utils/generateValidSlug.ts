function generateSlug(text: string): string {
    return text
        .toLowerCase() // convert to lowercase
        .trim() // remove leading/trailing spaces
        .replace(/[^a-z0-9\s-]/g, '') // remove special characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // collapse multiple hyphens
        .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}
  
export function generateValidSlug(text: string): string {
    if (!text) {
        throw new Error("Text cannot be empty");
    }
    return generateSlug(text);
}