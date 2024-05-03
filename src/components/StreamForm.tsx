import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  GenericStreamClient,
  IChain,
  ICreateStreamData,
  getBN,
} from '@streamflow/stream';
import { WalletContextState } from '@solana/wallet-adapter-react';

const SOLANA_CLUSTER_URL = 'https://api.devnet.solana.com';

interface StreamFormProps {
  wallet: WalletContextState;
}

interface TokenBalance {
  mint: string;
  balance: number;
}

interface StreamData {
  id: string;
  recipient: string;
  amount: string;
}

const StreamForm: React.FC<StreamFormProps> = ({ wallet }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [activeStreams, setActiveStreams] = useState<StreamData[]>([]);

  useEffect(() => {
    const connection = new Connection(SOLANA_CLUSTER_URL, 'confirmed');
    if (wallet.connected && wallet.publicKey) {
      const publicKey = wallet.publicKey;
      const fetchTokenBalances = async () => {
        const balances = await connection.getTokenAccountsByOwner(publicKey, {
          programId: new PublicKey(
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
          ),
        });
        const nonZeroBalances = balances.value
          .filter((account) => account.account.lamports > 0)
          .map((account) => ({
            mint: account.account.data.parsed.info.mint,
            balance: account.account.lamports,
          }));
        setTokenBalances(nonZeroBalances);
      };
      fetchTokenBalances();

      const fetchActiveStreams = async () => {
        const client = new GenericStreamClient<IChain.Solana>({
          chain: IChain.Solana,
          clusterUrl: SOLANA_CLUSTER_URL,
        });
        try {
          const streams = await client.get({
            address: publicKey.toBase58(),
          });
          setActiveStreams(streams);
        } catch (error) {
          console.error('Failed to fetch streams:', error);
        }
      };
      fetchActiveStreams();
    }
  }, [wallet.connected, wallet.publicKey]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!wallet.connected || !wallet.signTransaction) {
      console.error('Wallet not connected');
      return;
    }

    const senderPublicKey = wallet.publicKey;
    if (!senderPublicKey) {
      console.error(
        "Sender's PublicKey is not available, check passed wallet adapter!"
      );
      return;
    }

    const client = new GenericStreamClient<IChain.Solana>({
      chain: IChain.Solana,
      clusterUrl: SOLANA_CLUSTER_URL,
    });

    const createStreamParams: ICreateStreamData = {
      recipient,
      tokenId: selectedToken,
      start: Math.floor(Date.now() / 1000),
      amount: getBN(parseInt(amount, 10), 9),
      period: 86400,
      cliff: Math.floor(Date.now() / 1000) + 86400,
      cliffAmount: getBN(0, 9),
      amountPerPeriod: getBN(1, 9),
      name: 'Demo Stream',
      canTopup: false,
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: false,
      transferableByRecipient: false,
      automaticWithdrawal: false,
      withdrawalFrequency: 0,
    };

    try {
      const { txId } = await client.create(createStreamParams, {
        sender: senderPublicKey,
      });
      console.log('Stream created successfully, transaction ID:', txId);
    } catch (error) {
      console.error('Failed to create stream:', error);
    }
  };

  return (
    <div>
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
          <select onChange={(e) => setSelectedToken(e.target.value)}>
            {tokenBalances.map((token, idx) => (
              <option key={idx} value={token.mint}>
                {token.mint} - Balance: {token.balance}
              </option>
            ))}
          </select>
        </label>
        <button type='submit'>Create Stream</button>
      </form>
      <h2>Active Streams</h2>
      <ul>
        {activeStreams.map((stream, idx) => (
          <li key={idx}>
            {stream.id} - {stream.recipient} - Amount: {stream.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StreamForm;
