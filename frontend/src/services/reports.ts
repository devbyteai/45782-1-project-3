import api from "./api";
import { VacationStats } from "../models/Vacation";

class ReportsService {
    async getStats(): Promise<VacationStats[]> {
        const { data } = await api.get<VacationStats[]>('/reports/stats');
        return data;
    }

    async downloadCsv(): Promise<void> {
        const response = await api.get('/reports/csv', {
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'vacation-likes-report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}

export default new ReportsService();
