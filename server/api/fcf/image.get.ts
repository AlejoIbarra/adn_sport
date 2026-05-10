import { fcfFetch } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing image ID',
    })
  }

  // Fetch the image JSON from Analyticom
  // We use organizationIdFilter=329 as provided by the user
  const url = `https://api-latam.analyticom.de/api/live/FCF/images/${id}?organizationIdFilter=329`
  
  try {
    const data: any = await fcfFetch(url)

    if (!data || !data.value) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found or invalid response',
      })
    }

    // Extract content type and base64 value
    const contentType = data.contentType || 'image/png'
    const imageBuffer = Buffer.from(data.value, 'base64')

    // Set headers and return the binary data
    setResponseHeader(event, 'Content-Type', contentType)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=604800, immutable') // Cache for 7 days
    
    return imageBuffer
  } catch (error: any) {
    console.error(`[IMAGE PROXY ERROR] ID ${id}:`, error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error proxying image',
    })
  }
})
