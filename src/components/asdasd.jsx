function UploadForm() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      fetch('http://localhost:7899/upload', {
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
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Por favor, selecione um arquivo válido (PDF, DOC, DOCX, JPG, JPEG, PNG)');
      }
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          <input type="file" onChange={handleChange} />
          <span>Selecione um arquivo</span>
        </label>
        <div className="output">
          {error && <div className="error">{error}</div>}
        </div>
        <button type="submit" className="blue-button">Enviar</button>
      </form>
    );
  }
  
  export default UploadForm;