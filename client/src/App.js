import './App.css';
import JustATest from './components/JustATest';

function App() {
  const shifts = [
    { day: 'Monday', start_at: '8:00', end_at: '9:00' },
    { day: 'Tuesday', start_at: '11:00', end_at: '19:00' },
    { day: 'Friday', start_at: '7:00', end_at: '10:00' },
    { day: 'Saturday', start_at: '8:00', end_at: '13:00' },
    { day: 'Sunday', start_at: '12:00', end_at: '15:00' },
  ]
  return (
    <div className="App">
      <header className="App-header">
        <JustATest />
      </header>
    </div>
  );
}

export default App;
