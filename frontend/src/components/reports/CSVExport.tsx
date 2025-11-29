import { useState } from 'react';
import reportsService from '../../services/reports';

function CSVExport() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);
            await reportsService.downloadCsv();
        } catch (error) {
            console.error('Failed to download CSV:', error);
            alert('Failed to download CSV. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Downloading...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                </>
            )}
        </button>
    );
}

export default CSVExport;
