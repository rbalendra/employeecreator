/**
 * Cloudinary Configuration for Employee Profile Photo Uploads
 *
 * This file contains the configuration settings for uploading employee profile photos
 * to Cloudinary using their REST API. The configuration uses environment variables
 * for security and flexibility across different environments.
 *
 * Prerequisites:
 * 1. Create a Cloudinary account at https://cloudinary.com
 * 2. Get your cloud name from the dashboard
 * 3. Create an unsigned upload preset in Settings > Upload > Add upload preset
 * 4. Set the preset to "unsigned" to allow client-side uploads without authentication
 */

// Extract Cloudinary configuration from Vite environment variables
// Note: Vite requires the VITE_ prefix for client-side access to env vars
export const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
export const uploadPreset = import.meta.env
	.VITE_CLOUDINARY_UPLOAD_PRESET as string

// Cloudinary's REST API endpoint for unsigned uploads
// This endpoint allows direct uploads from the browser without exposing API secrets
export const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

// Configuration validation - ensure required environment variables are set
if (!cloudName || !uploadPreset) {
	throw new Error(
		'Missing Cloudinary configuration. Please ensure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set in your .env file'
	)
}
