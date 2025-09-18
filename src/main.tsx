import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import './index.css';
import { initializePerformanceOptimizations } from './utils/performance';
import { initLayoutStability } from './utils/layout-stability';

// Initialize performance optimizations
initializePerformanceOptimizations();
initLayoutStability();

createRoot(document.getElementById("root")!).render(<App />);
