export default {
  MainWindow: {
    headerName: '감시 목록'
  },
  SettingsDialog: {
    title: '설정',
    launchAtLogon: '윈도우 시작시 자동시작',
    closeToTray: '닫기를 하면 트레이로 보내기',
    WatchMode: {
      title: '감시 모드',
      allWindows: '모든 윈도우 감시',
      onlyForegroundWindow: '활성화된 윈도우만 감시'
    }
  },
  AddAppDialog: {
    SelectAppPage: {
      title: '프로그램 선택'
    },
    SetPositionPage: {
      title: '위치 지정'
    },
    SetSizePage: {
      title: '크기 지정',
      windowClientSize: '윈도우 클라이언트 크기 (프레임 영역 제외)',
      windowSize: '윈도우 크기 (프레임 영역 포함)',
      fullScreenSize: '전체 화면 크기',
      customSize: '사용자 지정',
      width: '너비:',
      height: '높이:'
    }
  },
  DialogButtons: {
    buttonYes: '예',
    buttonNo: '아니오',
    buttonCancel: '취소',
    buttonOK: '확인',
    buttonNext: '다음',
    buttonPrev: '이전'
  },
  AppList: {
    Item: {
      processName: '프로그램:',
      title: '제목:'
    }
  },
  StatusBar: {
    FGMState: {
      started: '시작됨',
      paused: '정지',
      stopped: '멈춤'
    }
  },
  ContextMenu: {
    FromFavoriteItem: {
      delete: '삭제',
      properties: '속성...'
    }
  },
  Messages: {
    DeleteAppMessageBox: {
      title: '삭제',
      message: '정말로 삭제 하시겠습니까?'
    }
  }
};
