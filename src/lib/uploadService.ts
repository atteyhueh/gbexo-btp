// uploadService.ts - Service centralisé pour les uploads

export const uploadService = {
    /**
     * Upload une image vers ImgBB
     */
    uploadImage: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('image', file);
  
      const response = await fetch(
        'https://api.imgbb.com/1/upload?key=251ac2f178688b4ed065eefc7cff049e',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error('Échec du téléchargement de l\'image');
      }
  
      const data = await response.json();
      return data.data.url;
    },
  
    /**
     * Upload une vidéo vers Cloudinary
     */
    uploadVideo: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Gbexobtp'); // À configurer dans Cloudinary
      formData.append('cloud_name', 'dcfk7tioq'); // Votre cloud name Cloudinary
  
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dcfk7tioq/video/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error('Échec du téléchargement de la vidéo');
      }
  
      const data = await response.json();
      return data.secure_url;
    },
  
    /**
     * Upload automatique selon le type de fichier
     */
    uploadFile: async (file: File): Promise<{ url: string; type: 'image' | 'video' }> => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
  
      if (!isVideo && !isImage) {
        throw new Error('Format de fichier non supporté');
      }
  
      if (isVideo) {
        const url = await uploadService.uploadVideo(file);
        return { url, type: 'video' };
      } else {
        const url = await uploadService.uploadImage(file);
        return { url, type: 'image' };
      }
    },
  };