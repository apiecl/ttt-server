import { Server } from "socket.io";
import { config } from "./config";

const MAX_VALUE = 209;
const NUMBER_CHANNELS = 12;
const initialValues: number[] = [];
for (let i = 0; i < NUMBER_CHANNELS; i++) {
  initialValues.push(MAX_VALUE);
}

function randomInt(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
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

let connectionState: boolean = false;

const sensors = new Server({
  cors: {
    origin: config.authorized_origin_sensors,
  },
});

const io = new Server({
  cors: {
    origin: config.authorized_origin_ttt,
  },
});

sensors.on("data", (data) => {
  if (!connectionState) return;
  const parsedData = JSON.parse(data);

  io.on("connection", (socket) => {
    console.log("ttt server connected");
    socket.emit("data", parsedData);
  });

  io.listen(8000);
});

sensors.on("connection", () => {
  connectionState = true;
  console.log("sensors server connected");
});

sensors.listen(8989);
