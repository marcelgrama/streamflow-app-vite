import React from 'react';
import StreamForm from './components/StreamForm';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

const App: React.FC = () => {
  const wallet = useWallet();

  return (
    <div className='App'>
      <WalletMultiButton />
      {wallet.connected && (
        <>
          <WalletDisconnectButton />
          <h1>Streamflow Token Streaming</h1>
          <StreamForm wallet={wallet} />
        </>
      )}
    </div>
  );
};

export default App;
