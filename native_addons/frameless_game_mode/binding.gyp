{
    "targets": [{
        "target_name": "fgm",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "src/main.cpp",
            "src/FramelessGameMode.cpp",
            "src/FGMWorker.cpp",
            "src/lib/ThreadSafeFunction.cpp",
            "src/lib/AsyncPromiseWorker.cpp"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
        'conditions': [
            ['OS=="win"', {
                'defines': [
                    'UNICODE'
                ]
            }]
        ]
    }]
}