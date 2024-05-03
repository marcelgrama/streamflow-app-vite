import React, { useState, FormEvent } from 'react';
import { StreamData } from '../types/streamTypes';

interface StreamFormProps {
  onCreateStream: (streamData: StreamData) => void;
}

const StreamForm: React.FC<StreamFormProps> = ({ onCreateStream }) => {
  const [token, setToken] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onCreateStream({ token, recipient, amount });
    setToken('');
    setRecipient('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Token:
        <input
          type='text'
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
      </label>
      <label>
        Recipient:
        <input
          type='text'
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </label>
      <label>
        Amount:
        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <button type='submit'>Create Stream</button>
    </form>
  );
};

export default StreamForm;
