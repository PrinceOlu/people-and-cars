import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Title from './components/layout/Title';
import AddContact from './components/forms/AddContact';
import Contacts from './components/lists/Contacts';
import AddCar from './components/forms/AddCar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PersonShowPage from './components/layout/PersonShowPage';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const MainRoute = () => (
  <div className='App'>
    <Title />
    <AddContact />
    <AddCar />
    <Contacts />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/" element={<MainRoute />} />
          <Route path="/people/:id" element={<PersonShowPage />} />
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
