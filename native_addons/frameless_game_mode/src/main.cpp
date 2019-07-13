#include <napi.h>
#include "FramelessGameMode.h"


Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
  return FGM::Init(env, exports);
}

NODE_API_MODULE(FGM, InitAll)