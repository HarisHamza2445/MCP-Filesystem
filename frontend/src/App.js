import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');

  const handleFolderUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    await axios.post('http://localhost:5000/upload', formData);
    alert('Folder uploaded');
  };

  const handleCommand = async () => {
    const [command, filename, ...rest] = prompt.split(' ');
    const content = rest.join(' ');

    try {
      if (command === 'create') {
        await axios.post('http://localhost:5000/create', { filename, content });
      } else if (command === 'edit') {
        await axios.post('http://localhost:5000/edit', { filename, content });
      } else if (command === 'delete') {
        await axios.post('http://localhost:5000/delete', { filename });
      } else {
        alert('Invalid command');
        return;
      }
      alert(`${command} executed on ${filename}`);
    } catch (err) {
      alert('Error: ' + err.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>MCP Filesystem App</h2>

      <input
        type="file"
        webkitdirectory="true"
        mozdirectory="true"
        multiple
        onChange={handleFolderUpload}
      />

      <br /><br />

      <input
        style={{ width: '80%' }}
        placeholder='Enter command (e.g., create hello.txt Hello world!)'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleCommand}>Run</button>
    </div>
  );
}

export default App;
