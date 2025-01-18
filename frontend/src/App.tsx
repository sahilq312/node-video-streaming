import './App.css';

function App() {
  return (
    <>
      <video
        src="http://localhost:3000/video"
        controls
        width="800"
        onError={(e) => console.error("Video failed to load:", e)}
      />
    </>
  );
}

export default App;
