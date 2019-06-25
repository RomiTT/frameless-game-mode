#include "FramelessGameMode.h"
#include <mutex>
#include <locale>
#include <codecvt>

  enum WINDOW_POSITION {
    LEFT_TOP,
    LEFT_CENTER,
    LEFT_BOTTOM,
    MIDDLE_TOP,
    MIDDLE_CENTER,
    MIDDLE_BOTTOM,
    RIGHT_TOP,
    RIGHT_CENTER,
    RIGHT_BOTTOM,
    CUSTOM_MODE,
  };

  enum WINDOW_SIZE {
    BASED_ON_CLIENT_AREA,
    BASED_ON_WINDOW_AREA,
    CUSTOM_SIZE
  };

  struct GameModeInfo {
    std::wstring processName;
    WINDOW_POSITION wpos;
    WINDOW_SIZE wsize;
    int width;
    int height;
  };


std::vector<GameModeInfo> g_listGameModeInfo;
BOOL g_isRunning = FALSE;
BOOL g_exit = TRUE;
BOOL g_exitCompleted = TRUE;
std::mutex g_mtx;



const WCHAR* GetForegroundProcessName(HWND hwnd) {
	DWORD buffSize = 1024;
	static WCHAR buffer[1024];

	DWORD dwPID;
	GetWindowThreadProcessId(hwnd, &dwPID);
	HANDLE handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE,	dwPID);

	if (handle) {	
		if (QueryFullProcessImageName(handle, 0, buffer, &buffSize)) {
			CloseHandle(handle);
			return buffer;
		}

		CloseHandle(handle);
	}

	return nullptr;
}


void MadeWindowFrameless(HWND hwnd, GameModeInfo& item) {
	DWORD style = WS_VISIBLE | WS_CAPTION | WS_OVERLAPPED;
	if ((GetWindowLong(hwnd, GWL_STYLE) & style) == style) {
		RECT rc;
		GetClientRect(hwnd, &rc);

		RECT rcWindow;
		GetWindowRect(hwnd, &rcWindow);

		int titlebarHeight = (rcWindow.bottom - rcWindow.top) - (rc.bottom - rc.top);
		int border2xWidth = (rcWindow.right - rcWindow.left) - (rc.right - rc.left);
		int width = rc.right - rc.left;
		int height = rc.bottom - rc.top;

		SetWindowLong(hwnd, GWL_STYLE, (WS_VISIBLE | WS_CLIPSIBLINGS | WS_CLIPCHILDREN | WS_OVERLAPPED));
		SetWindowLong(hwnd, GWL_EXSTYLE, (WS_EX_LEFT | WS_EX_LTRREADING | WS_EX_RIGHTSCROLLBAR));

		RECT rcWorkArea = { 0 };
		SystemParametersInfo(SPI_GETWORKAREA, 0, &rcWorkArea, FALSE);
		int screenWidth = rcWorkArea.right - rcWorkArea.left;
		int screenHeight = rcWorkArea.bottom - rcWorkArea.top;
		int x = 0;
		int y = 0;

		switch (item.wsize) {
			case BASED_ON_CLIENT_AREA: {
				break;
			}
			case BASED_ON_WINDOW_AREA: {
				width = rcWindow.right - rcWindow.left;
				height = rcWindow.bottom - rcWindow.top;
				break;
			}
			case CUSTOM_SIZE: {
				width = item.width;
				height = item.height;
				break;
			}
		}

		switch (item.wpos) {
			case LEFT_TOP: {
				break;
			}
			case LEFT_CENTER: {
				y = (screenHeight - height) / 2;
				break;
			}
			case LEFT_BOTTOM: {
				y = screenHeight - height;
				break;
			}
			case MIDDLE_TOP: {
				x = (screenWidth - width) / 2;
				break;
			}
			case MIDDLE_CENTER: {
				x = (screenWidth - width) / 2;
				y = (screenHeight - height) / 2;
				break;
			}
			case MIDDLE_BOTTOM: {
				x = (screenWidth - width) / 2;
				y = screenHeight - height;
				break;
			}
			case RIGHT_TOP: {
				x = screenWidth - width;
				break;
			}
			case RIGHT_CENTER: {
				x = screenWidth - width;
				y = (screenHeight - height) / 2;
				break;
			}
			case RIGHT_BOTTOM: {
				x = screenWidth - width;
				y = screenHeight - height;
				break;
			}
		}

		MoveWindow(hwnd, x, y, width, height, TRUE);
	}
}



void InitFramelessGameMode(std::vector<GameModeInfo>& list) {
	g_mtx.lock();

	if (g_exit && g_exitCompleted) {
		g_exit = FALSE;
		g_exitCompleted = FALSE;

		g_listGameModeInfo = std::move(list);

		std::thread t([]() {
			while (!g_exit) {
				if (g_isRunning) {
					HWND hwnd = GetForegroundWindow();
					const WCHAR* processName = GetForegroundProcessName(hwnd);

					if (processName != nullptr) {
						for (auto item : g_listGameModeInfo) {
							if (wcsstr(processName, item.processName.c_str()) != NULL) {
								MadeWindowFrameless(hwnd, item);
								break;
							}
						}
					}
				}

				Sleep(100);
			}

			g_exitCompleted = TRUE;
		});

		t.detach();
	}

	g_mtx.unlock();
}

void StartFramelessGameMode() {
	g_mtx.lock();
	g_isRunning = TRUE;
	g_mtx.unlock();
}

void PauseFramelessGameMode() {
	g_mtx.lock();
	g_isRunning = FALSE;
	g_mtx.unlock();
}

void StopFramelessGameMode() {
	g_mtx.lock();
	g_isRunning = FALSE;
	g_exit = TRUE;
	g_mtx.unlock();
}

bool IsRunningFramelessGameMode() {
	return g_isRunning;
}

bool IsStoppedFramelessGameMode() {
	return g_exitCompleted;
}




Napi::Boolean FGM::initFramelessGameMode(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();

	if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return Napi::Boolean::New(env, false);
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

		GameModeInfo info{std::wstring(processName.c_str()), (WINDOW_POSITION)wpos, (WINDOW_SIZE)wsize, width, height };
		listGameModeInfo.push_back(info);
	}
 	

	InitFramelessGameMode(listGameModeInfo);
	return Napi::Boolean::New(env, true);
}


Napi::Value FGM::startFramelessGameMode(const Napi::CallbackInfo &info) {	
	Napi::Env env = info.Env();
	StartFramelessGameMode();
	return env.Undefined();
}

Napi::Value FGM::pauseFramelessGameMode(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	PauseFramelessGameMode();
	return env.Undefined();
}

Napi::Value FGM::stopFramelessGameMode(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	StopFramelessGameMode();
	return env.Undefined();
}

Napi::Boolean FGM::isRunningFramelessGameMode(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	return Napi::Boolean::New(env, IsRunningFramelessGameMode());
}

Napi::Boolean FGM::isStoppedFramelessGameMode(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	return Napi::Boolean::New(env, IsStoppedFramelessGameMode());
}

Napi::Object FGM::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("initFramelessGameMode", Napi::Function::New(env, FGM::initFramelessGameMode));
	exports.Set("startFramelessGameMode", Napi::Function::New(env, FGM::startFramelessGameMode));
	exports.Set("pauseFramelessGameMode", Napi::Function::New(env, FGM::pauseFramelessGameMode));
	exports.Set("stopFramelessGameMode", Napi::Function::New(env, FGM::stopFramelessGameMode));
	exports.Set("isRunningFramelessGameMode", Napi::Function::New(env, FGM::isRunningFramelessGameMode));
	exports.Set("isStoppedFramelessGameMode", Napi::Function::New(env, FGM::isStoppedFramelessGameMode));

  return exports;
}
