#include "AsyncPromiseWorker.h"



AsyncPromiseWorker::AsyncPromiseWorker(const Napi::Env& env)
: _env(env)
, _deferred(nullptr)
, _promise(nullptr) {

	napi_status status = napi_create_promise(env, &_deferred, &_promise);
	_threadSafeCallback = ThreadSafeFunction::Create(Napi::Function::New(_env, Callback, nullptr, _deferred));
}


AsyncPromiseWorker::~AsyncPromiseWorker() {

}



Napi::Promise AsyncPromiseWorker::Run(std::shared_ptr<AsyncPromiseWorker> w) {	
	std::thread t([](std::shared_ptr<AsyncPromiseWorker> worker) {
		worker->Execute();		
	},w);

	t.detach();

	return Napi::Promise(w->_env, w->_promise);
}


void AsyncPromiseWorker::Resolve(ThreadSafeFunction::JsArgument* arg) {
	_threadSafeCallback->Invoke(arg);
}

void AsyncPromiseWorker::Resolve2(ThreadSafeFunction::GetValueFunction f) {
	_threadSafeCallback->Call(_threadSafeCallback, f);
}


void AsyncPromiseWorker::Reject(const char* error) {
	napi_reject_deferred(_env, _deferred, Napi::String::New(_env, error));
}


Napi::Value AsyncPromiseWorker::Callback(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	auto deferred = (napi_deferred)info.Data();
	napi_resolve_deferred(env, deferred, info[0]);
	return env.Undefined();
}