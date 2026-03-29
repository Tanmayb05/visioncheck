import React, { useState } from 'react';
import './App.css';

import Welcome from './screens/Welcome';
import Profile from './screens/Profile';
import AcuityTest from './screens/AcuityTest';
import ColorTest from './screens/ColorTest';
import AstigmatismTest from './screens/AstigmatismTest';
import ContrastTest from './screens/ContrastTest';
import NearVisionTest from './screens/NearVisionTest';
import AmslerTest from './screens/AmslerTest';
import PeripheralTest from './screens/PeripheralTest';
import SymptomsTest from './screens/SymptomsTest';
import Results from './screens/Results';

// Screens in order
const FLOW = [
  'welcome',
  'profile',
  'acuity',
  'color',
  'astigmatism',
  'contrast',
  'near',
  'amsler',
  'peripheral',
  'symptoms',
  'results',
];

const TEST_SCREENS = ['acuity', 'color', 'astigmatism', 'contrast', 'near', 'amsler', 'peripheral', 'symptoms'];

function App() {
  const [screen, setScreen] = useState('welcome');
  const [language, setLanguage] = useState('en');
  const [profile, setProfile] = useState({
    ageGroup: null,
    who: null,
    diabetes: null,
    glasses: null,
  });
  const [testData, setTestData] = useState({});

  // Gemini API key — can be set via env variable or entered by user
  const geminiKey = process.env.REACT_APP_GEMINI_KEY || null;

  const goTo = (scr) => {
    setScreen(scr);
    window.scrollTo(0, 0);
  };

  const goNext = () => {
    const idx = FLOW.indexOf(screen);
    if (idx < FLOW.length - 1) goTo(FLOW[idx + 1]);
  };

  const goBack = () => {
    const idx = FLOW.indexOf(screen);
    if (idx > 0) goTo(FLOW[idx - 1]);
  };

  const saveResult = (key, data) => {
    setTestData(prev => ({ ...prev, [key]: data }));
    goNext();
  };

  const testStep = TEST_SCREENS.indexOf(screen) + 1;
  const totalTestSteps = TEST_SCREENS.length;

  const retake = () => {
    setTestData({});
    setProfile({ ageGroup: null, who: null, diabetes: null, glasses: null });
    goTo('welcome');
  };

  switch (screen) {
    case 'welcome':
      return (
        <Welcome
          language={language}
          setLanguage={setLanguage}
          onStart={goNext}
        />
      );

    case 'profile':
      return (
        <Profile
          profile={profile}
          setProfile={setProfile}
          onNext={goNext}
          onBack={goBack}
          language={language}
        />
      );

    case 'acuity':
      return (
        <AcuityTest
          onComplete={(data) => saveResult('acuity', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'color':
      return (
        <ColorTest
          onComplete={(data) => saveResult('color', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'astigmatism':
      return (
        <AstigmatismTest
          onComplete={(data) => saveResult('astigmatism', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'contrast':
      return (
        <ContrastTest
          onComplete={(data) => saveResult('contrast', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'near':
      return (
        <NearVisionTest
          onComplete={(data) => saveResult('near', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'amsler':
      return (
        <AmslerTest
          onComplete={(data) => saveResult('amsler', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'peripheral':
      return (
        <PeripheralTest
          onComplete={(data) => saveResult('peripheral', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'symptoms':
      return (
        <SymptomsTest
          onComplete={(data) => saveResult('symptoms', data)}
          onBack={goBack}
          step={testStep}
          totalSteps={totalTestSteps}
          language={language}
        />
      );

    case 'results':
      return (
        <Results
          testData={testData}
          profile={profile}
          language={language}
          geminiKey={geminiKey}
          onRetake={retake}
        />
      );

    default:
      return null;
  }
}

export default App;
