import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState<string>('');

  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch('http://localhost:3000/stream');

      if (!response.body) {
        console.error('ReadableStream not supported');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamData = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode and append data
        streamData += decoder.decode(value, { stream: true });
        setData((prev) => prev + decoder.decode(value, { stream: true })); // Update state
      }

      console.log('Stream finished');
    };

    fetchStream().catch((error) => console.error('Error fetching stream:', error));
  }, []);
  return (
    <>
      <video
        src="http://localhost:3000/video"
        controls
        width="800"
        onError={(e) => console.error("Video failed to load:", e)}
      />
       {/* <h1>Streaming Data</h1>
      <div
        style={{
          padding: '10px',
          border: '1px solid #ddd',
          maxHeight: '500px',
          overflowY: 'scroll',
        }}
      >
        {data}
      </div> */}
    </>
  );
}

export default App;
