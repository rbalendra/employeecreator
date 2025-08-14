/* ------------ AI image generation service using Pollinations AI ----------- */

/* ------ This describes the options we can pass to the image generator ----- */
export interface GenerateImageOptions {
	gender: 'male' | 'female'
	style?: 'professional' | 'casual' | 'corporate'
	seed?: number //may need this number to make results repeatable
}

/* ---------- This describes what a generated image will look like ---------- */
export interface GeneratedImage {
	url: string // where to find/download image
	prompt: string // The AI prompt that was sent to generate the image
	options: GenerateImageOptions // The options used to make the image
}

/* --------------- Create a single AI generated profile Image --------------- */
export const generateProfileImage = async (
	options: GenerateImageOptions
): Promise<GeneratedImage> => {
	//pull out the values from options, with default style "profressional"
	const { gender, style = 'professional', seed } = options

	//basic description of what we want the AI to create
	const basePrompt = `professional headshot portrait of ${gender} business person, corporate attire, clean background, high quality, realistic, well-lit`

	//different descriptions depending on the style chosen
	const stylePrompts = {
		professional: 'wearing business suit, office setting, confident expression',
		casual: 'wearing smart casual clothing, friendly expression',
		corporate:
			'wearing formal business attire, executive style, serious expression',
	}

	//combine the basic prompt with the chosen style
	const fullPrompt = `${basePrompt}, ${stylePrompts[style]}`
	console.log(fullPrompt)

	//encode the text so it can be safely used in the ULR
	const encodedPrompt = encodeURIComponent(fullPrompt)
	console.log(encodedPrompt)

	//if a seed was provided, add it to the URL to make the image consistent
	const seedParam = seed ? `&seed=${seed}` : ''

	// build the full API request URL for Pollinations API
	const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512${seedParam}&nologo=true`

	//return all the information about the generated image
	return {
		url: imageUrl, // where the image can be found
		prompt: fullPrompt, // the final AI prompt text
		options,
	}
}

/* ------------------ Downloads an image from the given RUL ----------------- */
//returns the image as a blob (binary data) so it can be saved or show in the browser
export const downloadGeneratedImage = async (
	imageUrl: string
): Promise<Blob> => {
	//fetch the image data from the server
	const response = await fetch(imageUrl)

	//if the download fails, throw an error
	if (!response.ok) {
		throw new Error(`Failed to download image: ${response.statusText}`)
	}

	//convert the response into a blob and return it
	return response.blob()
}
