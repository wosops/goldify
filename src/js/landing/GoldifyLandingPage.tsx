import React from 'react';
import { Typography } from '@mui/material';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FastForwardIcon from '@mui/icons-material/FastForward';
import '../../css/GoldifyLandingPage.css';
import spotifyLogo from '../../assets/spotify_logo.png';
import githubLogo from '../../assets/github_icon_white.jpg';
import goldifyLogo from '../../assets/goldify_logo.png';
import goldenVinyl from '../../assets/golden_vinyl.jpg';
import { spotifyHomePageUrl, goldifyGitHubUrl } from '../utils/constants';

const GoldifyLandingPage: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-top-wrapper">
        <Typography variant="h2" component="h1" className="landing-header">
          Welcome to Goldify!
        </Typography>
        <div className="landing-logo-container">
          <img
            className="landing-goldify-logo"
            src={goldifyLogo}
            alt="Goldify Logo"
          />
          X
          <a href={spotifyHomePageUrl} target="_blank" rel="noreferrer">
            <img
              className="landing-spotify-logo"
              src={spotifyLogo}
              alt="Spotify Logo"
            />
          </a>
        </div>
        <Typography variant="body1" className="landing-body">
          Goldify is an application built to help you easily design your
          golden Spotify playlist. Built using Spotify&apos;s APIs, we provide
          you with an easy-to-use interface which presents you with all your
          top hits to build your personal playlist from. Within minutes, you
          will have a Spotify playlist that is molded exactly to your musical
          taste. We&apos;re excited for you to be here and can&apos;t wait for
          you to enjoy your golden tracks!
        </Typography>
        <div className="follow-github-container">
          <a href={goldifyGitHubUrl} target="_blank" rel="noreferrer">
            <div className="follow-github-inner">
              <img
                className="follow-github-icon"
                src={githubLogo}
                alt="Github Logo Icon"
              />
              <div className="follow-github-message">Follow on GitHub</div>
            </div>
          </a>
        </div>
        <div className="landing-feature-icons">
          <div className="landing-feature-icon">
            <MobileFriendlyIcon sx={{ fontSize: 40, color: 'grey.900' }} />
            <br />
            <Typography variant="h6">Mobile Friendly</Typography>
          </div>
          <div className="landing-feature-icon">
            <VerifiedUserIcon sx={{ fontSize: 40, color: 'grey.900' }} />
            <br />
            <Typography variant="h6">Clean User Interface</Typography>
          </div>
          <div className="landing-feature-icon">
            <FastForwardIcon sx={{ fontSize: 40, color: 'grey.900' }} />
            <br />
            <Typography variant="h6">Instant Updates</Typography>
          </div>
        </div>
        <div className="landing-golden-vinyl">
          <img src={goldenVinyl} alt="Golden Vinyl" />
        </div>
      </div>
      <div className="landing-bottom-wrapper">
        <Typography variant="h4" component="h2" className="landing-header">
          Question Time!
        </Typography>
        <div className="landing-split-body">
          <Typography variant="h5" component="h3">
            How do I get started?
          </Typography>
          <Typography variant="body1">
            Great question! At the top of this page, you will see the tab
            named &quot;Solo&quot;. Upon clicking this, you&apos;ll be on your
            way to building musical magic!
          </Typography>
        </div>
        <div className="landing-split-body">
          <Typography variant="h5" component="h3">
            Is there a limit to how often I can use Goldify Solo?
          </Typography>
          <Typography variant="body1">
            Not at all! Stop on by anytime you like, we love the company. In
            fact, we encourage you come back at least once a month to build on
            top of your already amazing Goldify playlist.
          </Typography>
        </div>
        <div className="landing-split-body">
          <Typography variant="h5" component="h3">
            Does Goldify store any of my data?
          </Typography>
          <Typography variant="body1">
            Goldify does not store or retain any data. Our website only runs
            client side, and does not save your Spotify data to any server.
          </Typography>
        </div>
        <div className="landing-split-body">
          <Typography variant="h5" component="h3">
            How does Goldify access my Spotify account?
          </Typography>
          <Typography variant="body1">
            All external requests are made directly with Spotify&apos;s API.
            With your permission, we retrieve your listening data and use that
            to generate a playlist for your account. We also present you with
            a variety of your favorite tracks to personalize this playlist.
          </Typography>
        </div>
        <div className="landing-split-body">
          <Typography variant="h5" component="h3">
            Can I come back later to update the playlist?
          </Typography>
          <Typography variant="body1">
            Of course! If you have visited this page before and created your
            masterpiece of a playlist, just simply click the &quot;Solo&quot;
            tab above and you&apos;ll be presented with your latest Top Hits
            as well as your current Goldify playlist! Plus, you&apos;ll get to
            see all the updates to the application by the Goldify team. Pretty
            neat!
          </Typography>
        </div>
        <div className="landing-split-body">
          <Typography variant="h5" component="h3">
            Can I modify the Goldify Playlist after it&apos;s created?
          </Typography>
          <Typography variant="body1">
            The only detail about the Goldify playlist that needs to be
            maintained is the title (&quot;Goldify&quot;). So long as this is
            the name of your playlist, you can go wild with the description,
            cover image, and even contents of the playlist! You could even
            make the cover image a picture of a pizza, and make the
            description &quot;Wow, I really love pizza, and I really love
            music!&quot;, and we would respect and adore you for that.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default GoldifyLandingPage; 