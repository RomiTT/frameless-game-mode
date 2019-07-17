#pragma once

#ifndef __ASYNC_PROMISE_WORKER_H__
#define __ASYNC_PROMISE_WORKER_H__

#include <napi.h>
#include <string>
#include <vector>
#include <thread>
#include <memory>
#include <functional>
#include <windows.h>
#include "ThreadSafeFunction.h"


class AsyncPromiseWorker {
public:
	typedef std::function<void(std::shared_ptr<AsyncPromiseWorker>)> RunFunction;

protected:
	napi_env _env;
	napi_deferred _deferred;
	napi_value _promise;
	std::shared_ptr<ThreadSafeFunction> _threadSafeCallback;
	RunFunction _fRun;

protected:
	AsyncPromiseWorker(napi_env _env, RunFunction f);

public:
	virtual ~AsyncPromiseWorker();	
	
	void Resolve(ThreadSafeFunction::GetValueFunction f);
	void Reject(const char* error);

	static Napi::Promise Run(napi_env env, RunFunction f);

private:
	static Napi::Value Callback(const Napi::CallbackInfo& info);
};

typedef std::shared_ptr<AsyncPromiseWorker> AsyncPromiseWorkerPtr;

#endif