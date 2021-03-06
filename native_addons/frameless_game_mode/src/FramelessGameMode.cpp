#include <locale>
#include <codecvt>
#include <chrono>
#include <thread>
#include <algorithm>
#include "FGMContext.h"
#include "FramelessGameMode.h"
#include "FGMWorker.h"
#include "../../common/AsyncPromiseWorker.h"

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
		if (_spContext->state == FGM_STATE::STOPPED) {
			_spContext->state = FGM_STATE::REQUESTED_STARTING;
			auto worker = new FGMWorker(_spContext);
			worker->Queue();
		}
		else if (_spContext->state == FGM_STATE::PAUSED) {
			_spContext->state = FGM_STATE::REQUESTED_STARTING;				
		}
		_spContext->mtx.unlock();
	}

	void Pause() {
		_spContext->mtx.lock();
		if (_spContext->state == FGM_STATE::STARTED) {
			_spContext->state = FGM_STATE::REQUESTED_PAUSING;
		}
		_spContext->mtx.unlock();
	}

	void Stop() {
		_spContext->mtx.lock();
		if (_spContext->state == FGM_STATE::STARTED || _spContext->state == FGM_STATE::PAUSED) {
			_spContext->state = FGM_STATE::REQUESTED_STOPPING;
		}
		_spContext->mtx.unlock();
	}

	void AddGameModeInfo(GameModeInfo& info) {
		_spContext->mtx.lock();
		_spContext->listGameModeInfo.push_back(info);
		_spContext->mtx.unlock();
	}


	void EditGameModeInfo(GameModeInfo& info) {
		_spContext->mtx.lock();
		auto iter = std::find_if(_spContext->listGameModeInfo.begin(), _spContext->listGameModeInfo.end(), [&info](GameModeInfo& item) {
			return lstrcmpi(info.key.c_str(), item.key.c_str()) == 0;
		});

		if (iter != _spContext->listGameModeInfo.end()) {		
			iter->wpos = info.wpos;
			iter->wsize = info.wsize;
			iter->width = info.width;
			iter->height = info.height;							
		}

		_spContext->mtx.unlock();
	}


	void RemoveGameModeInfo(const WCHAR* key) {
		_spContext->mtx.lock();
		auto iter = std::find_if(_spContext->listGameModeInfo.begin(), _spContext->listGameModeInfo.end(), [&key](GameModeInfo& item) {
			return lstrcmpi(key, item.key.c_str()) == 0;
		});

		if (iter != _spContext->listGameModeInfo.end()) {
			_spContext->listGameModeInfo.erase(iter);
		}
		_spContext->mtx.unlock();
	}

	void ForceApplyGameModeInfo(const WCHAR* key) {
		_spContext->mtx.lock();
		_spContext->keyToForceApply = key;
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

	void SetMode(FGM_WATCH_MODE mode) { _spContext->mode = mode; }
	FGM_WATCH_MODE GetMode() { return _spContext->mode; }
};


FramelessGameMode* g_FGM = NULL;
std::vector<std::wstring> g_excluded_apps;


Napi::Value FGM::initialize(const Napi::CallbackInfo &info) {
	if (g_FGM == NULL) {
		g_FGM = new FramelessGameMode();
	}

	g_excluded_apps.push_back(L"Frameless Game Mode.exe");
	g_excluded_apps.push_back(L"explorer.exe");
	// g_excluded_apps.push_back(L"iexplorer.exe");
	// g_excluded_apps.push_back(L"chrome.exe");
	// g_excluded_apps.push_back(L"firefox.exe");
	// g_excluded_apps.push_back(L"taskmgr.exe");
	// g_excluded_apps.push_back(L"devenv.exe");
	// g_excluded_apps.push_back(L"code.exe");

	return info.Env().Undefined();
}


Napi::Value FGM::unInitialize(const Napi::CallbackInfo &info) {
	if (g_FGM != NULL) {
		if (g_FGM->State() != FGM_STATE::STOPPED) {
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
		std::wstring processName = converter.from_bytes(utf8ProcessName);
		auto utf8Title = item.Get("title").As<Napi::String>().Utf8Value();
		std::wstring title = converter.from_bytes(utf8Title);
		std::wstring key;
		MakeKey(processName.c_str(), title.c_str(), key);

		auto wpos = (int)item.Get("wpos").As<Napi::Number>();
		auto wsize = (int)item.Get("wsize").As<Napi::Number>();
		auto width = (int)item.Get("width").As<Napi::Number>();
		auto height = (int)item.Get("height").As<Napi::Number>();

		listGameModeInfo.push_back(GameModeInfo{ std::move(processName), 
			                                       std::move(title), 
																						 std::move(key),
			                                       (FGM_WINDOW_POSITION)wpos, 
			                                       (FGM_WINDOW_SIZE)wsize, 
			                                       width, 
			                                       height});
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
	auto utf8Title = item.Get("title").As<Napi::String>().Utf8Value();
	std::wstring title = converter.from_bytes(utf8Title);
	std::wstring key;
	MakeKey(processName.c_str(), title.c_str(), key);

	auto wpos = (int)item.Get("wpos").As<Napi::Number>();
	auto wsize = (int)item.Get("wsize").As<Napi::Number>();
	auto width = (int)item.Get("width").As<Napi::Number>();
	auto height = (int)item.Get("height").As<Napi::Number>();

	g_FGM->AddGameModeInfo(GameModeInfo{ std::move(processName), 
		                                   std::move(title), 
																			 std::move(key),
		                                   (FGM_WINDOW_POSITION)wpos, 
		                                   (FGM_WINDOW_SIZE)wsize, 
		                                   width, 
		                                   height});

	return env.Undefined();
}


Napi::Value FGM::editGameModeInfo(const Napi::CallbackInfo &info) {
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
	auto utf8Title = item.Get("title").As<Napi::String>().Utf8Value();
	std::wstring title = converter.from_bytes(utf8Title);
	std::wstring key;
	MakeKey(processName.c_str(), title.c_str(), key);

	auto wpos = (int)item.Get("wpos").As<Napi::Number>();
	auto wsize = (int)item.Get("wsize").As<Napi::Number>();
	auto width = (int)item.Get("width").As<Napi::Number>();
	auto height = (int)item.Get("height").As<Napi::Number>();

	g_FGM->EditGameModeInfo(GameModeInfo{ std::move(processName), 
		                                   std::move(title), 
																			 std::move(key),
		                                   (FGM_WINDOW_POSITION)wpos, 
		                                   (FGM_WINDOW_SIZE)wsize, 
		                                   width, 
		                                   height});

	return env.Undefined();
}



Napi::Value FGM::removeGameModeInfo(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}	

	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto utf8Key = info[0].As<Napi::String>();
	auto key = converter.from_bytes(utf8Key);

	g_FGM->RemoveGameModeInfo(key.c_str());
	return env.Undefined();
}

Napi::Value FGM::forceApplyGameModeInfo(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto utf8Key = info[0].As<Napi::String>();
	auto key = converter.from_bytes(utf8Key);

	g_FGM->ForceApplyGameModeInfo(key.c_str());
	return env.Undefined();
}

Napi::Value FGM::excludeProcess(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto utf8ProcessName = info[0].As<Napi::String>();
	auto processName = converter.from_bytes(utf8ProcessName);

	g_excluded_apps.push_back(std::move(processName));
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


Napi::Promise FGM::getWindowAppList(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();

	auto promise = AsyncPromiseWorker::Run(env, [](AsyncPromiseWorkerPtr worker) {
		auto listPtr = std::shared_ptr<std::vector<WindowApp>>(new std::vector<WindowApp>());
		GetWindowAppList(*listPtr);

		std::sort(listPtr->begin(), listPtr->end(), [](const WindowApp& a, const WindowApp& b) {
			auto ret = lstrcmpi(a.processName.c_str(), b.processName.c_str());
			if (ret == 0) {
				ret = lstrcmpi(a.title.c_str(), b.title.c_str());
			}
			return (ret < 0);
			});

		worker->Resolve([listPtr](napi_env env) {
			auto array = Napi::Array::New(env, listPtr->size());
			std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;

			// napi_value array_value;
			// napi_create_array_with_length(env, _list.size(), &array_value);

			for (size_t i = 0; i < listPtr->size(); i++) {
				auto windowApp = listPtr->at(i);
				auto item = Napi::Object::New(env);
				auto processPath = Napi::String::New(env, converter.to_bytes(windowApp.processPath));
				auto processName = Napi::String::New(env, converter.to_bytes(windowApp.processName));
				auto title = Napi::String::New(env, converter.to_bytes(windowApp.title));
				auto key = Napi::String::New(env, converter.to_bytes(windowApp.key));

				item.Set("processPath", processPath);
				item.Set("processName", processName);
				item.Set("title", title);
				item.Set("key", key);
				
				auto windowArea = Napi::Object::New(env);
				item.Set("windowArea", windowArea);
				windowArea.Set("x", windowApp.windowArea.left);
				windowArea.Set("y", windowApp.windowArea.top);
				windowArea.Set("width", (windowApp.windowArea.right-windowApp.windowArea.left));
				windowArea.Set("height", (windowApp.windowArea.bottom-windowApp.windowArea.bottom));

				auto clientArea = Napi::Object::New(env);
				item.Set("clientArea", clientArea);
				clientArea.Set("x", windowApp.clientArea.left);
				clientArea.Set("y", windowApp.clientArea.top);
				clientArea.Set("width", (windowApp.clientArea.right-windowApp.clientArea.left));
				clientArea.Set("height", (windowApp.clientArea.bottom-windowApp.clientArea.bottom));

				item.Set("style", windowApp.style);
				item.Set("exStyle", windowApp.exStyle);

				array[i] = item;

				//napi_set_element(env, array_value, i, item);
			}

			//return Napi::Value(env, array_value);
			return array;
		});
	});

	return promise;
}


Napi::Value FGM::setMode(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return  Napi::Number::New(env, -1);
	}

	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}	

	auto mode = (int)info[0].As<Napi::Number>();
	g_FGM->SetMode((FGM_WATCH_MODE)mode);  
	return env.Undefined();	
}


Napi::Number FGM::getMode(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (g_FGM == NULL) {
		Napi::TypeError::New(env, "You need to call the initialize function.").ThrowAsJavaScriptException();
		return  Napi::Number::New(env, -1);
	}

	return Napi::Number::New(env, (int)g_FGM->GetMode());
}



Napi::Object FGM::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("initialize", Napi::Function::New(env, FGM::initialize));
	exports.Set("unInitialize", Napi::Function::New(env, FGM::unInitialize));
	exports.Set("setDataList", Napi::Function::New(env, FGM::setDataList));
	exports.Set("addGameModeInfo", Napi::Function::New(env, FGM::addGameModeInfo));
	exports.Set("editGameModeInfo", Napi::Function::New(env, FGM::editGameModeInfo));
	exports.Set("removeGameModeInfo", Napi::Function::New(env, FGM::removeGameModeInfo));
	exports.Set("forceApplyGameModeInfo", Napi::Function::New(env, FGM::forceApplyGameModeInfo));
	exports.Set("excludeProcess", Napi::Function::New(env, FGM::excludeProcess));
	exports.Set("setEventListener", Napi::Function::New(env, FGM::setEventListener));
	exports.Set("start", Napi::Function::New(env, FGM::start));
	exports.Set("pause", Napi::Function::New(env, FGM::pause));
	exports.Set("stop", Napi::Function::New(env, FGM::stop));
	exports.Set("state", Napi::Function::New(env, FGM::state));
	exports.Set("getWindowAppList", Napi::Function::New(env, FGM::getWindowAppList));
	exports.Set("setMode", Napi::Function::New(env, FGM::setMode));
	exports.Set("getMode", Napi::Function::New(env, FGM::getMode));

  return exports;
}
