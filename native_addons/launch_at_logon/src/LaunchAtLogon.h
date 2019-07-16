
#pragma once
#ifndef __LAUNCH_AT_LOGON_H__
#define __LAUNCH_AT_LOGON_H__

#include <napi.h>

namespace LAL {
	Napi::Value initialize(const Napi::CallbackInfo& info);
	Napi::Value uninitialize(const Napi::CallbackInfo& info);
  Napi::Value set(const Napi::CallbackInfo &info);
  Napi::Value get(const Napi::CallbackInfo &info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}

#endif