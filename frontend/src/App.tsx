import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { EmployeesPage } from './pages/EmployeesPage'
import { AddEmployeePage } from './pages/AddEmployeePage'
import { Toaster } from 'react-hot-toast'

function App() {
	return (
		//Enables URL-based routing throughout the app

		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path='/' element={<Dashboard />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/employees' element={<EmployeesPage />} />
					<Route path='/add-employee' element={<AddEmployeePage />} />
					<Route path='/edit-employee/:id' element={<AddEmployeePage />} />
					<Route path='*' element={<Dashboard />} />
				</Routes>
			</Layout>
			<Toaster
				position='top-right'
				toastOptions={{
					duration: 4000,
					style: {
						background: 'bg-lime-500',
						color: 'text-slade-900',
						borderRadius: '12px',
						fontSize: '14px',
						padding: '10px',
						border: '2px solid #9AE600',
					},
					success: {
						iconTheme: {
							primary: '#10b981',
							secondary: '#fff',
						},
					},
					error: {
						iconTheme: {
							primary: '#ef4444',
							secondary: '#fff',
						},
					},
				}}
			/>
		</BrowserRouter>
	)
}

export default App
