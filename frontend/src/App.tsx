import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Search } from "./pages/Search";

const BACKEND_URI: string = process.env.BACKEND_URI || "http://localhost:5000/";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: BACKEND_URI,
  });

  return (
    <ApolloProvider client={client}>
      <div className="App bg-black text-white h-[100vh] w-[100vw] flex flex-row items-center justify-center">
        <Router>
          <Switch>
            <Route path="/" element={<Search />} />
            <Route path="/search" element={<Search />} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
