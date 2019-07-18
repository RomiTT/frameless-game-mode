#pragma once
#ifndef __FGM_WORKER_H__
#define __FGM_WORKER_H__

#include "FGMContext.h"
#include "../../common/ThreadSafeFunction.h"

namespace FGM {
  class FGMWorker : public Napi::AsyncWorker {
		std::shared_ptr<FGMContext> _spContext;

		std::shared_ptr <ThreadSafeFunction> _callbackStarted;
		std::shared_ptr <ThreadSafeFunction> _callbackPaused;
		std::shared_ptr <ThreadSafeFunction> _callbackStopped;
    
  public:
    FGMWorker(std::shared_ptr<FGMContext> spContext);

    ~FGMWorker();
    // This code will be executed on the worker thread
    void Execute();

    void OnOK();

  private:
    void ChangeState(FGM_STATE newState);
		void ForceApplyGameModeInfo(const WCHAR* key);
  };
};




struct WindowApp {
  std::wstring processPath;
  std::wstring processName;
  std::wstring title;
  std::wstring key;
  RECT windowArea;
  RECT clientArea;
  DWORD style;
  DWORD exStyle;
};

void MakeKey(const WCHAR* processName, const WCHAR* title, std::wstring& out);
void GetWindowAppList(std::vector<WindowApp>& out);

#endif
