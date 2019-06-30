export enum FGM_STATE {
  REQUESTED_STARTING,
  STARTED,
  REQUESTED_PAUSING,
  PAUSED,
  REQUESTED_STOPPING,
  STOPPED
}

export enum FGM_WINDOW_POSITION {
  LEFT_BOTTOM,
  LEFT_CENTER,
  MIDDLE_TOP,
  LEFT_TOP,
  MIDDLE_CENTER,
  MIDDLE_BOTTOM,
  RIGHT_TOP,
  RIGHT_CENTER,
  RIGHT_BOTTOM,
  CUSTOM_MODE
}

export enum FGM_WINDOW_SIZE {
  BASED_ON_CLIENT_AREA,
  BASED_ON_WINDOW_AREA,
  FULL_SCREEN_SIZE,
  CUSTOM_SIZE
}

export enum FGM_MODE {
  ONLY_FOR_FOREGROUND_WINDOW,
  ALL_WINDOWS
}

const app: any = require('electron').remote.app;
export let FGM = app.FGM;
