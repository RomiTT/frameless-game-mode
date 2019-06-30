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
    LEFT_CENTER,
    LEFT_BOTTOM,
    MIDDLE_TOP,
    LEFT_TOP,
    MIDDLE_CENTER,
    MIDDLE_BOTTOM,
    RIGHT_TOP,
    RIGHT_CENTER,
    RIGHT_BOTTOM,
    CUSTOM_MODE,
  };

  enum FGM_WINDOW_SIZE {
    BASED_ON_CLIENT_AREA,
    BASED_ON_WINDOW_AREA,
    FULL_SCREEN_SIZE,
    CUSTOM_SIZE
  };

  struct GameModeInfo {
    std::wstring processPath;
		std::wstring title;
    FGM_WINDOW_POSITION wpos;
    FGM_WINDOW_SIZE wsize;
    int width;
    int height;
  };

  enum FGM_MODE {
    ONLY_FOR_FOREGROUND_WINDOW,
    ALL_WINDOWS
  };

  enum FGM_STATE {
    REQUESTED_STARTING,
    STARTED,
    REQUESTED_PAUSING,
    PAUSED,	
    REQUESTED_STOPPING,
    STOPPED,
  };


  struct FGMContext {
    std::vector<GameModeInfo> listGameModeInfo;
    std::mutex mtx;
    Napi::FunctionReference callbackStarted;
    Napi::FunctionReference callbackPaused;
    Napi::FunctionReference callbackStopped;
    FGM_STATE state = FGM_STATE::STOPPED;
    FGM_MODE mode = FGM_MODE::ALL_WINDOWS;    
    DWORD interval = 500;
  };
};

#endif
