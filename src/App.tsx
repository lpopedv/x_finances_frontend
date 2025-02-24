import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Dashboard } from "./pages/dashboard"
import { Categories } from "./pages/categories"
import { Transactions } from "./pages/transactions"
import { Layout } from "./layout"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
