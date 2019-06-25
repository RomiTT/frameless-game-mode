#pragma once
#include <napi.h>

namespace FGM
{
  Napi::Boolean initFramelessGameMode(const Napi::CallbackInfo &info);
  Napi::Value startFramelessGameMode(const Napi::CallbackInfo &info);
  Napi::Value pauseFramelessGameMode(const Napi::CallbackInfo &info);  
  Napi::Value stopFramelessGameMode(const Napi::CallbackInfo &info);  
  Napi::Boolean isRunningFramelessGameMode(const Napi::CallbackInfo &info);
  Napi::Boolean isStoppedFramelessGameMode(const Napi::CallbackInfo &info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
} 