#pragma once

#ifndef __FGM_CONTEXT_H__
#define __FGM_CONTEXT_H__

#include <napi.h>
#include <mutex>
#include <string>
#include <vector>
#include <windows.h>

namespace FGM {
  enum FGM_WINDOW_POSITION {
    FGM_LEFT_CENTER,
    FGM_LEFT_BOTTOM,
    FGM_MIDDLE_TOP,
    FGM_LEFT_TOP,
    FGM_MIDDLE_CENTER,
    FGM_MIDDLE_BOTTOM,
    FGM_RIGHT_TOP,
    FGM_RIGHT_CENTER,
    FGM_RIGHT_BOTTOM,
    FGM_CUSTOM_MODE,
  };

  enum FGM_WINDOW_SIZE {
    FGM_BASED_ON_CLIENT_AREA,
    FGM_BASED_ON_WINDOW_AREA,
    FGM_FULL_SCREEN_SIZE,
    FGM_CUSTOM_SIZE
  };

  struct GameModeInfo {
    std::wstring processName;
    std::wstring title;
    FGM_WINDOW_POSITION wpos;
    FGM_WINDOW_SIZE wsize;
    int width;
    int height;
  };

  enum FGM_MODE {
    FGM_MODE_ONLY_FOR_FOREGROUND_WINDOW,
    FGM_MODE_ALL_WINDOWS
  };

  enum FGM_STATE {
    FGM_STATE_REQUESTED_STARTING,
    FGM_STATE_STARTED,
    FGM_STATE_REQUESTED_PAUSING,
    FGM_STATE_PAUSED,	
    FGM_STATE_REQUESTED_STOPPING,
    FGM_STATE_STOPPED,
  };


  struct FGMContext {
    std::vector<GameModeInfo> listGameModeInfo;
    std::mutex mtx;
    Napi::FunctionReference callbackStarted;
    Napi::FunctionReference callbackPaused;
    Napi::FunctionReference callbackStopped;
    FGM_STATE state = FGM_STATE_STOPPED;
    FGM_MODE mode = FGM_MODE_ALL_WINDOWS;    
    DWORD interval = 500;
  };
};

#endif
