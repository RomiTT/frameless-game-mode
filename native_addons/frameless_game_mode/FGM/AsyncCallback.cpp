#include "AsyncCallback.h"

AsyncCallback::AsyncCallback() {
  _handle = (uv_async_t*)malloc(sizeof(uv_async_t));
  uv_async_init(uv_default_loop(), _handle, Excute);
}

AsyncCallback::~AsyncCallback() {
  uv_close((uv_handle_t*)_handle, CloseCallback);
}

void AsyncCallback::Invoke(Napi::Function& callback, Napi::Value& arg) {
  auto payload = new Payload{ Napi::Persistent(callback) }; 
  _handle->data = (void*)payload;
  uv_async_send(_handle);
}


void AsyncCallback::Excute(uv_async_t* handle) {
  auto payload = (Payload*)handle->data;
  payload->callback.Call({ });
  delete payload;
}

void AsyncCallback::CloseCallback(uv_handle_t* handle) {
  free(handle);
};
