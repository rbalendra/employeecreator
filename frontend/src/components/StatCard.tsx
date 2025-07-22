// StatCard: reusable card to display a statistic with title, value, and icon
interface StatCardProps {
	title: string
	value: number
	icon?: string
	bgColor?: string
	textColor?: string
}

export const StatCard = ({
	title,
	value,
	icon = '👥',
	bgColor = 'bg-white',
	textColor = 'text-gray-900',
}: StatCardProps) => {
	return (
		<div
			className={`${bgColor} rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl/20 hover:border-rose-700 transition-all duration-300 cursor-pointer group`}>
			{/* Card Header with Icon */}
			<div className='flex items-center justify-between mb-4'>
				<div className='text-3xl'>{icon}</div>
				<div
					className={`text-5xl font-bold ${textColor} group-hover:scale-150 transition-transform duration-200`}>
					{value}
				</div>
			</div>

			{/* Card Title */}
			<div>
				<h3
					className={`text-sm font-bold uppercase tracking-wider ${
						// If background uses bright or gradient classes, use black title for contrast
						bgColor.includes('gradient') ||
						bgColor.includes('blue') ||
						bgColor.includes('green') ||
						bgColor.includes('purple') ||
						bgColor.includes('orange') ||
						bgColor.includes('emerald') ||
						bgColor.includes('yellow')
							? 'text-black opacity-90'
							: 'text-gray-600'
					}`}>
					{title}
				</h3>
			</div>

			{/* Subtle bottom accent */}
			<div className='mt-4 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full'></div>
		</div>
	)
}
