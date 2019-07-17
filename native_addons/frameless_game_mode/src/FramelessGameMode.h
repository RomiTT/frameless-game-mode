#pragma once
#ifndef __FGM_FRAMELESS_GAME_MODE_H__
#define __FGM_FRAMELESS_GAME_MODE_H__

#include <napi.h>

namespace FGM
{
  Napi::Value initialize(const Napi::CallbackInfo &info);
  Napi::Value unInitialize(const Napi::CallbackInfo &info);
  Napi::Value setDataList(const Napi::CallbackInfo &info);
  Napi::Value addGameModeInfo(const Napi::CallbackInfo &info);
  Napi::Value removeGameModeInfo(const Napi::CallbackInfo &info);
	Napi::Value forceApplyGameModeInfo(const Napi::CallbackInfo& info);
	Napi::Value excludeProcess(const Napi::CallbackInfo& info);
  Napi::Value setEventListener(const Napi::CallbackInfo &info);
  Napi::Value start(const Napi::CallbackInfo &info);
  Napi::Value pause(const Napi::CallbackInfo &info);  
  Napi::Value stop(const Napi::CallbackInfo &info);  
  Napi::Number state(const Napi::CallbackInfo &info); 
	Napi::Promise getWindowAppList(const Napi::CallbackInfo &info);
  Napi::Value setMode(const Napi::CallbackInfo &info);
  Napi::Number getMode(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
} 

#endif
