// src/utils/handleFileUpload.ts
type UploadOptions = {
    allowedTypes?: string[];
    maxSizeMB?: number;
    endpoint?: string;
};

type UploadResult =
    | { success: true; url: string }
    | { success: false; error: string };

export const handleFileUpload = async (file: File | null, options?: UploadOptions): Promise<UploadResult> => {
    
    if (!file) {
        return { success: false, error: 'No file selected.' };
    }

    const {
        allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
        maxSizeMB = 5,
        endpoint = '/api/upload-documents'
    } = options || {};

    if (!allowedTypes.includes(file.type)) {
        return {
            success: false,
            error: 'Invalid file type. Only JPG, PNG, and PDF are allowed.'
        };
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
        return {
            success: false,
            error: `File size exceeds ${maxSizeMB}MB limit.`
        };
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            return {
                success: false,
                error: data.message || data.error || 'File upload failed.'
            };
        }

        if (!data.url) {
            return {
                success: false,
                error: 'No file URL returned from server.'
            };
        }

        return { success: true, url: data.url };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'File upload failed.'
        };
    }
};