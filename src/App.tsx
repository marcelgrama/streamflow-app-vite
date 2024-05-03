import React from 'react';
import StreamForm from './components/StreamForm';
import { StreamData } from './types/streamTypes';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

const App: React.FC = () => {
  const { connected } = useWallet();

  const handleCreateStream = (streamData: StreamData) => {
    console.log('Stream data submitted:', streamData);
  };

  return (
    <div className='App'>
      <h1>Streamflow Token Streaming</h1>
      <StreamForm onCreateStream={handleCreateStream} />
      <WalletMultiButton />
      {connected && (
        <>
          <WalletDisconnectButton />
        </>
      )}
    </div>
  );
};

export default App;
