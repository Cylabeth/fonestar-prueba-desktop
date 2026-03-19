export {}

declare global {
  interface Window {
    electronAPI: {
      appName: string
    }
  }
}