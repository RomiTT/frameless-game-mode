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
protected:
	napi_env _env;
	napi_deferred _deferred;
	napi_value _promise;
	std::shared_ptr<ThreadSafeFunction> _threadSafeCallback;

protected:
	AsyncPromiseWorker(const Napi::Env& env);	

public:
	virtual ~AsyncPromiseWorker();	

	virtual bool Execute() = 0;	

	void Resolve(ThreadSafeFunction::JsArgument* arg);
	void Resolve2(ThreadSafeFunction::GetValueFunction f);
	void Reject(const char* error);
	static Napi::Promise Run(std::shared_ptr<AsyncPromiseWorker> worker);

private:
	static Napi::Value Callback(const Napi::CallbackInfo& info);
};

typedef std::shared_ptr<AsyncPromiseWorker> AsyncPromiseWorkerPtr;

#endif