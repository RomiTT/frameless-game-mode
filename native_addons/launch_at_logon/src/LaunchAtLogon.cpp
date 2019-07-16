#include "LaunchAtLogon.h"
#include <comutil.h >
#include <taskschd.h>
#include <locale>
#include <codecvt>
#pragma comment(lib, "taskschd.lib")
#pragma comment(lib, "comsupp.lib")

class CoInitializer {
	HRESULT hr;
public:
	CoInitializer() {	hr = CoInitializeEx(NULL, COINIT_MULTITHREADED);}
	~CoInitializer() { CoUninitialize();}
	HRESULT GetResult() { return hr;  }
};


template <typename T>
class ComPtr
{
	T* _obj;

public:
	ComPtr() : _obj(NULL) { }

	~ComPtr() {
		if (_obj != NULL) 
			_obj->Release();
	}

	T* operator -> () { return _obj; }
	T** operator & () { return &_obj; }
	operator T*() { return _obj;  }
};


HRESULT SetLaunchAtLogon(bool launchAtLogon, const WCHAR* taskName, const WCHAR* appPath, const WCHAR* appArgs) {
	CoInitializer initializer;
	HRESULT hr = initializer.GetResult();

	if (FAILED(hr)) {
		printf("CoInitializeEx failed: %x\n", hr);
		return hr;
	}

	//  Set general COM security levels.
	hr = CoInitializeSecurity(
		NULL,
		-1,
		NULL,
		NULL,
		RPC_C_AUTHN_LEVEL_PKT_PRIVACY,
		RPC_C_IMP_LEVEL_IMPERSONATE,
		NULL,
		0,
		NULL);

	if (FAILED(hr)) {
		printf("CoInitializeSecurity failed: %x\n", hr);
		return hr;
	}

	//  ------------------------------------------------------
	//  Create an instance of the Task Service. 
	ComPtr<ITaskService> taskService;
	hr = CoCreateInstance(CLSID_TaskScheduler,
		NULL,
		CLSCTX_INPROC_SERVER,
		IID_ITaskService,
		(void**)& taskService);
	if (FAILED(hr)) {
		printf("Failed to create an instance of ITaskService: %x\n", hr);
		return hr;
	}

	//  Connect to the task service.
	hr = taskService->Connect(_variant_t(), _variant_t(), _variant_t(), _variant_t());
	if (FAILED(hr)) {
		printf("ITaskService::Connect failed: %x\n", hr);
		return hr;
	}

	//  ------------------------------------------------------
	//  Get the pointer to the root task folder.  This folder will hold the
	//  new task that is registered.
	ComPtr<ITaskFolder> rootTaskFolder;
	hr = taskService->GetFolder(_bstr_t(L"\\"), &rootTaskFolder);
	if (FAILED(hr)) {
		printf("Cannot get Root Folder pointer: %x\n", hr);
		return hr;
	}

	//  If the same task exists, remove it.  
	rootTaskFolder->DeleteTask(_bstr_t(taskName), 0);
	if (launchAtLogon == false) {
		return S_OK;
	}

	//  Create the task builder object to create the task.
	ComPtr<ITaskDefinition> task;
	hr = taskService->NewTask(0, &task);
	if (FAILED(hr)) {
		printf("Failed to create a task definition: %x\n", hr);
		return hr;
	}

	ComPtr<IPrincipal> principal;
	hr = task->get_Principal(&principal);
	if (FAILED(hr)) {
		printf("Failed to get IPrincipal interface\n");
		return hr;
	}

	hr = principal->put_RunLevel(TASK_RUNLEVEL_HIGHEST);
	if (FAILED(hr)) {
		printf("Failed to call IPrincipal->put_RunLevel\n");
		return hr;
	}

	//  ------------------------------------------------------
	//  Get the registration info for setting the identification.
	ComPtr<IRegistrationInfo> regInfo;
	hr = task->get_RegistrationInfo(&regInfo);
	if (FAILED(hr)) {
		printf("Cannot get registration info: %x\n", hr);
		return hr;
	}

	hr = regInfo->put_Author(_bstr_t(taskName));
	if (FAILED(hr)) {
		printf("Cannot put identification info: %x\n", hr);
		return hr;
	}

	//  ------------------------------------------------------
	//  Create the settings for the task
	ComPtr<ITaskSettings> settings;
	hr = task->get_Settings(&settings);
	if (FAILED(hr)) {
		printf("Cannot get settings pointer: %x\n", hr);
		return hr;
	}

	//  Set setting values for the task. 
	hr = settings->put_StartWhenAvailable(VARIANT_TRUE);
	if (FAILED(hr)) {
		printf("Cannot put setting info: %x\n", hr);
		return hr;
	}

	//  ------------------------------------------------------
	//  Get the trigger collection to insert the logon trigger.
	ComPtr<ITriggerCollection> triggerCollection;
	hr = task->get_Triggers(&triggerCollection);
	if (FAILED(hr)) {
		printf("Cannot get trigger collection: %x\n", hr);
		return hr;
	}

	//  Add the logon trigger to the task.
	ComPtr<ITrigger> trigger;
	hr = triggerCollection->Create(TASK_TRIGGER_LOGON, &trigger);
	if (FAILED(hr)) {
		printf("Cannot create the trigger: %x\n", hr);
		return hr;
	}

	ComPtr<ILogonTrigger> logonTrigger;
	hr = trigger->QueryInterface(IID_ILogonTrigger, (void**)& logonTrigger);
	if (FAILED(hr)) {
		printf("QueryInterface call failed for ILogonTrigger: %x\n", hr);
		return hr;
	}

	hr = logonTrigger->put_Id(_bstr_t(L"FramelessGameModeLogonTrigger"));
	if (FAILED(hr)) {
		printf("\nCannot put the trigger ID: %x\n", hr);
	}

	//  ------------------------------------------------------
	//  Add an Action to the task. This task will execute notepad.exe.     
	ComPtr<IActionCollection> actionCollection;

	//  Get the task action collection pointer.
	hr = task->get_Actions(&actionCollection);
	if (FAILED(hr)) {
		printf("Cannot get Task collection pointer: %x\n", hr);
		return hr;
	}

	//  Create the action, specifying that it is an executable action.
	ComPtr<IAction> action;
	hr = actionCollection->Create(TASK_ACTION_EXEC, &action);
	if (FAILED(hr)) {
		printf("Cannot create the action: %x\n", hr);
		return hr;
	}

	ComPtr<IExecAction> execAction;
	//  QI for the executable task pointer.
	hr = action->QueryInterface(IID_IExecAction, (void**)& execAction);
	if (FAILED(hr)) {
		printf("QueryInterface call failed for IExecAction: %x\n", hr);
		return hr;
	}

	//  Set the path of the executable app.
	hr = execAction->put_Path(_bstr_t(appPath));
	if (FAILED(hr)) {
		printf("Cannot set path of executable: %x\n", hr);
		return hr;
	}

	//  Set the arguments of the executable app.
	hr = execAction->put_Arguments(_bstr_t(appArgs));
	if (FAILED(hr)) {
		printf("Cannot set path of executable: %x\n", hr);
		return hr;
	}

	//  ------------------------------------------------------
	//  Save the task in the root folder.
	ComPtr<IRegisteredTask> registeredTask;
	hr = rootTaskFolder->RegisterTaskDefinition(
		_bstr_t(taskName),
		task,
		TASK_CREATE_OR_UPDATE,
		_variant_t(L"S-1-5-32-544"),
		_variant_t(),
		TASK_LOGON_GROUP,
		_variant_t(L""),
		&registeredTask);      //_variant_t(L"Builtin\\Administrators"),

	if (FAILED(hr)) {
		printf("Error saving the Task: %x\n", hr);
		return hr;
	}

	printf("\n Success! Task successfully registered. ");
	return S_OK;
}


bool GetLaunchAtLogon(const WCHAR* taskNameToFind) {
	CoInitializer initializer;
	HRESULT hr = initializer.GetResult();

	if (FAILED(hr)) {
		printf("\nCoInitializeEx failed: %x", hr);
		return false;
	}

	//  Set general COM security levels.
	hr = CoInitializeSecurity(
		NULL,
		-1,
		NULL,
		NULL,
		RPC_C_AUTHN_LEVEL_PKT_PRIVACY,
		RPC_C_IMP_LEVEL_IMPERSONATE,
		NULL,
		0,
		NULL);

	if (FAILED(hr)) {
		printf("\nCoInitializeSecurity failed: %x", hr);
		CoUninitialize();
		return false;
	}

	//  ------------------------------------------------------
	//  Create an instance of the Task Service. 
	ComPtr<ITaskService> pService;
	hr = CoCreateInstance(CLSID_TaskScheduler,
		NULL,
		CLSCTX_INPROC_SERVER,
		IID_ITaskService,
		(void**)& pService);
	if (FAILED(hr)) {
		printf("Failed to CoCreate an instance of the TaskService class: %x", hr);
		return false;
	}

	//  Connect to the task service.
	hr = pService->Connect(_variant_t(), _variant_t(), _variant_t(), _variant_t());
	if (FAILED(hr)) {
		printf("ITaskService::Connect failed: %x", hr);
		return false;
	}

	//  ------------------------------------------------------
	//  Get the pointer to the root task folder.
	ComPtr<ITaskFolder> pRootFolder;
	hr = pService->GetFolder(_bstr_t(L"\\"), &pRootFolder);
	if (FAILED(hr)) {
		printf("Cannot get Root Folder pointer: %x", hr);
		return false;
	}

	//  -------------------------------------------------------
	//  Get the registered tasks in the folder.	
	ComPtr<IRegisteredTaskCollection> pTaskCollection;
	hr = pRootFolder->GetTasks(NULL, &pTaskCollection);
	if (FAILED(hr)) {
		printf("Cannot get the registered tasks.: %x", hr);
		return false;
	}

	LONG numTasks = 0;
	hr = pTaskCollection->get_Count(&numTasks);

	if (numTasks == 0) {
		printf("\nNo Tasks are currently running");
		return false;
	}

	printf("\nNumber of Tasks : %d", numTasks);

	TASK_STATE taskState;

	for (LONG i = 0; i < numTasks; i++) {
		ComPtr<IRegisteredTask> pRegisteredTask;
		hr = pTaskCollection->get_Item(_variant_t(i + 1), &pRegisteredTask);

		if (SUCCEEDED(hr)) {
			bstr_t taskName;
			hr = pRegisteredTask->get_Name(taskName.GetAddress());
			if (SUCCEEDED(hr)) {
				if (lstrcmp(taskName, taskNameToFind) == 0) {
					printf("Task Name: %S\n", taskName.GetBSTR());
					hr = pRegisteredTask->get_State(&taskState);
					if (SUCCEEDED(hr)) {
						return true;
					}
				}
			}
			else {
				printf("Cannot get the registered task name: %x\n", hr);
			}
		}
		else {
			printf("Cannot get the registered task item at index=%d: %x\n", i + 1, hr);
		}
	}

	return false;
}



Napi::Value LAL::set(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  	if (info.Length() < 4) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}	

  
	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto launchAtLogon = info[0].As<Napi::Boolean>();

	auto utf8TaskName = info[1].As<Napi::String>();
	auto taskName = converter.from_bytes(utf8TaskName);

	auto utf8AppPath = info[2].As<Napi::String>();
	auto appPath = converter.from_bytes(utf8TaskName);

	auto utf8AppArgs = info[3].As<Napi::String>();
	auto appArgs = converter.from_bytes(utf8TaskName);

  SetLaunchAtLogon(launchAtLogon, taskName.c_str(), appPath.c_str(), appArgs.c_str());

  return env.Undefined();	
}


Napi::Value LAL::get(const Napi::CallbackInfo &info) {
	Napi::Env env = info.Env();
	if (info.Length() < 1) {
		Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
	auto utf8TaskName = info[0].As<Napi::String>();
	auto taskName = converter.from_bytes(utf8TaskName);

  return Napi::Boolean::New(env, GetLaunchAtLogon(taskName.c_str()));
}


Napi::Object LAL::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("set", Napi::Function::New(env, LAL::set));
  exports.Set("get", Napi::Function::New(env, LAL::get));
  return exports;
}