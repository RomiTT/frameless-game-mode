#include <napi.h>
#include "LaunchAtLogon.h"


Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
  return LAL::Init(env, exports);
}

NODE_API_MODULE(LaunchAtLogon, InitAll)