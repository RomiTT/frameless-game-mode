#include <locale>
#include <codecvt>
#include <chrono>
#include <thread>
#include "FGMContext.h"
#include "FramelessGameMode.h"
#include "FGMWorker.h"

using namespace FGM;

class StateObserver : public Napi::AsyncWorker {
	std::shared_ptr< FGMContext> _spContext;
  FGM_STATE _targetState;

public:
  StateObserver(std::shared_ptr< FGMContext> spContext, Napi::Function& callback, FGM_STATE targetState)
  : AsyncWorker(callback)
  , _spContext(spContext)
  , _targetState(targetState) {}

  ~StateObserver() {}

	// This code will be executed on the worker thread
  void Execute() {
    while (_spContext->state != _targetState) {
      Sleep(5);
    }
  }

  void OnOK() {
		Napi::HandleScope scope(Env());
		Callback().Call({Env().Null()});
	}
};


class FramelessGameMode {
	std::shared_ptr< FGMContext> _spContext = std::make_shared<FGMContext>();

public:
	FramelessGameMode() {
	}

	~FramelessGameMode() {

	}

public:
	void SetDataList(std::vector<GameModeInfo>& list) {
		_spContext->mtx.lock();
			_spContext->listGameModeInfo = std::move(list);
			_spContext->mtx.unlock();
	}

	void Start() {
		_spContext->mtx.lock();
		if (_spContext->state == FGM_STATE_STOPPED) {
			_spContext->state = FGM_STATE_REQUESTED_STARTING;
			auto worker = new FGMWorker(_spContext);
			worker->Queue();
		}
		else if (_spContext->state == FGM_STATE_PAUSED) {
			_spContext->state = FGM_STATE_REQUESTED_STARTING;				
		}
		_spContext->mtx.unlock();
	}

	void Pause() {
		_spContext->mtx.lock();
		if (_spContext->state == FGM_STATE_STARTED) {
			_spContext->state = FGM_STATE_REQUESTED_PAUSING;
		}
		_spContext->mtx.unlock();
	}

	void Stop() {
		_spContext->mtx.lock();
		if (_spContext->state == FGM_STATE_STARTED || _spContext->state == FGM_STATE_PAUSED) {
			_spContext->state = FGM_STATE_REQUESTED_STOPPING;
		}
		_spContext->mtx.unlock();
	}

	void AddGameModeInfo(GameModeInfo& info) {
		_spContext->mtx.lock();
		_spContext->listGameModeInfo.push_back(info);
		_spContext->mtx.unlock();
	}

	void SetEventListener(std::string& eventName, Napi::Function handler) {
		if (eventName.compare("started") == 0) {
			_spContext->callbackStarted = Napi::Persistent(handler);
		}
		else if (eventName.compare("paused") == 0) {
			_spContext->callbackPaused = Napi::Persistent(handler);
		}
		else if (eventName.compare("stopped") == 0) {
			_spContext->callbackStopped = Napi::Persistent(handler);
		}
	}

	FGM_STATE State() { return _spContext->state; }
};






FramelessGameMode* g_FGM = NULL;

Napi::Value FGM::initialize(const Napi::CallbackInfo &info) {
	if (g_FGM == NULL) {
		g_FGM = new FramelessGameMode();
	}

	return info.Env().Undefined();
}


Napi::Value FGM::unInitialize(const Napi::CallbackInfo &info) {
	if (g_FGM != NULL) {
		if (g_FGM->State() != FGM_STATE_STOPPED) {
			g_FGM->Stop();
		}

		delete g_FGM;
		g_FGM = NULL;
	}

	return info.Env().Undefined();
}


Napi::Value FGM::setDataList(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	std::vector<GameModeInfo> listGameModeInfo;
	auto arr = info[0].As<Napi::Array>();

	for (unsigned int i = 0; i < arr.Length(); i++) {
		Napi::Value arrItem = arr[i];
		Napi::Object item = arrItem.As<Napi::Object>();

    std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
		auto utf8ProcessName = item.Get("processName").As<Napi::String>().Utf8Value();
		std::wstring processName = converter.from_bytes(utf8ProcessName.c_str());
		// std::string utf8Str = converter.to_bytes(processName.c_str());
		// auto processName = item.Get("processName").As<Napi::String>();
		auto wpos = (int)item.Get("wpos").As<Napi::Number>();
		auto wsize = (int)item.Get("wsize").As<Napi::Number>();
		auto width = (int)item.Get("width").As<Napi::Number>();
		auto height = (int)item.Get("height").As<Napi::Number>();

		GameModeInfo info{std::wstring(std::move(processName)), (FGM_WINDOW_POSITION)wpos, (FGM_WINDOW_SIZE)wsize, width, height };
		listGameModeInfo.push_back(info);
	}

	g_FGM->SetDataList(listGameModeInfo);
	return env.Undefined();
}


Napi::Value FGM::addGameModeInfo(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}	

	auto item = info[0].As<Napi::Object>();
	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto utf8ProcessName = item.Get("processName").As<Napi::String>().Utf8Value();
	std::wstring processName = converter.from_bytes(utf8ProcessName.c_str());
	// std::string utf8Str = converter.to_bytes(processName.c_str());
	// auto processName = item.Get("processName").As<Napi::String>();
	auto wpos = (int)item.Get("wpos").As<Napi::Number>();
	auto wsize = (int)item.Get("wsize").As<Napi::Number>();
	auto width = (int)item.Get("width").As<Napi::Number>();
	auto height = (int)item.Get("height").As<Napi::Number>();

	g_FGM->AddGameModeInfo(GameModeInfo{ std::wstring(processName.c_str()), (FGM_WINDOW_POSITION)wpos, (FGM_WINDOW_SIZE)wsize, width, height });

	return env.Undefined();
}


Napi::Value FGM::setEventListener(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	if (info.Length() < 2) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}	

	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto eventName = info[0].As<Napi::String>();
	auto eventHandler = info[1].As<Napi::Function>();
	g_FGM->SetEventListener(eventName.Utf8Value(), eventHandler);

	return env.Undefined();
}


Napi::Value FGM::start(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	g_FGM->Start();
  
	return env.Undefined();
}


Napi::Value FGM::pause(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}
  
	g_FGM->Pause();

	return env.Undefined();
}  


Napi::Value FGM::stop(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	g_FGM->Stop();
  
	return env.Undefined();
}  


Napi::Number FGM::state(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return  Napi::Number::New(env, -1);
	}

	return Napi::Number::New(env, g_FGM->State());
} 


Napi::Array FGM::getWindowAppList(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();

	return Napi::Array::New(env, 0);
}



Napi::Object FGM::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("initialize", Napi::Function::New(env, FGM::initialize));
	exports.Set("unInitialize", Napi::Function::New(env, FGM::unInitialize));
	exports.Set("setDataList", Napi::Function::New(env, FGM::setDataList));
	exports.Set("addGameModeInfo", Napi::Function::New(env, FGM::addGameModeInfo));
	exports.Set("setEventListener", Napi::Function::New(env, FGM::setEventListener));
	exports.Set("start", Napi::Function::New(env, FGM::start));
	exports.Set("pause", Napi::Function::New(env, FGM::pause));
	exports.Set("stop", Napi::Function::New(env, FGM::stop));
	exports.Set("state", Napi::Function::New(env, FGM::state));
	exports.Set("getWindowAppList", Napi::Function::New(env, FGM::getWindowAppList));

  return exports;
}
