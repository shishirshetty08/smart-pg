import { Provider } from "react-redux";
import { store } from "./store"; // Works if index.js is present in src/store/
import AppWrapper from "./AppWrapper";

function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;