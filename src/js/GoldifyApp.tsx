import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Paper, Tabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import GoldifyLandingPage from './landing/GoldifyLandingPage';
import GoldifySoloPage from './solo/GoldifySoloPage';
import logo from '../assets/goldify_logo.png';
import spotifyFullLogoWhite from '../assets/spotify_full_logo_white.png';
import { spotifyHomePageUrl, HOME_PAGE_PATH, SOLO_PAGE_PATH } from './utils/constants';
import '../css/GoldifyApp.css';

const StyledTabs = styled(Tabs)(() => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#FCC201',
  },
}));

const AppContent: React.FC = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<number | false>(false);

  useEffect(() => {
    const getSelectedTab = (pathname: string): number | false => {
      return pathname.includes(SOLO_PAGE_PATH) ? 0 : false;
    };
    setSelectedTab(getSelectedTab(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number | false) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="goldify-app">
      <div className="goldify-header">
        <div className="goldify-logo">
          <a href={HOME_PAGE_PATH}>
            <img src={logo} alt="Goldify Logo" />
          </a>
        </div>
        <div className="goldify-title">
          <a href={HOME_PAGE_PATH}>
            <h1 className="goldify-title-h1">Goldify</h1>
          </a>
        </div>
        <div className="goldify-tabs-bar">
          <Paper square className="goldify-tabs-paper">
            <StyledTabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="navigation tabs"
              className="goldify-tabs"
            >
              <Tab
                className="goldify-tab"
                label="Solo"
                component="a"
                href={SOLO_PAGE_PATH}
              />
            </StyledTabs>
          </Paper>
        </div>
      </div>
      <Routes>
        <Route path={HOME_PAGE_PATH} element={<GoldifyLandingPage />} />
        <Route path={SOLO_PAGE_PATH} element={<GoldifySoloPage />} />
      </Routes>
      <footer className="goldify-footer">
        <Box className="goldify-footer-container">
          Goldify is powered by
          <a href={spotifyHomePageUrl} target="_blank" rel="noreferrer">
            <img
              src={spotifyFullLogoWhite}
              className="goldify-footer-img"
              alt="Spotify Logo"
            />
          </a>
        </Box>
      </footer>
    </div>
  );
};

const GoldifyApp: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default GoldifyApp; 