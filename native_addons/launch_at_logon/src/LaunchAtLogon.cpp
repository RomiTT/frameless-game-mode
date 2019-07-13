#include "LaunchAtLogon.h"

Napi::Value LAL::setLaunchAtLogon(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return env.Undefined();	
}


Napi::Value LAL::getLaunchAtLogon(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return Napi::Boolean::New(env, true);
}


Napi::Object LAL::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("setLaunchAtLogon", Napi::Function::New(env, LAL::setLaunchAtLogon));
  exports.Set("getLaunchAtLogon", Napi::Function::New(env, LAL::getLaunchAtLogon));
  return exports;
}