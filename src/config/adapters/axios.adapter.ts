import axios from "axios";
import { ReportType } from "../../domain/types/report";



interface ReportsResponse {
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
    data: ReportType[];
};

export class Axios {
    public static async getData(url: string, token: string, page = 1, pageSize = 750) {
        const response = await axios.get<ReportsResponse>(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
                'populate': 'labels,images'
            }
        });
        return response.data
    }

    public static async getBinaryData(url: string){
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data
    }

    public static async postData(url: string, token: string, data: any){
        const response = await axios.post(url, data, {
            headers: {
                ...data.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    }

    public static async updateData(url: string, token: string, data: any) {
        const response = await axios.put(url,
            { data }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

        });
        return response.data
    }

    public static async deleteData(url: string, token: string) {
        const response = await axios.delete(`${url}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }


}