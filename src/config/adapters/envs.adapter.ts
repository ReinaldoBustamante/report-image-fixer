import 'dotenv/config';
import { get } from 'env-var';


export class Envs {
    public static getEnvs(){
        const APIUrl = get('API_URL').required().asString()
        const APIToken = get('API_TOKEN').required().asString()
  

        return {
            APIUrl,
            APIToken
        }
    }
    
}