import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    console.log(window.electronAPI?.appName)
  }, [])

  return (
    <div>
      <h1>Nodetron Desk</h1>
      <p>App iniciada correctamente</p>
    </div>
  )
}