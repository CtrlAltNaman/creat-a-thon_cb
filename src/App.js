import { AlarmProvider } from "./context/AlarmContext"
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <AlarmProvider>
      <Dashboard />
    </AlarmProvider>
  )
}

export default App
