# Image Upload Debugging Guide

## Step-by-Step Troubleshooting

### 1. First, test your Cloudinary configuration

1. Open the test file I created: `cloudinary-test.html` in your browser
2. Try uploading an image using the test form
3. Check the browser console for any errors

### 2. Verify your Cloudinary Upload Preset

**CRITICAL**: You need to create an upload preset in your Cloudinary dashboard.

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Click **Settings** (gear icon) → **Upload**
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `employee_profile` (must match your .env file)
   - **Signing Mode**: **Unsigned** (very important!)
   - **Folder**: `employee-photos`
   - **Resource type**: `Image`
   - **Max file size**: `5000000` (5MB)
6. Click **Save**

### 3. Check your environment variables

Your `.env` file should contain:

```
VITE_CLOUDINARY_CLOUD_NAME=rbalendra
VITE_CLOUDINARY_UPLOAD_PRESET=employee_profile
```

**Important**: Restart your development server after changing `.env` files!

### 4. Test the React application

1. Open http://localhost:5174/ (your Vite dev server)
2. Navigate to "Add Employee" page
3. Open browser Developer Tools (F12)
4. Go to Console tab
5. Try uploading an image
6. Watch for console logs - the enhanced debugging will show:
   - File details
   - Cloudinary configuration
   - Upload progress
   - Response from Cloudinary

### 5. Common Issues and Solutions

#### Issue: "Upload preset not found"

**Solution**:

- Verify the upload preset exists in Cloudinary dashboard
- Check the preset name matches exactly in your `.env` file
- Ensure the preset is set to "Unsigned"

#### Issue: "Invalid signature" or authentication errors

**Solution**:

- Make sure your upload preset is set to "Unsigned"
- Don't include API key/secret in client-side code

#### Issue: CORS errors

**Solution**:

- This is rare with Cloudinary, but if it happens, check your upload preset settings
- Ensure you're using the correct upload URL format

#### Issue: File size errors

**Solution**:

- Check your upload preset max file size setting
- Ensure images are under 5MB

#### Issue: Network errors

**Solution**:

- Check your internet connection
- Verify the Cloudinary service is operational

### 6. Manual Test with cURL

You can test your upload preset manually using cURL:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/rbalendra/upload \
  -F "file=@path/to/your/image.jpg" \
  -F "upload_preset=employee_profile" \
  -F "folder=employee-photos"
```

### 7. Expected Success Flow

When everything works correctly, you should see:

1. **In Console**: Detailed logs showing each step
2. **In UI**: Upload progress indicator
3. **In Preview**: Image appears immediately after upload
4. **In Form**: Hidden thumbnailUrl field gets populated
5. **After Save**: Image appears on employee cards

### 8. Backend Verification

The image URL should be saved to the database and appear when you:

1. Save the employee record
2. Navigate back to the employees list
3. See the profile photo in the employee card

### 9. If Still Not Working

1. **Check Network Tab** in Developer Tools during upload
2. **Verify the exact error message** in console logs
3. **Test with the standalone HTML test file** first
4. **Try a different image file** (smaller size, different format)
5. **Clear browser cache** and restart dev server

### 10. Success Indicators

✅ **Upload Working**: Console shows "Upload successful! Image URL: ..."
✅ **Preview Working**: Image appears in the form preview
✅ **Form Working**: Hidden input gets populated with Cloudinary URL
✅ **Backend Working**: Image appears on employee card after saving
