export async function uploadToCloudinary(file: File): Promise<{
  url: string | null
  error: string
}> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  const uploadFolder = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER

  if (!cloudName || !uploadPreset) {
    return {
      url: null,
      error: 'Falta configurar Cloudinary en variables de entorno.',
    }
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (uploadFolder) formData.append('folder', uploadFolder)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const rawBody = await response.text()
    let data: {
      secure_url?: string
      error?: { message?: string }
    } = {}

    try {
      data = JSON.parse(rawBody) as {
        secure_url?: string
        error?: { message?: string }
      }
    } catch {
      // Cloudinary can return non-JSON payloads for some failures.
    }

    if (!response.ok || !data.secure_url) {
      return {
        url: null,
        error:
          data.error?.message ??
          'Cloudinary rechazó la imagen o devolvió una respuesta inválida. Revisá preset/carpeta.',
      }
    }

    return { url: data.secure_url, error: '' }
  } catch {
    return {
      url: null,
      error: 'Error de red al subir la imagen. Intentá de nuevo.',
    }
  }
}
