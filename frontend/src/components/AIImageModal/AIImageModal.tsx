import { useState, useTransition } from 'react' //useTranstion: for marking slow/async updates as non-urgent to keep UI responsive
import {
	generateProfileImage,
	downloadGeneratedImage,
} from '../../services/aiImageGeneration'

import type {
	GenerateImageOptions,
	GeneratedImage,
} from '../../services/aiImageGeneration'

import toast from 'react-hot-toast'

import { MdRefresh, MdDownload } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { ImMagicWand } from 'react-icons/im'

interface AIImageModalProps { 
	isOpen: boolean
	onClose: () => void
	onImageSelect: (imageBlob: Blob) => void //callback when user selects an image
}

const AIImageModal = ({
	isOpen,
	onClose,
	onImageSelect,
}: AIImageModalProps) => {
	//holds a list of generated AI images in an Array
	const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])

	//stores user's chosen options for the AI image
	const [selectedOptions, setSelectedOptions] = useState<GenerateImageOptions>({
		gender: 'male',
		style: 'professional',
	})

	//hook to handle state updates that can take some time, like fetching images (async tasks) while keeping the UI responsive
	const [isPending, startTransition] = useTransition()

	// tracks if the image is being downloaded
	const [isDownloading, setIsDownloading] = useState(false)

	// Generate a single image
	const handleGenerateImage = () => {
		// Wrap async logic in startTransition so React can keep the UI interactive.
		startTransition(async () => {
			try {
				console.log('Generating image with options:', selectedOptions)
				// Call the AI service to generate an image based on selected options
				const image = await generateProfileImage(selectedOptions)
				setGeneratedImages([image])
			} catch (error) {
				console.error('Error generating image:', error)
				toast.error('Failed to generate image. Please try again.')
			}
		})
	}

	/* -------- Use the generated image (download and pass to parent) -------- */
	const handleUseGeneratedImage = () => {
		// no image? nothing to do
		if (generatedImages.length === 0) return

		startTransition(async () => {
			try {
				setIsDownloading(true)
				console.log('📥 Downloading generated image:', generatedImages[0].url)
				// grab the actual image bytes as a Blob (good for uploads, previews, etc.)
				const imageBlob = await downloadGeneratedImage(generatedImages[0].url)
				// Hand the blob to the parent component (it decides what to do next).
				onImageSelect(imageBlob)
				onClose()
			} catch (error) {
				console.error('💥 Error downloading image:', error)
				toast.error('Failed to download image. Please try again.')
			} finally {
				setIsDownloading(false)
			}
		})
	}

	/* ----------- Regenerate images with new random seed for variety ----------- */
	const handleRegenerate = () => {
		startTransition(async () => {
			try {
				console.log('Regenerating image with options:', selectedOptions)

				//ask AI to generate a new image with the same options but a new seed
				const image = await generateProfileImage({
					...selectedOptions,
					seed: Date.now(), // use current timestamp as new seed
				})
				setGeneratedImages([image]) // replace with the new result
			} catch (error) {
				console.error('Error regenerating image:', error)
				toast.error('Failed to regenerate image. Please try again.')
			}
		})
	}

	// Don't render anything if modal is closed
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm'>
			<div className='bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto border border-gray-200'>
				{/* ===== Modal Header ===== */}
				<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10'>
					<div className='flex items-center gap-2'>
						<div className='p-1.5 bg-purple-100 rounded-lg'>
							<ImMagicWand className='w-4 h-4 text-purple-600' />
						</div>
						<h2 className='text-lg font-bold text-gray-900'>
							Generate AI Profile Image
						</h2>
					</div>
					<button
						onClick={onClose}
						className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200'>
						<IoClose className='w-4 h-4' />
					</button>
				</div>

				{/* ===== Modal Content ===== */}
				<div className='p-4 bg-gray-50 space-y-4'>
					{/* --- Configuration Section --- */}
					<div className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
						<h3 className='text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2'>
							<div className='w-1.5 h-1.5 bg-purple-500 rounded-full'></div>
							Customisation Options
						</h3>

						<div className='space-y-4'>
							{/* Gender selection */}
							<div>
								<label className='block text-xs font-semibold text-gray-700 mb-2'>
									Gender
								</label>
								<div className='flex gap-2'>
									{(['male', 'female'] as const).map((gender) => (
										<button
											key={gender}
											onClick={() =>
												setSelectedOptions((prev) => ({ ...prev, gender }))
											}
											className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
												selectedOptions.gender === gender
													? 'bg-purple-600 text-white border-purple-600 shadow-md'
													: 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
											}`}>
											{gender.charAt(0).toUpperCase() + gender.slice(1)}
										</button>
									))}
								</div>
							</div>

							{/* Style selection */}
							<div>
								<label className='block text-xs font-semibold text-gray-700 mb-2'>
									Style
								</label>
								<div className='grid grid-cols-2 gap-2'>
									{(['professional', 'casual', 'fun', 'creative'] as const).map(
										(style) => (
											<button
												key={style}
												onClick={() =>
													setSelectedOptions((prev) => ({ ...prev, style }))
												}
												className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-xs ${
													selectedOptions.style === style
														? 'bg-purple-600 text-white border-purple-600 shadow-md'
														: 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
												}`}>
												{style.charAt(0).toUpperCase() + style.slice(1)}
											</button>
										)
									)}
								</div>
							</div>

							{/* Generate button */}
							<button
								onClick={handleGenerateImage}
								disabled={isPending || isDownloading}
								className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm'>
								{isPending ? (
									<MdRefresh className='w-4 h-4 animate-spin' />
								) : (
									<ImMagicWand className='w-4 h-4' />
								)}
								{isPending ? 'Generating...' : 'Generate AI Image'}
							</button>
						</div>
					</div>

					{/* --- Loading State --- */}
					{isPending && generatedImages.length === 0 && (
						<div className='bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100'>
							<div className='flex flex-col items-center space-y-3'>
								<div className='relative'>
									<div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
										<MdRefresh className='w-6 h-6 text-purple-600 animate-spin' />
									</div>
									<div className='absolute inset-0 w-12 h-12 bg-purple-200 rounded-full animate-ping opacity-25'></div>
								</div>
								<div className='space-y-1'>
									<p className='text-sm font-semibold text-gray-900'>
										Creating your AI profile image...
									</p>
									<p className='text-xs text-gray-600'>
										This may take a few moments
									</p>
								</div>
							</div>
						</div>
					)}

					{/* --- Generated Image Display --- */}
					{generatedImages.length > 0 && (
						<div className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
							<div className='text-center space-y-4'>
								<div className='space-y-1'>
									<h3 className='text-sm font-bold text-gray-900 flex items-center justify-center gap-2'>
										<div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
										Your AI Generated Image
									</h3>
									<p className='text-xs text-gray-600'>
										Looking good! You can regenerate or use this image.
									</p>
								</div>

								<div className='flex justify-center'>
									<div className='relative group'>
										<img
											src={generatedImages[0].url}
											alt='Generated portrait'
											className='w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300'
										/>
										<div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
									</div>
								</div>

								{/* Action buttons */}
								<div className='flex justify-center gap-3'>
									<button
										onClick={handleRegenerate}
										disabled={isPending}
										className='flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm'>
										<MdRefresh
											className={`w-3 h-3 ${isPending ? 'animate-spin' : ''}`}
										/>
										{isPending ? 'Regenerating...' : 'Try Again'}
									</button>

									<button
										onClick={handleUseGeneratedImage}
										disabled={isPending || isDownloading}
										className='flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm'>
										{isDownloading ? (
											<MdRefresh className='w-3 h-3 animate-spin' />
										) : (
											<MdDownload className='w-3 h-3' />
										)}
										{isDownloading ? 'Using Image...' : 'Use This Image'}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default AIImageModal
