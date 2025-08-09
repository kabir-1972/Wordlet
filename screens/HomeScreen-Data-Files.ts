import RNFS from 'react-native-fs';
import { HomeScreenRewards } from './Rewards';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTheDailyRewardData=async()=>{
    const path=`${RNFS.DocumentDirectoryPath}/daily-rewards.json`;
    const exists=await RNFS.exists(path);
    if(exists){
        const data=await RNFS.readFile(path, 'utf8');
        const JSONdata=JSON.parse(data);
        const theDate=JSONdata.date;
        if(theDate==getTheCurrentDate())
            return JSONdata;
        else return resetTheDailyRewardData();
    }
    else
        resetTheDailyRewardData();
}


/*
activity is how far the task is done
done is 1 or 0 to show if that task is done
marked is 1 or 0 to show if that has been shown in the slide in box to the user
*/
const resetTheDailyRewardData=async()=>{
    const path=`${RNFS.DocumentDirectoryPath}/daily-rewards.json`;
    const data={
            date: getTheCurrentDate(),
            points: 0,
            "task1": {activity: 0, done: 0, marked: 0},
            "task2": {activity: 0, done: 0, marked: 0},
            "task3": {activity: 0, done: 0, marked: 0},
            "task4": {activity: 0, done: 0, marked: 0},
            "task5": {activity: 0, done: 0, marked: 0},
            "task6": {activity: 0, done: 0, marked: 0},
            "task7": {activity: 0, done: 0, marked: 0},
            "task8": {activity: 0, done: 0, marked: 0},
            "task9": {activity: 0, done: 0, marked: 0},
            "task10": {activity: 0, done: 0, marked: 0},
            "task11": {activity: 0, done: 0, marked: 0},
            "task12": {activity: 0, done: 0, marked: 0},
            "task13": {activity: 0, done: 0, marked: 0},
            "task14": {activity: 0, done: 0, marked: 0},
            "task15": {activity: 0, done: 0, marked: 0},
            "task16": {activity: 0, done: 0, marked: 0},
            "task17": {activity: 0, done: 0, marked: 0},
            "task18": {activity: 0, done: 0, marked: 0},
            "task19": {activity: 0, done: 0, marked: 0},
            "task20": {activity: 0, done: 0, marked: 0},
            "task21": {activity: 0, done: 0, marked: 0},
            "task22": {activity: 0, done: 0, marked: 0},
            "task23": {activity: 0, done: 0, marked: 0},
            "task24": {activity: 0, done: 0, marked: 0},
            "task25": {activity: 0, done: 0, marked: 0}, 
        };
        await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
        return data;
}

export const setMarkedToZeroAfterSlideIn=async (taskNumber: number)=>{
    const path=`${RNFS.DocumentDirectoryPath}/daily-rewards.json`;
    const exists=await RNFS.exists(path);
    
    if(exists){
      const data=await RNFS.readFile(path, 'utf8');
      const JSONdata=JSON.parse(data);
      const taskData=JSONdata[`task${taskNumber}`];
      console.log(taskData);

      if(taskData.marked==1){
        taskData.marked=0;
      JSONdata[`task${taskNumber}`]=taskData;
      await RNFS.writeFile(path, JSON.stringify(JSONdata), 'utf8');
      }
    }
    else
        resetTheDailyRewardData();
}

export const getTheCurrentDate=()=>{ 
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

export const updateTheRewardData=async (taskNumber: number, activity: number)=>{
    const path=`${RNFS.DocumentDirectoryPath}/daily-rewards.json`;
    const exists=await RNFS.exists(path);
    type TaskNumber = keyof typeof HomeScreenRewards; 
    if(exists){
      const data=await RNFS.readFile(path, 'utf8');
      const JSONdata=JSON.parse(data);
      if(JSONdata.date!=getTheCurrentDate()) resetTheDailyRewardData();
      const taskData=JSONdata[`task${taskNumber}`];
      taskData.activity+=activity;

      //console.log(taskData);
      //return;

      if(taskData.done==0&&taskData.activity>=HomeScreenRewards[taskNumber as TaskNumber].fill){
        taskData.done=1;
        taskData.marked=1;
        const points=parseInt(JSONdata['points']);
        JSONdata['points']=points+parseInt(HomeScreenRewards[taskNumber as TaskNumber].reward);
      }
      JSONdata[`task${taskNumber}`]=taskData;
      await RNFS.writeFile(path, JSON.stringify(JSONdata), 'utf8');
      return JSONdata;
    }
    else{
        resetTheDailyRewardData();
        updateTheRewardData(taskNumber, activity);
    }
}

export const dailyRewardsClaimData=()=>{
  
}