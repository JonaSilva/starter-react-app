
import './App.scss';
import Main from './pages/Main';
import { MatterportProvider } from './components/Matterport/MatterportContext';
import { OverlayProvider } from './components/Overlay/OverlayContext';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <OverlayProvider>
        <MatterportProvider>
          <Main />
        </MatterportProvider>
      </OverlayProvider>
    </BrowserRouter>
  );
}

export default App;