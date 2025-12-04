'use client';

import { useState } from 'react';
import { Eye, Download, Trash2, Grid3x3, Trash } from 'lucide-react';
import { GeneratedUI } from '@/types';
import { PreviewModal } from './PreviewModal';
import '@/styles/generated-results.css';

interface GeneratedResultsProps {
  generatedUIs: GeneratedUI[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function GeneratedResults({ generatedUIs, onDelete, onClearAll }: GeneratedResultsProps) {
  const [previewUI, setPreviewUI] = useState<GeneratedUI | null>(null);

  const handleDownload = (ui: GeneratedUI) => {
    const blob = new Blob([ui.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uiforge-${ui.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    generatedUIs.forEach((ui, index) => {
      setTimeout(() => {
        handleDownload(ui);
      }, index * 200);
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      <div className="results-container">
        <div className="results-header">
          <div className="header-left">
            <div className="icon-wrapper">
              <Grid3x3 className="w-5 h-5" />
            </div>
            <div>
              <h2>Generated Collection</h2>
              <p className="section-subtitle">
                {generatedUIs.length} {generatedUIs.length === 1 ? 'variant' : 'variants'} in library
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleDownloadAll} className="action-button download">
              <Download className="w-4 h-4" />
              Download All
            </button>
            <button onClick={onClearAll} className="action-button delete">
              <Trash className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        <div className="results-grid">
          {generatedUIs.map((ui, index) => (
            <div
              key={ui.id}
              className="result-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Preview */}
              <div className="preview-wrapper">
                <iframe
                  srcDoc={ui.html}
                  className="preview-iframe"
                  title={`Preview ${ui.id}`}
                  sandbox="allow-scripts allow-same-origin"
                />
                <div className="preview-overlay">
                  <button
                    onClick={() => setPreviewUI(ui)}
                    className="preview-button"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View</span>
                  </button>
                </div>
                <div className="card-glow" />
              </div>

              {/* Info */}
              <div className="card-content">
                <div className="card-meta">
                  <span className="time-badge">{formatDate(ui.timestamp)}</span>
                  <div className="meta-divider" />
                  <span className="id-badge">#{ui.id.slice(-6)}</span>
                </div>

                <p className="card-prompt">{ui.prompt}</p>

                {/* Actions */}
                <div className="card-actions">
                  <button
                    onClick={() => setPreviewUI(ui)}
                    className="card-button primary"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(ui)}
                    className="card-button secondary"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => onDelete(ui.id)}
                    className="card-button danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewUI && (
        <PreviewModal ui={previewUI} onClose={() => setPreviewUI(null)} onDownload={handleDownload} />
      )}
    </>
  );
}
