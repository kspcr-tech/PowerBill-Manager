import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/context';
import { Layout } from './components/Layout';
import { ProfileList } from './components/ProfileList';
import { UkscList } from './components/UkscList';
import { UkscDetail } from './components/UkscDetail';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProfileList />} />
            <Route path="/profile/:id" element={<UkscList />} />
            <Route path="/profile/:profileId/uksc/:ukscId" element={<UkscDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;