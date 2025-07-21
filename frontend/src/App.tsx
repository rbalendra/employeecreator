import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { EmployeesPage } from './pages/EmployeesPage'
import { AddEmployeePage } from './pages/AddEmployeePage'
// import { AddEmployeePage } from './pages/AddEmployeePage' // Uncomment when ready

function App() {
	return (
		//Enables URL-based routing throughout the app
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path='/' element={<Dashboard />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/employees' element={<EmployeesPage />} />
					\ <Route path='/add-employee' element={<AddEmployeePage />} />
					<Route path='/edit-employee/:id' element={<AddEmployeePage />} />
					<Route path='*' element={<Dashboard />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	)
}

export default App
