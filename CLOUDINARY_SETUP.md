# Cloudinary Setup Instructions for Employee Creator

This document provides step-by-step instructions for setting up Cloudinary to handle employee profile photo uploads.

## Prerequisites

You already have a Cloudinary account with the following details:

- **Cloud Name**: `rbalendra`
- **API Key**: `428873389548983`
- **API Secret**: `Vw0guav98bYU3fIiBODR1zr8Ct8`

## Step 1: Create an Upload Preset

An upload preset is required for unsigned uploads (client-side uploads without exposing your API secret).

1. **Log in to your Cloudinary Dashboard**

   - Go to [https://cloudinary.com/console](https://cloudinary.com/console)

2. **Navigate to Upload Settings**

   - Click on **Settings** (gear icon) in the top right
   - Select **Upload** from the left sidebar

3. **Create a New Upload Preset**

   - Scroll down to **Upload presets** section
   - Click **Add upload preset**

4. **Configure the Upload Preset**

   - **Preset name**: `employee_photos`
   - **Signing Mode**: Select **Unsigned** (this is crucial for client-side uploads)
   - **Folder**: `employee-photos` (optional, helps organize uploads)
   - **Resource type**: `Image`
   - **Format**: `Auto`
   - **Quality**: `Auto`
   - **Max file size**: `5000000` (5MB)
   - **Max image width**: `1000` (optional, for optimization)
   - **Max image height**: `1000` (optional, for optimization)

5. **Save the Preset**
   - Click **Save** at the bottom of the form

## Step 2: Environment Variables

The application is already configured to use the following environment variables in your `.env` file:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=rbalendra
VITE_CLOUDINARY_UPLOAD_PRESET=employee_photos
```

**Important**: Never include your API key or API secret in client-side code or environment variables that start with `VITE_`. The unsigned upload preset allows secure uploads without exposing these credentials.

## Step 3: Security Considerations

### What's Secure:

- ✅ Using unsigned upload presets
- ✅ File type validation (images only)
- ✅ File size limits (5MB max)
- ✅ Folder organization
- ✅ Cloud name and preset name are safe to expose

### What to Keep Secret:

- ❌ Never expose API Key in client-side code
- ❌ Never expose API Secret in client-side code
- ❌ Don't use signed uploads from the client side

## Step 4: Testing the Setup

1. **Start your development server**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Test image upload**:
   - Navigate to the Add Employee page
   - Select an image file using the file input
   - Verify the image uploads and appears in the preview
   - Check your Cloudinary dashboard to see the uploaded image

## Step 5: Cloudinary Dashboard Verification

After uploading images, you can verify they're being stored correctly:

1. Go to your Cloudinary Dashboard
2. Click on **Media Library** in the left sidebar
3. Look for the `employee-photos` folder
4. Your uploaded images should appear there

## Troubleshooting

### Common Issues:

1. **"Upload preset not found" error**

   - Verify the preset name matches exactly: `employee_photos`
   - Ensure the preset is set to "Unsigned"

2. **CORS errors**

   - This shouldn't happen with Cloudinary, but if it does, check your browser's developer console
   - Ensure you're using the correct upload URL format

3. **File size errors**

   - Check that your upload preset has the correct max file size setting
   - The client-side validation limits files to 5MB

4. **Environment variables not loading**
   - Ensure your `.env` file is in the frontend directory
   - Restart your development server after changing `.env` files
   - Verify variable names start with `VITE_` for Vite to pick them up

### Debugging Tips:

1. **Check the browser console** for detailed error messages
2. **Check the Network tab** in developer tools to see the actual request/response
3. **Verify the upload preset** exists and is configured correctly in your Cloudinary dashboard

## Production Deployment

When deploying to production:

1. **Set environment variables** in your deployment platform
2. **Consider additional security measures**:
   - Set up more restrictive upload presets
   - Implement server-side image processing if needed
   - Consider using signed uploads for additional security

## Additional Features (Optional)

You can enhance the image upload functionality by configuring additional options in your upload preset:

- **Image transformations**: Automatic resizing, cropping, format conversion
- **Content moderation**: Automatic detection of inappropriate content
- **Backup**: Automatic backup to additional storage
- **Notifications**: Webhooks for upload events

For more advanced features, refer to the [Cloudinary Documentation](https://cloudinary.com/documentation).
