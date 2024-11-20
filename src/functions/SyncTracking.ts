import { app, InvocationContext, Timer } from "@azure/functions";
import axios from "axios";
import * as dotenv from "dotenv"
dotenv.config()
export async function SyncTrackingTrigger(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');

        const api = process.env["API_TRIGGER_WORK_FLOW"];  
        const userId = process.env["ADMIN_ID"]
    
        if (!api || !userId){
            throw new Error("Missing API in config");
        }
        
    try{
        const res = await axios.get(`${api}/notifySync`,{
            headers: {
                UserId : userId
            }
        })

        if(res){
            context.log(`API call for sync tracking successful: ${res.status} - ${res.statusText}`);
        }
    }catch(error){
        context.log(error)
        throw error
    }
}

app.timer('SyncTracking', {
    schedule: '0 9 * * * *', 
    handler: SyncTrackingTrigger
});
