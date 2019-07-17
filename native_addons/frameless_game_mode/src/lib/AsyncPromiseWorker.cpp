#include "AsyncPromiseWorker.h"



AsyncPromiseWorker::AsyncPromiseWorker(napi_env env, RunFunction f)
: _env(env)
, _deferred(nullptr)
, _promise(nullptr)
, _fRun(std::move(f)) {

	napi_status status = napi_create_promise(env, &_deferred, &_promise);
	_resolveCallback = ThreadSafeFunction::Create(Napi::Function::New(_env, CallbackResolve, nullptr, _deferred));
	_rejectCallback = ThreadSafeFunction::Create(Napi::Function::New(_env, CallbackReject, nullptr, _deferred));
}


AsyncPromiseWorker::~AsyncPromiseWorker() {

}


void AsyncPromiseWorker::Resolve(ThreadSafeFunction::GetValueFunction f) {
	_resolveCallback->Call(_resolveCallback, f);
}


void AsyncPromiseWorker::Reject(ThreadSafeFunction::GetValueFunction f) {
	_rejectCallback->Call(_rejectCallback, f);
}




Napi::Promise AsyncPromiseWorker::Run(napi_env env, RunFunction f) {
	auto w = std::shared_ptr<AsyncPromiseWorker>(new AsyncPromiseWorker(env, f));
	std::thread t([](std::shared_ptr<AsyncPromiseWorker> worker) {
		worker->_fRun(worker);
	}, w);

	t.detach();
	return Napi::Promise(w->_env, w->_promise);
}



Napi::Value AsyncPromiseWorker::CallbackResolve(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	auto deferred = (napi_deferred)info.Data();
	napi_resolve_deferred(env, deferred, info[0]);
	return env.Undefined();
}


Napi::Value AsyncPromiseWorker::CallbackReject(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	auto deferred = (napi_deferred)info.Data();
	napi_reject_deferred(env, deferred, info[0]);
	return env.Undefined();
}