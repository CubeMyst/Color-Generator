import Card from "./components/Card"
import { Toaster } from 'sonner'
import './App.css'

export default function App() {
  return (
    <main className="w-screen h-screen flex flex-col md:flex-row">
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Toaster className="p-5" />
    </main>
  )
}
