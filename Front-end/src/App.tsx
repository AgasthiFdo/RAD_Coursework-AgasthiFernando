import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store";
import Router from "./routes/Routers";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
    
  )
}
