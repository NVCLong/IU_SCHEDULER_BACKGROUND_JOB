import { app, InvocationContext, Timer } from "@azure/functions";
import axios from "axios";
import * as dotenv from "dotenv"
dotenv.config()
export async function AlertTrigger(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');

        const api = process.env["API_TRIGGER_WORK_FLOW"];  
        const workFlows = process.env["WORK_FLOW_LIST"]?.split(",")
        const adminId = process.env["ADMIN_ID"];  
        context.log(` work flow list ${workFlows}`);
    
        if (!api || !workFlows || !adminId) {
            throw new Error('Missing environment variables. Please check API_TRIGGER_WORK_FLOW, WORK_FLOW_LIST, and ADMIN_ID.');
        }

        for (const workflow of workFlows) {
                const response = await axios.get(`${api}/${workflow}`, {
                    headers: {
                        UserId: adminId,  
                    }
                });

         context.log(`API call for workflow ${workflow} successful: ${response.status} - ${response.statusText}`);
    
        }
}

app.timer('AlertTrigger', {
    schedule: '*/30 * * * * *', 
    handler: AlertTrigger
});
