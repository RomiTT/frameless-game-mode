#pragma once 

#ifndef __THREAD_SAFE_FUNCTION_H__
#define __THREAD_SAFE_FUNCTION_H__

#include <napi.h>
#include <functional>
#include <memory>


class ThreadSafeFunction {
public:
	class JsArgument {	
		std::shared_ptr<ThreadSafeFunction> _owner;		

	public:		
		JsArgument(std::shared_ptr<ThreadSafeFunction> owner) : _owner(owner) {}

		virtual napi_value GetArgument(napi_env env) = 0;
		virtual void Destory() { delete this; };		
	};

private:
	napi_threadsafe_function _func;
	napi_env _env;
	napi_value _callback;
	Napi::FunctionReference _callbackRef;

public:
  ThreadSafeFunction(const Napi::Function& callback);
  ~ThreadSafeFunction();

	void Invoke(JsArgument* arg);

private:
	static void CallJs(napi_env env, napi_value js_cb, void* context, void* data);
};



#endif