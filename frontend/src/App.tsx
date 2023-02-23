import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes as Switch} from 'react-router-dom';
import {ApolloClient, InMemoryCache,ApolloProvider} from '@apollo/client';
import {Search} from './pages/Search';
import {Result} from './pages/Result';


function App() {

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:5000/',
  });

  return (
    <ApolloProvider client={client}>
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" element={<Search/>} />
          <Route path="/search" element={<Search/>}/>
        </Switch>
      </Router>
    </div>
    </ApolloProvider>
  );
}

export default App;
