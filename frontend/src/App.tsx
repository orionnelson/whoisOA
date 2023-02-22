import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes as Switch} from 'react-router-dom';
import {ApolloClient, InMemoryCache,ApolloProvider} from '@apollo/client';
import {Home} from './pages/Home';
import {Search} from './pages/Search';
import {Result} from './pages/Result';


function App() {

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://countries.trevorblades.com/',
  });

  return (
    <ApolloProvider client={client}>
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search/>}/>
          <Route path="/result" element={<Result/>}/>
        </Switch>
      </Router>
    </div>
    </ApolloProvider>
  );
}

export default App;
