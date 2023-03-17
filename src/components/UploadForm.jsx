import React, { useState } from "react";
import '../App.css';

function UploadForm() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    fetch('http://192.168.1.10:7899/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(result => {
      setError(null);
    })
    .catch(err => {
      setError(err.message);
    });
  }

  const handleChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileList = Array.from(selectedFiles);
      setFiles(fileList);
      setError(null);
    } else {
      setError('Por favor, selecione um arquivo válido (PDF, DOC, DOCX, JPG, JPEG, PNG)');
    }
  }

  return (
    <form onSubmit={handleSubmit} action="http://192.168.1.10:7899/upload" method="POST" encType="multipart/form-data">
      <div className="form-container">
        <label>
          <input type="file" onChange={handleChange} multiple />
          <span>Selecione um ou mais arquivos</span>
        </label>
        <div className="output">
          {error && <div className="error">{error}</div>}
        </div>
        <button type="submit" className="blue-button">Enviar</button>
      </div>
    </form>
  );
}

export default UploadForm;
