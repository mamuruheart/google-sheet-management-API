import { useState, ChangeEvent } from 'react';
import './App.css';
import { writeGoogleSheetAPI } from './api/writeGoogleSheetAPI';

type FormData = {
  no: string;
  name: string;
  date: string;
};

function App() {
  const [formData, setFormData] = useState<FormData>({
    no: '',
    name: '',
    date: '',
  });

  const [status, setStatus] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setStatus('Sending...');
    try {
      const response = await writeGoogleSheetAPI(formData)

      if (response) {
        setStatus('✅ Success! Row added to Google Sheet.');
        setFormData({ no: '', name: '', date: '' });
      } else {
        setStatus('⚠️ Failed to add data.');
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Error while sending.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit to Google Sheet</h2>
      <input
        name="no"
        placeholder="No"
        value={formData.no}
        onChange={handleChange}
      />
      <br />
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <br />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <br />
      <button onClick={handleSubmit}>Add</button>
      <p>{status}</p>
    </div>
  );
}

export default App;