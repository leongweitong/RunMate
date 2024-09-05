import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const renderReactDom = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

if (window.cordova) {
  document.addEventListener('deviceready', () => {
    renderReactDom()
    StatusBar.styleDefault();
  }, false)
} else {
  renderReactDom()
}
