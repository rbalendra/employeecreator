# 🚀 Cloudinary Upload Fix - Step by Step

## ❗ CRITICAL: The most common issue is missing upload preset!

### Step 1: Create Upload Preset (REQUIRED)

1. **Open Cloudinary Dashboard**: https://cloudinary.com/console
2. **Navigate**: Settings (⚙️) → Upload
3. **Create Preset**:
   - Click "Add upload preset"
   - **Preset name**: `employee_profile`
   - **Signing Mode**: `Unsigned` ⚠️ **MUST BE UNSIGNED**
   - **Folder**: `employee-photos`
   - **Resource type**: `Image`
   - **Max file size**: `5000000` (5MB)
   - Click **Save**

### Step 2: Verify Your Configuration

Your `.env` file looks correct:

```
VITE_CLOUDINARY_CLOUD_NAME=rbalendra
VITE_CLOUDINARY_UPLOAD_PRESET=employee_profile
```

### Step 3: Test the Upload Preset

**Option A: Use the HTML Test Page**

1. Open: `cloudinary-test.html` in your browser
2. Upload a test image
3. Check console for errors

**Option B: Use curl command**

```bash
curl -X POST \
  "https://api.cloudinary.com/v1_1/rbalendra/upload" \
  -F "file=@C:/path/to/your/image.jpg" \
  -F "upload_preset=employee_profile" \
  -F "folder=employee-photos"
```

### Step 4: Test in React App

1. **Restart your dev server** (very important after .env changes):

   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npx vite
   ```

2. **Open browser dev tools** (F12) → Console tab

3. **Navigate to Add Employee page**

4. **Try uploading an image**

5. **Watch the console logs** - you should see:
   ```
   🔍 Starting image upload process...
   📁 Selected file: {...}
   ⚙️ Cloudinary config: {...}
   📤 Starting upload to Cloudinary...
   📋 FormData prepared with: {...}
   🌐 Making request to: https://api.cloudinary.com/v1_1/rbalendra/upload
   📥 Response received: {...}
   📊 Response data: {...}
   ✅ Upload successful! Image URL: https://...
   ```

### Step 5: Common Error Messages & Solutions

#### ❌ "Upload preset 'employee_profile' not found"

**Solution**: Create the upload preset in step 1

#### ❌ "Must use whitelisted upload presets for unsigned uploads"

**Solution**: Set your upload preset to "Unsigned" mode

#### ❌ "Invalid cloud name or upload preset"

**Solution**: Check your `.env` file values match Cloudinary dashboard

#### ❌ Network/CORS errors

**Solution**: Usually means upload preset doesn't exist or is misconfigured

### Step 6: Verify Success

When working correctly, you should see:

1. ✅ **Console**: "Upload successful! Image URL: https://..."
2. ✅ **UI**: Image preview appears immediately
3. ✅ **Cloudinary Dashboard**: Image appears in Media Library → employee-photos folder
4. ✅ **After saving employee**: Image appears on employee card

### Step 7: If Still Not Working

1. **Check Cloudinary service status**: https://status.cloudinary.com/
2. **Verify your account isn't suspended** or over quota
3. **Try a different image file** (smaller, different format)
4. **Clear browser cache** and restart dev server
5. **Check browser network tab** for the actual HTTP request/response

---

## 🎯 Quick Test Checklist

- [ ] Upload preset `employee_profile` exists in Cloudinary dashboard
- [ ] Upload preset is set to "Unsigned" mode
- [ ] `.env` file has correct values
- [ ] Dev server restarted after `.env` changes
- [ ] Browser dev tools open to see console logs
- [ ] Test image file is under 5MB and valid image format

**Most likely fix**: Just create the upload preset with "Unsigned" mode! 🚀
