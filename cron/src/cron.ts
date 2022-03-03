import { HttpError } from '@adwesh/common';
import cron from 'node-cron';
import { Task, User } from './models/User';
import { TaskStatus, UserRoles } from './utils/TaskStatus';

export const handleCronJobs = () => {
    cron.schedule('30 1 * * * *', async()=>{
        let foundTasks;
        let foundUser;
        try {
            foundTasks = await Task.find({status: TaskStatus.Pending}).exec();
        } catch (error) {
            throw new HttpError('An error occured', 500);
        }
        if(!foundTasks) {
            return;
        }
        try {
           foundUser = await User.findOne({role: UserRoles.Agent}).exec()
        } catch (error) {
            throw new HttpError('An error occured', 500);
        }
        if(!foundUser) {
            return;
        }
    
        for(const foundTask of foundTasks) {
            foundUser.tasks.push(foundTask.id);
            foundTask.assignedTo = foundUser.id;
            await foundTask.save();
            // send mail to person assigned to task;
            console.log(`Task ${foundTask.id} assigned to ${foundUser.email}`);
        }
        try {
            await foundUser.save();
        } catch (error) {
            throw new HttpError('An error occured', 500);
        }
        return;
    });
}


