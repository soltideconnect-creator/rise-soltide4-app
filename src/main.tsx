import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { TestApp } from "./TestApp.tsx"; // Uncomment to test basic React
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

// To test if basic React works, uncomment the line below and comment out the App import
// const App = TestApp;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ErrorBoundary>
  </StrictMode>
);
