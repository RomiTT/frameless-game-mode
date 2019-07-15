#include "LaunchAtLogon.h"


void SetLaunchAtLogon(bool val) {

}


bool GetLaunchAtLogon() {
  return true;
}



Napi::Value LAL::set(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}	

  auto val = info[0].As<Napi::Boolean>();
  SetLaunchAtLogon(val);

  return env.Undefined();	
}


Napi::Value LAL::get(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return Napi::Boolean::New(env, GetLaunchAtLogon());
}


Napi::Object LAL::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("set", Napi::Function::New(env, LAL::set));
  exports.Set("get", Napi::Function::New(env, LAL::get));
  return exports;
}