import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './components/Dashboard'
import './index.css'

function App() {
	// State-based routing with navigation handler
	const [currentPage, setCurrentPage] = useState('dashboard')

	// Navigation handler function
	const handleNavigation = (page: string) => {
		console.log(`🧭 Navigating to: ${page}`)
		setCurrentPage(page)
	}

	// Function to render the current page component
	const renderPage = () => {
		switch (currentPage) {
			case 'dashboard':
				return <Dashboard />
			case 'employees':
				return (
					<div className='min-h-screen bg-gray-300 py-8'>
						<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center'>
								<div className='text-8xl mb-6 animate-bounce'>👥</div>
								<h2 className='text-3xl font-bold text-gray-900 mb-4'>
									Employees Management
								</h2>
								<p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
									Complete employee list and management features coming soon
								</p>
								<button
									onClick={() => handleNavigation('dashboard')}
									className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'>
									← Back to Dashboard
								</button>
							</div>
						</div>
					</div>
				)
			case 'add-employee':
				return (
					<div className='min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8'>
						<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center'>
								<div className='text-8xl mb-6 animate-pulse'>➕</div>
								<h2 className='text-3xl font-bold text-gray-900 mb-4'>
									Add New Employee
								</h2>
								<p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
									Employee creation form with React Hook Form and Zod validation
									coming soon
								</p>
								<button
									onClick={() => handleNavigation('dashboard')}
									className='bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'>
									← Back to Dashboard
								</button>
							</div>
						</div>
					</div>
				)
			default:
				return <Dashboard />
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navigation Bar with click handler */}
			<Navbar currentPage={currentPage} onNavigate={handleNavigation} />

			{/* Main Content Area */}
			<main className='relative'>{renderPage()}</main>
		</div>
	)
}

export default App
