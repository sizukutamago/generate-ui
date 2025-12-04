'use client';

import { X, Download, Code, Maximize2 } from 'lucide-react';
import { GeneratedUI } from '@/types';
import { useState } from 'react';
import '@/styles/preview-modal.css';

interface PreviewModalProps {
  ui: GeneratedUI;
  onClose: () => void;
  onDownload: (ui: GeneratedUI) => void;
}

export function PreviewModal({ ui, onClose, onDownload }: PreviewModalProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <div className="header-info">
            <div className="modal-icon">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div className="header-text">
              <h3>{ui.prompt}</h3>
              <p className="modal-id">ID: {ui.id}</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`mode-button ${showCode ? 'active' : ''}`}
            >
              <Code className="w-4 h-4" />
              Code
            </button>
            <button
              onClick={() => onDownload(ui)}
              className="download-button"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button onClick={onClose} className="close-button">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="modal-content">
          {showCode ? (
            <div className="code-viewer">
              <div className="code-section">
                <div className="code-header">
                  <span className="code-label">HTML</span>
                  <span className="code-size">{ui.html.length} chars</span>
                </div>
                <pre className="code-block">
                  <code>{ui.html}</code>
                </pre>
              </div>

              {ui.css && (
                <div className="code-section">
                  <div className="code-header">
                    <span className="code-label">CSS</span>
                    <span className="code-size">{ui.css.length} chars</span>
                  </div>
                  <pre className="code-block">
                    <code>{ui.css}</code>
                  </pre>
                </div>
              )}

              {ui.js && (
                <div className="code-section">
                  <div className="code-header">
                    <span className="code-label">JavaScript</span>
                    <span className="code-size">{ui.js.length} chars</span>
                  </div>
                  <pre className="code-block">
                    <code>{ui.js}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <iframe
              srcDoc={ui.html}
              className="preview-frame"
              title="Full Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    </>
  );
}
