#pragma once
#ifndef __FGM_WORKER_H__
#define __FGM_WORKER_H__

#include "FGMContext.h"

namespace FGM {
  class FGMWorker : public Napi::AsyncWorker {
		std::shared_ptr< FGMContext> _spContext;
    
  public:
    FGMWorker(std::shared_ptr< FGMContext> spContext);

    ~FGMWorker();
    // This code will be executed on the worker thread
    void Execute();

    void OnOK();

  private:
    void ChangeState(FGM_STATE newState);
  };
};

#endif
