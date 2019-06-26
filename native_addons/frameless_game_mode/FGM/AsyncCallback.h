#pragma once
#ifndef __ASYNC_CALLBACK_H__
#define __ASYNC_CALLBACK_H__

#include <napi.h>
#include <uv.h>

class AsyncCallback {
	struct Payload {
		Napi::FunctionReference callback;
	};

	uv_async_t* _handle = nullptr;

public:
	AsyncCallback();
	~AsyncCallback();

	void Invoke(Napi::Function& callback, Napi::Value& arg);

private:
	static void Excute(uv_async_t* handle);
	static void CloseCallback(uv_handle_t* handle);
};

#endif;