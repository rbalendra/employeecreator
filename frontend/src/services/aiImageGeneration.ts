/* ------------ AI image generation service using Pollinations AI ----------- */

/* ------ This describes the options we can pass to the image generator ----- */
export interface GenerateImageOptions {
	gender: 'male' | 'female'
	style?: 'professional' | 'casual' | 'fun' | 'creative'
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
	//pull out the values from options, with default style "professional"
	const { gender, style = 'professional', seed } = options

	//basic description of what we want the AI to create
	const basePrompt = `headshot portrait of ${gender} person, clean background, high quality, realistic, well-lit`

	//different descriptions depending on the style chosen
	const stylePrompts = {
		professional: 'wearing business suit, office setting, confident expression',
		casual:
			'wearing relaxed smart casual clothing, friendly expression, relaxed pose',
		fun: 'wearing business suit with colorful tie, sunglasses, funky hairstyles and playful expression, quirky accessories, vibrant background',
		creative:
			'wearing artistic outfit, creative studio background, expressive pose, colorful lighting, unique styling',
	}

	// For creative style, randomly select from fun creative options
	const creativeOptions = [
		'in The Simpsons cartoon style, yellow skin, simple cartoon features, wearing business suit, Springfield office background',
		'in Family Guy cartoon style, exaggerated cartoon features, wearing professional attire, Quahog office setting',
		'in Pixar 3D animation style, 3D cartoon character, wearing modern business attire, colorful corporate background',
	]

	let stylePrompt = stylePrompts[style] // this means that if style is not creative, we use the predefined style prompt

	// If creative style is selected, randomly pick one of the creative options
	if (style === 'creative') {
		const randomIndex = Math.floor(Math.random() * creativeOptions.length)
		stylePrompt = creativeOptions[randomIndex]
	}
	//combine the basic prompt with the chosen style
	const fullPrompt = `${basePrompt}, ${stylePrompt}`
	console.log(fullPrompt)

	//encode the text so it can be safely used in the ULR
	const encodedPrompt = encodeURIComponent(fullPrompt)
	console.log(encodedPrompt)

	//if a seed was provided, add it to the URL to make the image consistent
	//if no seed provided use current timestamp to get a unique image
	const seedParam = seed ? `&seed=${seed}` : `&seed=${Date.now()}`

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
