import { Server } from "socket.io";

const MAX_VALUE = 209;
const NUMBER_CHANNELS = 12;
const initialValues: number[] = [];
for (let i = 0; i < NUMBER_CHANNELS; i++) {
  initialValues.push(MAX_VALUE);
}

interface sensorOutput {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
  s: sensorNumber;
  c: boolean;
}

type channel = string;

interface socketData {
  values: number[];
  s: number;
  c: boolean;
}

export type sensorData = [];

export interface variant {
  [key: string]: number | boolean;
}

export interface variantNumber {
  [key: string]: number;
}

export enum sensorNumber {
  One = 1,
  Two = 2,
}

  //Randomize
  function generateRandomOutput(): Partial<sensorOutput> {
    const newValues: Partial<sensorOutput> = {};
    
    
        for (let i = 0; i < 12; i++) {
          (newValues as unknown as variant)[i.toString()] = randomInt(
            0,
            MAX_VALUE,
          );
        }
        newValues.s = randomInt(1, 2);
        newValues.c = false;
        
    
      return newValues;
    }
  // }

  function randomInt(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function generateIncrementalOutput(
  prevSensor: number[],
  sensorNo: number,
  calibrate: boolean
): Partial<sensorOutput> {
  const newValues: Partial<sensorOutput> = {};
  newValues.s = sensorNo;
  newValues.c = calibrate;

  for (let i = 0; i < NUMBER_CHANNELS; i++) {
    const currentValue: number = prevSensor[i];
    const key: channel = i.toString();
    if (currentValue > 0) {
      (initialValues as unknown as variant)[key] = currentValue - 1;
      (newValues as unknown as variant)[key] = currentValue - 1;
    } else {
      (initialValues as unknown as variant)[key] = MAX_VALUE;
      (newValues as unknown as variant)[i] = MAX_VALUE;
    }
  }

  return newValues;
}

const io = new Server({
  cors: {
    origin: "*",
  },
});

let currentSensor:number;

setInterval(() => {
  if(currentSensor !== 1) {
    currentSensor = 1;
  } else {
    currentSensor = 2;
  }
  
}, 5000)

io.on("connection", (socket) => {
  socket.on("data", (data) => {
    const parsed = JSON.parse(data);
    socket.emit("data-processed", parsed);
  });

  setInterval(() => {
    socket.emit(
      "data-random",
      //generateIncrementalOutput(initialValues, currentSensor, false)
      generateRandomOutput()
    );
  }, 16.6);
});

io.listen(8989);
