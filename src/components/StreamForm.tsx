import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface StreamFormProps {
  connection: Connection;
}

const SOLANA_CLUSTER_URL = 'https://api.devnet.solana.com';

const StreamForm: React.FC<StreamFormProps> = () => {
  const wallet = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenBalances, setTokenBalances] = useState([]);

  // Fetch token balances
  useEffect(() => {
    const connection = new Connection(SOLANA_CLUSTER_URL, 'confirmed');

    if (wallet.connected && wallet.publicKey) {
      const fetchTokenBalances = async () => {
        const balances = await connection.getTokenAccountsByOwner(
          wallet.publicKey,
          {
            programId: new PublicKey(
              'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            ),
          }
        );
        console.log(balances, 'balances--');
        const nonZeroBalances = balances.value
          .filter((account) => account.account.lamports > 0)
          .map((account) => ({
            mint: account.account.data.parsed.info.mint,
            balance: account.account.lamports,
          }));
        setTokenBalances(nonZeroBalances);
      };

      fetchTokenBalances();
    }
  }, [wallet]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submit:', { recipient, amount });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Recipient Address:
        <input
          type='text'
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </label>
      <label>
        Token Amount:
        <input
          type='text'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label>
        Token to Stream:
        <select
          onChange={(e) => console.log('Selected token:', e.target.value)}
        >
          {tokenBalances.map((token, idx) => (
            <option key={idx} value={token.mint}>
              {token.mint} - Balance: {token.balance}
            </option>
          ))}
        </select>
      </label>
      <button type='submit'>Create Stream</button>
    </form>
  );
};

export default StreamForm;
