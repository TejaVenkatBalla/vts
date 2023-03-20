
import './App.css';
import VirusScan3 from './components/scan3';
import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <div className='content '>
      <VirusScan3/>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
