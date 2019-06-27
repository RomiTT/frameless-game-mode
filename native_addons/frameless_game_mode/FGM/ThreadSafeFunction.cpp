#include "ThreadSafeFunction.h"
#include <assert.h>


ThreadSafeFunction::ThreadSafeFunction(const Napi::Function& callback) {
	_env = callback.Env();
	_callback = static_cast<napi_value>(callback);
	_callbackRef = Napi::Persistent(callback);

	napi_value work_name;

	assert(napi_create_string_utf8(_env,
																	"N-API Thread-safe Call from ThreadSafeFunction class",
																	NAPI_AUTO_LENGTH,
																	&work_name) == napi_ok);

	assert(napi_create_threadsafe_function(_env,
																					_callback,
																					NULL,
																					work_name,
																					0,
																					1,
																					NULL,
																					NULL,
																					NULL,
																					CallJs,
																					&_func) == napi_ok);
}

ThreadSafeFunction::~ThreadSafeFunction() {
	assert(napi_release_threadsafe_function(_func,
	 																				napi_tsfn_release) == napi_ok);
}


void ThreadSafeFunction::Invoke(JsArgument* arg) {
	assert(napi_call_threadsafe_function(_func,
																				arg,
																				napi_tsfn_blocking) == napi_ok);
}



void ThreadSafeFunction::CallJs(napi_env env, napi_value js_cb, void* context, void* data) {
	(void)context;
	JsArgument* jsArg = (JsArgument*)data;

	if (env != NULL) {		
		Napi::Value argVal;
		napi_value arg = jsArg->GetArgument(env);		
    napi_value undefined;

		// Retrieve the JavaScript `undefined` value so we can use it as the `this`
		// value of the JavaScript function call.
		assert(napi_get_undefined(env, &undefined) == napi_ok);

		// Call the JavaScript function and pass it the prime that the secondary
		// thread found.
		assert(napi_call_function(env,
			undefined,
			js_cb,
			1,
			(arg == NULL) ? NULL : &arg,
			NULL) == napi_ok);
	}

	jsArg->Destory();
}
