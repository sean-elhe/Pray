import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import HomeScreen from './components/homescreen';
import SavedScreen from './components/savedscreen';

type Screen = 'home' | 'saved';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [prayerText, setPrayerText] = useState('');
  const [prayers, setPrayers] = useState<string[]>(() => {
    const saved = localStorage.getItem('prayers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('prayers', JSON.stringify(prayers));
  }, [prayers]);

  function savePrayer() {
    setPrayers([...prayers, prayerText]);
    setPrayerText('');
  }

  function deletePrayer(indexToRemove: number) {
    setPrayers(prayers.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="app">
      {screen === `home` ? (
        <HomeScreen
          prayerText={prayerText}
          setPrayerText={setPrayerText}
          savePrayer={savePrayer}
          goToSaved={() => setScreen(`saved`)}
        />
      ) : (
        <SavedScreen
          prayers={prayers}
          deletePrayer={deletePrayer}
          goBack={() => setScreen(`home`)}
        />
      )}
    </div>
  );
}

export default App;
