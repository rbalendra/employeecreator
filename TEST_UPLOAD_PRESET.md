# Test Upload Preset

Use this curl command to test if your upload preset works:

```bash
# Test upload using curl (replace path/to/image.jpg with an actual image file)
curl -X POST \
  "https://api.cloudinary.com/v1_1/rbalendra/upload" \
  -F "file=@path/to/image.jpg" \
  -F "upload_preset=employee_profile" \
  -F "folder=employee-photos"
```

## Expected Response (Success):

```json
{
	"asset_id": "...",
	"public_id": "employee-photos/...",
	"version": 1234567890,
	"version_id": "...",
	"signature": "...",
	"width": 800,
	"height": 600,
	"format": "jpg",
	"resource_type": "image",
	"created_at": "2025-01-30T...",
	"tags": [],
	"bytes": 123456,
	"type": "upload",
	"etag": "...",
	"placeholder": false,
	"url": "http://res.cloudinary.com/rbalendra/image/upload/v1234567890/employee-photos/...",
	"secure_url": "https://res.cloudinary.com/rbalendra/image/upload/v1234567890/employee-photos/...",
	"folder": "employee-photos",
	"original_filename": "image"
}
```

## Expected Response (Upload Preset Not Found):

```json
{
	"error": {
		"message": "Upload preset 'employee_profile' not found"
	}
}
```

## Expected Response (Invalid Upload Preset):

```json
{
	"error": {
		"message": "Must use whitelisted upload presets for unsigned uploads"
	}
}
```

## If you get an error:

1. **Check the preset name** - it must be exactly `employee_profile`
2. **Check the signing mode** - it must be "Unsigned"
3. **Save the preset** - make sure you clicked Save in the dashboard
