import { useState, useRef, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');
  const [report, setReport] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ── Drag & Drop ──────────────────────────────────────────
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  }, []);

  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setStatus('error');
      setMessage('Invalid file type. Please upload a .csv or .xlsx file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setStatus('error');
      setMessage('File too large. Maximum size is 10 MB.');
      return;
    }
    setFile(f);
    setStatus('idle');
    setMessage('');
    setReport('');
    setShowReport(false);
  };

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setMessage('');
    setReport('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('uploading');
    setMessage('');
    setReport('');
    setShowReport(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setMessage(data.message || `Report sent to ${email}`);
      setReport(data.report || '');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Network error. Please check your connection.');
    }
  };

  // ── Derived state ────────────────────────────────────────
  const isDisabled = !file || !email || status === 'uploading';
  const currentStep = !file ? 1 : status === 'success' ? 3 : 2;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🐇</div>
          <span>RabbitAI</span>
        </div>
        <span className="header-badge">v1.0 — Sales Report Engine</span>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="main">
        <div className="hero">
          <h1>
            Turn Data Into <span className="gradient-text">Insights</span>
          </h1>
          <p>
            Upload your sales data and let AI craft a professional narrative report — delivered straight to your inbox.
          </p>
        </div>

        {/* Steps */}
        <div className="steps">
          <div className={`step ${currentStep >= 1 ? (currentStep > 1 ? 'done' : 'active') : ''}`}>
            <span className="step-number">{currentStep > 1 ? '✓' : '1'}</span>
            Upload File
          </div>
          <div className={`step ${currentStep >= 2 ? (currentStep > 2 ? 'done' : 'active') : ''}`}>
            <span className="step-number">{currentStep > 2 ? '✓' : '2'}</span>
            Enter Email
          </div>
          <div className={`step ${currentStep >= 3 ? 'done' : ''}`}>
            <span className="step-number">{currentStep >= 3 ? '✓' : '3'}</span>
            Get Report
          </div>
        </div>

        {/* Card */}
        <form className="card" onSubmit={handleSubmit}>
          {/* Upload Zone */}
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            id="upload-zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) validateAndSetFile(e.target.files[0]);
              }}
              id="file-input"
            />
            <div className="upload-icon">{file ? '✓' : '↑'}</div>
            {file ? (
              <>
                <h3>{file.name}</h3>
                <p>{formatFileSize(file.size)}</p>
                <div className="file-info" onClick={(e) => e.stopPropagation()}>
                  ✓ Ready to analyze
                  <button type="button" onClick={removeFile} title="Remove file" id="remove-file-btn">
                    ✕
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Drop your file here or click to browse</h3>
                <p>.CSV or .XLSX — up to 10 MB</p>
              </>
            )}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email-input">Recipient Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="email-input"
                className="form-input"
                placeholder="analyst@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'uploading'}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={isDisabled} id="submit-btn">
            {status === 'uploading' ? (
              <>
                <div className="spinner" />
                Analyzing & Sending…
              </>
            ) : (
              <>🚀 Generate & Send Report</>
            )}
          </button>

          {/* Status Card */}
          {status === 'uploading' && (
            <div className="status-card loading">
              <span className="status-icon">⏳</span>
              <div className="status-body">
                <h4>Processing Your Data</h4>
                <p>AI is analyzing your sales data. This usually takes 10–30 seconds…</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="status-card success">
              <span className="status-icon">✅</span>
              <div className="status-body">
                <h4>Report Delivered!</h4>
                <p>{message}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="status-card error">
              <span className="status-icon">⚠️</span>
              <div className="status-body">
                <h4>Something Went Wrong</h4>
                <p>{message}</p>
              </div>
            </div>
          )}

          {/* Report Preview */}
          {report && status === 'success' && (
            <div className="report-preview">
              <button
                type="button"
                className="report-toggle"
                onClick={() => setShowReport(!showReport)}
                id="toggle-report-btn"
              >
                {showReport ? '▾ Hide' : '▸ Preview'} Report
              </button>
              {showReport && (
                <div
                  className="report-content"
                  dangerouslySetInnerHTML={{ __html: report }}
                />
              )}
            </div>
          )}
        </form>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        Powered by RabbitAI — AI-Driven Sales Intelligence
      </footer>
    </div>
  );
}

export default App;
