import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Task } from '../models/Task';
import { TaskStatus } from '../utils/TaskStatus';

const createTask = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid task', 422));
    }

    const { title } = req.body;

    const newTask = new Task({
        title, assignedTo: undefined, status: TaskStatus.Pending
    });

    try {
        await newTask.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(201).json({message: 'Task created', task: newTask});
}

const getTasks = async(req: Request, res: Response, next: NextFunction) => {
    let foundTasks;

    try {
        foundTasks = await Task.find().exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({totalTasks: foundTasks.length, tasks: foundTasks});
 }

 const updateTaskStatus = async(req: Request, res: Response, next: NextFunction) => {
     const { taskId } = req.params;
     let foundTask

     try {
         foundTask = await Task.findById(taskId).exec();
     } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
     }

     if(!foundTask) {
        return next(new HttpError('THis task dont exists cabron', 404));
     }
     foundTask.status = TaskStatus.Resolved;
     try {
         await foundTask.save();
     } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
     }
     res.status(200).json({message: 'Task resolved', task: foundTask});
  }
  
 