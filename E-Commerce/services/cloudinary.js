const CLOUDINARY_CONFIG = {
  cloudName: 'dvqgrrgvu', // Encontre no dashboard do Cloudinary
  uploadPreset: 'react-native', // Crie um upload preset não assinado
  apiKey: 's642258865725365', // Opcional para uploads assinados
  apiSecret: 'ZiAhRIEKN3wAyP_VUbDVazM-R-Q' // Opcional para uploads assinados
};


export const uploadToCloudinary = async (imageUri) => {
  try {
    console.log('Iniciando upload para Cloudinary...');

    // Prepara o FormData
    const formData = new FormData();
    
    // Adiciona o arquivo
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri: imageUri,
      type: type,
      name: filename || 'upload.jpg'
    });

    // Adiciona os parâmetros de upload
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    
    // Opcional: organizar em pasta
    formData.append('folder', 'produtos');

    // Faz a requisição de upload
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.secure_url) {
      console.log('Upload realizado com sucesso:', data.secure_url);
      return data.secure_url; // ← RETORNA APENAS A URL
    } else {
      throw new Error('URL não retornada pelo Cloudinary');
    }
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error);
    throw error; // Propaga o erro para ser tratado no componente
  }
};

export default {
  uploadToCloudinary
};