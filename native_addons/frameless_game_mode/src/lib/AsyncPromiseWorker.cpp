#include "AsyncPromiseWorker.h"



AsyncPromiseWorker::AsyncPromiseWorker(napi_env env, RunFunction f)
: _env(env)
, _deferred(nullptr)
, _promise(nullptr)
, _fRun(std::move(f)) {

	napi_status status = napi_create_promise(env, &_deferred, &_promise);
	_threadSafeCallback = ThreadSafeFunction::Create(Napi::Function::New(_env, Callback, nullptr, _deferred));
}


AsyncPromiseWorker::~AsyncPromiseWorker() {

}


void AsyncPromiseWorker::Resolve(ThreadSafeFunction::GetValueFunction f) {
	_threadSafeCallback->Call(_threadSafeCallback, f);
}


void AsyncPromiseWorker::Reject(const char* error) {
	napi_reject_deferred(_env, _deferred, Napi::String::New(_env, error));
}




Napi::Promise AsyncPromiseWorker::Run(napi_env env, RunFunction f) {
	auto w = std::shared_ptr<AsyncPromiseWorker>(new AsyncPromiseWorker(env, f));
	std::thread t([](std::shared_ptr<AsyncPromiseWorker> worker) {
		worker->_fRun(worker);
	}, w);

	t.detach();
	return Napi::Promise(w->_env, w->_promise);
}



Napi::Value AsyncPromiseWorker::Callback(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	auto deferred = (napi_deferred)info.Data();
	napi_resolve_deferred(env, deferred, info[0]);
	return env.Undefined();
}