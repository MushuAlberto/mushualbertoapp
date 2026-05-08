import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

document.body.style.backgroundColor = 'red';
createRoot(document.getElementById("root")!).render(<App />);
