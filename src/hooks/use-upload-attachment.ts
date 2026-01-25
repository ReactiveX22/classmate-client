import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface UploadResult {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'image' | 'video' | 'link';
  size: number;
  mimeType: string;
}

interface UploadAttachmentParams {
  classroomId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export function useUploadAttachment() {
  return useMutation({
    mutationFn: async ({
      classroomId,
      file,
      onProgress,
    }: UploadAttachmentParams): Promise<UploadResult> => {
      const formData = new FormData();
      formData.append('file', file);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        xhr.open('POST', `/api/v1/classrooms/${classroomId}/posts/upload`);
        xhr.send(formData);
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload file');
    },
  });
}
