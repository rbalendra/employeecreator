import { useLocation } from 'react-router'
import { Navbar } from './Navbar'

// LAYOUT COMPONENT: This is a wrapper that puts the navbar on every page
interface LayoutProps {
	children: React.ReactNode // whatever to display under the navbar
}

export const Layout = ({ children }: LayoutProps) => {
	// LOCATION HOOK: This is a special React function that tells us what page we're on
	// Example: If someone visits "mywebsite.com/employees", this will know we're on the employees page
	const location = useLocation()

	// CURRENT PAGE: Figure out which page we're on by looking at the web address
	// How it works:
	// - If URL is "/dashboard", we remove the "/" and get "dashboard"
	// - If URL is "/employees", we remove the "/" and get "employees"
	// - If URL is just "/", we use "dashboard" as the default
	const currentPage = location.pathname.slice(1) || 'dashboard'

	return (
		// MAIN CONTAINER: full‑height background for all pages
		<div className='min-h-screen bg-gray-50'>
			{/* NAVBAR SECTION: The navigation bar that appears on every page */}
			{/* We tell the navbar which page is currently active so it can highlight the right button */}
			<Navbar currentPage={currentPage} />

			{/* MAIN CONTENT SECTION: This is where the actual page content goes */}
			{/* Whatever page component we're showing (Dashboard, Employees, etc.) will appear here */}
			<main className='relative'>{children}</main>
		</div>
	)
}
