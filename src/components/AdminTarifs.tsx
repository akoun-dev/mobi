import React, { useState } from 'react';
import Papa from 'papaparse';
import type { Insurer } from '../types/insurer';

interface TarifCSV {
  insurer: string;
  price: string;
  coverage: string;
  options: string;
  deductible: string;
}

interface AdminTarifsProps {
  insurersData: Insurer[];
  onToggleStatus: (insurerId: number) => void;
  onImport: () => void;
  onExport: () => void;
}

// Type pour les données CSV importées
interface TarifCSV {
  insurer: string;
  price: string;
  coverage: string;
  options: string;
  deductible: string;
  isActive?: string;
}

const AdminTarifs: React.FC<AdminTarifsProps> = ({ insurersData, onToggleStatus, onImport, onExport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<string>('');
  const [insurers, setInsurers] = useState<Insurer[]>(insurersData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;

    Papa.parse<TarifCSV>(file, {
      header: true,
      complete: (results: Papa.ParseResult<TarifCSV>) => {
        const validRows = results.data.filter((row: TarifCSV) =>
          row.insurer && row.price && row.coverage
        );

        if (validRows.length === 0) {
          setImportResult('Aucune donnée valide trouvée');
          return;
        }

        // Traitement des données
        const importedInsurers = validRows.map((row: TarifCSV, index: number) => ({
          id: index + 1,
          name: row.insurer,
          logo: '🛡️', // Logo par défaut
          rating: 4.0, // Note par défaut
          isActive: row.isActive?.toLowerCase() === 'true' || true
        }));

        setInsurers(importedInsurers);
        setImportResult(`Import réussi: ${validRows.length} tarifs chargés`);
      },
      error: (error: Error) => {
        setImportResult(`Erreur d'import: ${error.message}`);
      }
    });
  };

  return (
    <div className="admin-container">
      <div className="tab-header">
        <h2>Gestion des assureurs et tarifs</h2>
        <div className="tab-actions">
          <button className="import-btn" onClick={onImport}>
            📁 Importer tarifs
          </button>
          <button className="export-btn" onClick={onExport}>
            📊 Exporter CSV
          </button>
        </div>
      </div>

      <div className="insurers-table">
        <table>
          <thead>
            <tr>
              <th>Assureur</th>
              <th>Note</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {insurers.map((insurer) => (
              <tr key={insurer.id}>
                <td>
                  <div className="insurer-info">
                    <span className="insurer-name">{insurer.name}</span>
                  </div>
                </td>
                <td>{insurer.rating}/5</td>
                <td>
                  <span className={`status-badge ${insurer.isActive ? 'status-active' : 'status-inactive'}`}>
                    {insurer.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className={`action-btn ${insurer.isActive ? 'deactivate' : 'activate'}`}
                      onClick={() => onToggleStatus(insurer.id)}
                    >
                      {insurer.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="import-section">
        <h3>Importer des tarifs CSV</h3>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />
        <button onClick={handleImport} disabled={!file}>
          Valider l'import
        </button>
        {importResult && <p>{importResult}</p>}
      </div>
    </div>
  );
};

export default AdminTarifs;