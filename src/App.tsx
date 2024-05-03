import React from 'react';
import StreamForm from './components/StreamForm';
import { StreamData } from './types/streamTypes';

const App: React.FC = () => {
  const handleCreateStream = (streamData: StreamData) => {
    console.log('Stream data submitted:', streamData);
    // Here you would integrate with Streamflow's SDK to create the stream
  };

  return (
    <div className='App'>
      <h1>Streamflow Token Streaming</h1>
      <StreamForm onCreateStream={handleCreateStream} />
    </div>
  );
};

export default App;
