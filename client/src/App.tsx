import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import { ThemeProvider } from "./context/ThemeContext"
import AppRoutes from "./routers/AppRoutes"
import ScrollToTop from "./components/ScrollToTop"
import "./styles/App.scss"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
