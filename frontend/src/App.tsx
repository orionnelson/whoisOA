import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes as Switch} from 'react-router-dom';
import {Home} from './pages/Home';
import {Search} from './pages/Search';
import {Result} from './pages/Result';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search/>}/>
          <Route path="/result" element={<Result/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
