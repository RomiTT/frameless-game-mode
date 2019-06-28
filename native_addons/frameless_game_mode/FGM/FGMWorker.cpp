#include "FGMWorker.h"
#include <assert.h>


using namespace FGM;
const DWORD WINDOW_STYLE_TO_CHECK  = (WS_VISIBLE | WS_CAPTION | WS_OVERLAPPED);

BOOL CALLBACK EnumWindowProcForFGM(HWND hWnd, LPARAM lParam);
void ProcessOnlyForForegroundWindow(std::vector<GameModeInfo>& list);


class JsArgumentString : public ThreadSafeFunction::JsArgument {
	std::string msg;

public:
	JsArgumentString(std::shared_ptr<ThreadSafeFunction> owner, const char* str) 
	: JsArgument(owner)
	, msg(str) {}

	virtual Napi::Value GetArgument(const Napi::Env& env) {
		return Napi::String::New(env, msg.c_str());
	}
};



FGMWorker::FGMWorker(std::shared_ptr< FGMContext> spContext)
: AsyncWorker(spContext->callbackStopped.Value())
, _spContext(spContext) {
	_callbackStarted = ThreadSafeFunction::Create(spContext->callbackStarted.Value());
	_callbackPaused = ThreadSafeFunction::Create(spContext->callbackPaused.Value());
	_callbackStopped = ThreadSafeFunction::Create(spContext->callbackStopped.Value());
}

FGMWorker::~FGMWorker() {}


void FGMWorker::Execute() {
  DWORD oldTick = 0;
  DWORD currentTick = 0;

	_callbackStarted->Acquire();
	_callbackPaused->Acquire();
	_callbackStopped->Acquire();

  while (_spContext->state != FGM_STATE_STOPPED) {
    switch (_spContext->state) {
      case FGM_STATE_REQUESTED_STARTING:
        ChangeState(FGM_STATE_STARTED);
				_callbackStarted->Invoke(new JsArgumentString{ _callbackStarted, "FGM Started" });
        break;

      case FGM_STATE_REQUESTED_PAUSING:
        ChangeState(FGM_STATE_PAUSED);
				_callbackPaused->Invoke(new JsArgumentString{ _callbackPaused, "FGM Paused" });
        break;

      case FGM_STATE_REQUESTED_STOPPING:
        ChangeState(FGM_STATE_STOPPED);				
        break;
    }

    if (_spContext->state != FGM_STATE_PAUSED) {
      currentTick = GetTickCount64();

      if ((currentTick-oldTick) >= _spContext->interval) {
        oldTick = currentTick;

        _spContext->mtx.lock();
        switch (_spContext->mode) {
          case FGM_MODE_ONLY_FOR_FOREGROUND_WINDOW:
            ProcessOnlyForForegroundWindow(_spContext->listGameModeInfo);
            break;
          case FGM_MODE_ALL_WINDOWS:
            EnumWindows(EnumWindowProcForFGM, reinterpret_cast<LPARAM>(&_spContext->listGameModeInfo));
            break;
        }
        _spContext->mtx.unlock();
      }
    }

    Sleep(5);
  }

	_callbackStopped->Invoke(new JsArgumentString{ _callbackStopped, "FGM Stopped" });

	_callbackStarted->Release();
	_callbackPaused->Release();
	_callbackStopped->Release();
}

void FGMWorker::OnOK() {
  //Napi::HandleScope scope(Env());
  //Callback().Call({Env().Null()});
}


void FGMWorker::ChangeState(FGM_STATE newState) {
  _spContext->mtx.lock();
  _spContext->state = newState;
  _spContext->mtx.unlock();
}





const WCHAR* GetProcessNameFromWindowHandle(HWND hwnd) {
	DWORD buffSize = 1024;
	static WCHAR buffer[1024];

	DWORD dwPID;
	GetWindowThreadProcessId(hwnd, &dwPID);
	HANDLE handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE,	dwPID);

	if (handle) {	
		buffer[0] = 0;
		if (QueryFullProcessImageName(handle, 0, buffer, &buffSize)) {
			CloseHandle(handle);
			return buffer;
		}

		CloseHandle(handle);
	}

	return nullptr;
}


const WCHAR* GetWindowTitle(HWND hWnd) {
	static WCHAR title[_MAX_PATH];
	title[0] = 0;
	GetWindowText(hWnd, title, _MAX_PATH);

	return title;
}


void MadeWindowFrameless(HWND hwnd, GameModeInfo& item) {
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
		case FGM_BASED_ON_CLIENT_AREA: {
			break;
		}
		case FGM_BASED_ON_WINDOW_AREA: {
			width = rcWindow.right - rcWindow.left;
			height = rcWindow.bottom - rcWindow.top;
			break;
		}
		case FGM_CUSTOM_SIZE: {
			width = item.width;
			height = item.height;
			break;
		}
	}

	switch (item.wpos) {
		case FGM_LEFT_TOP: {
			break;
		}
		case FGM_LEFT_CENTER: {
			y = (screenHeight - height) / 2;
			break;
		}
		case FGM_LEFT_BOTTOM: {
			y = screenHeight - height;
			break;
		}
		case FGM_MIDDLE_TOP: {
			x = (screenWidth - width) / 2;
			break;
		}
		case FGM_MIDDLE_CENTER: {
			x = (screenWidth - width) / 2;
			y = (screenHeight - height) / 2;
			break;
		}
		case FGM_MIDDLE_BOTTOM: {
			x = (screenWidth - width) / 2;
			y = screenHeight - height;
			break;
		}
		case FGM_RIGHT_TOP: {
			x = screenWidth - width;
			break;
		}
		case FGM_RIGHT_CENTER: {
			x = screenWidth - width;
			y = (screenHeight - height) / 2;
			break;
		}
		case FGM_RIGHT_BOTTOM: {
			x = screenWidth - width;
			y = screenHeight - height;
			break;
		}
	}

	MoveWindow(hwnd, x, y, width, height, TRUE);
}


BOOL IsMainWindow(HWND hWnd) {
	return GetWindow(hWnd, GW_OWNER) == (HWND)0 && IsWindowVisible(hWnd);
}



BOOL CALLBACK EnumWindowProcForFGM(HWND hWnd, LPARAM lParam) {	
	if (!IsMainWindow(hWnd)) {
		return TRUE;
	}

	std::vector<GameModeInfo>* list = reinterpret_cast<std::vector<GameModeInfo>*>(lParam);

	if ((GetWindowLong(hWnd, GWL_STYLE) & WINDOW_STYLE_TO_CHECK) == WINDOW_STYLE_TO_CHECK) {
		const WCHAR* processName = GetProcessNameFromWindowHandle(hWnd);
		const WCHAR* title = GetWindowTitle(hWnd);

		if (processName != nullptr) {
			for (auto item : (*list)) {
				if (lstrcmpi(processName, item.processName.c_str()) == 0) {
					MadeWindowFrameless(hWnd, item);
					break;
				}
			}
		}
		else if (title != nullptr) {
			for (auto item : (*list)) {
				if (lstrcmp(title, item.title.c_str()) == 0) {
					MadeWindowFrameless(hWnd, item);
					break;
				}
			}			
		}
	}

	return TRUE;
}


void ProcessOnlyForForegroundWindow(std::vector<GameModeInfo>& list) {
	HWND hWnd = GetForegroundWindow();					
	if ((GetWindowLong(hWnd, GWL_STYLE) & WINDOW_STYLE_TO_CHECK) == WINDOW_STYLE_TO_CHECK) {
		const WCHAR* processName = GetProcessNameFromWindowHandle(hWnd);

		if (processName != nullptr) {
			for (auto item : list) {
				if (wcsstr(processName, item.processName.c_str()) != NULL) {
					MadeWindowFrameless(hWnd, item);
					break;
				}
			}
		}						
	}
}


void GetWindowAppList(std::vector<WindowApp>& out) {
	HWND hWnd = GetForegroundWindow();
	hWnd = GetWindow(hWnd, GW_HWNDFIRST);
	while (hWnd != NULL) {
		if ((GetWindowLong(hWnd, GWL_STYLE) & WINDOW_STYLE_TO_CHECK) == WINDOW_STYLE_TO_CHECK && IsMainWindow(hWnd)) {
			const WCHAR* processName = GetProcessNameFromWindowHandle(hWnd);
			const WCHAR* title = GetWindowTitle(hWnd);

			if (lstrlen(processName) > 0 || lstrlen(title) > 0) {
				auto app = WindowApp{ (processName == NULL) ? L"" : processName,
														  (title == NULL) ? L"" : title };

				if (!(wcsstr(app.processName.c_str(), L"explorer.exe") != NULL && app.title.size() == 0)) {
					out.push_back(app);
				}
			}
		}

		hWnd = GetWindow(hWnd, GW_HWNDNEXT);
	}
}