import { Axios } from "../config";
import { ReportType } from "../domain";


interface DataRepositoryProps {
    url: string;
    token: string;
    pageSize?: number;
};

interface UpdateDataProps {
    url: string;
    token: string;
    id: number,
    data: any
}

export class DataService {
    public static async extractReports(props: DataRepositoryProps) {
        const { url, token, pageSize } = props;
        let a = true;
        let page = 1;
        const reports: ReportType[] = [];

        while (a) {
            try {
                const response = await Axios.getData(`${url}/api/reports`, token, page, pageSize);
                const { data, meta } = response;
                reports.push(...data);

                if (page === meta.pagination.pageCount) {
                    a = !a;
                };

                page += 1;
            } catch (error) {
                console.error(`Error extracting reports: ${error}`);
                throw error;
            }
        };

        return reports;
    };

    public static async updateData(props: UpdateDataProps) {
        const { url, token, id, data } = props;
        try {
            const response = await Axios.updateData(`${url}/api/reports/${id}`, token, data);
            return response;
        } catch (error) {
            console.error(`Error updating data: ${error}`);
            throw error;
        }
    }
}