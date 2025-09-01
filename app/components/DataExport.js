'use client';

import { useState } from 'react';

export default function DataExport({ data, filename = 'neuroexpert-export' }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  // Экспорт в Excel (CSV)
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    // Получаем заголовки из первого объекта
    const headers = Object.keys(data[0]);
    
    // Создаем CSV контент
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Экранируем значения с запятыми и кавычками
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    // Создаем Blob и скачиваем файл
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Экспорт в PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // Здесь можно использовать библиотеку jsPDF
      // Для демо используем простой HTML to PDF через браузер
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              color: #8b5cf6;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #8b5cf6;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>NeuroExpert - Экспорт данных</h1>
          <p>Дата экспорта: ${new Date().toLocaleDateString('ru-RU')}</p>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>© 2025 NeuroExpert. Все права защищены.</p>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Ждем загрузку и вызываем печать
      printWindow.onload = () => {
        printWindow.print();
        setIsExporting(false);
      };
    } catch (error) {
      console.error('Ошибка экспорта в PDF:', error);
      alert('Ошибка при экспорте в PDF');
      setIsExporting(false);
    }
  };

  // Экспорт в JSON
  const exportToJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'excel':
        exportToCSV();
        break;
      case 'pdf':
        exportToPDF();
        break;
      case 'json':
        exportToJSON();
        break;
      default:
        alert('Неподдерживаемый формат');
    }
  };

  return (
    <div className="data-export">
      <div className="export-controls">
        <select 
          value={exportFormat} 
          onChange={(e) => setExportFormat(e.target.value)}
          className="export-select"
        >
          <option value="excel">Excel (CSV)</option>
          <option value="pdf">PDF</option>
          <option value="json">JSON</option>
        </select>
        
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="export-button"
        >
          {isExporting ? (
            <>
              <span className="spinner"></span>
              Экспорт...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeWidth="2"/>
                <path d="M7 10l5 5 5-5" strokeWidth="2"/>
                <path d="M12 15V3" strokeWidth="2"/>
              </svg>
              Экспорт
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .data-export {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .export-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .export-select {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .export-select:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .export-select:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .export-button {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .export-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        .export-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .data-export {
            flex-direction: column;
            width: 100%;
          }

          .export-controls {
            width: 100%;
          }

          .export-select,
          .export-button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}