; C:\LIVEKIT_PROJECT\CLIENT_SIDE\build_tools\installer.nsi

!include "MUI2.nsh"
!include "FileFunc.nsh"

; General Configuration
Name "LIVEKIT Professional"
OutFile "LIVEKIT-Setup.exe"
InstallDir "$PROGRAMFILES64\LIVEKIT Professional"
InstallDirRegKey HKLM "Software\LIVEKIT" "Install_Dir"
RequestExecutionLevel admin

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "LIVEKIT Professional"
VIAddVersionKey "CompanyName" "LIVEKIT Corporation"
VIAddVersionKey "LegalCopyright" "Copyright © 2024"
VIAddVersionKey "FileDescription" "LIVEKIT Professional Installer"
VIAddVersionKey "FileVersion" "1.0.0"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "..\..\assets\icon.ico"
!define MUI_UNICON "..\..\assets\icon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "..\..\assets\installer_banner.bmp"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\license.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; Component Selection
Section "LIVEKIT Core (Required)" SEC_CORE
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  ; Copy main application files
  File /r "..\..\dist\win-unpacked\*.*"
  
  ; Write registry keys
  WriteRegStr HKLM "SOFTWARE\LIVEKIT" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LIVEKIT" "DisplayName" "LIVEKIT Professional"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LIVEKIT" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LIVEKIT" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LIVEKIT" "NoRepair" 1
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Desktop Shortcut" SEC_DESKTOP
  CreateShortcut "$DESKTOP\LIVEKIT Professional.lnk" "$INSTDIR\LIVEKIT Professional.exe" "" "$INSTDIR\LIVEKIT Professional.exe" 0
SectionEnd

Section "Start Menu Shortcuts" SEC_STARTMENU
  CreateDirectory "$SMPROGRAMS\LIVEKIT Professional"
  CreateShortcut "$SMPROGRAMS\LIVEKIT Professional\LIVEKIT Professional.lnk" "$INSTDIR\LIVEKIT Professional.exe" "" "$INSTDIR\LIVEKIT Professional.exe" 0
  CreateShortcut "$SMPROGRAMS\LIVEKIT Professional\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
SectionEnd

; Package-specific sections
Section /o "Basic Package (3 Accounts)" SEC_BASIC
  SetOutPath "$INSTDIR\packages\BASIC"
  File /r "..\..\packages\BASIC\*.*"
SectionEnd

Section /o "Pro Package (5 Accounts)" SEC_PRO
  SetOutPath "$INSTDIR\packages\PRO"
  File /r "..\..\packages\PRO\*.*"
SectionEnd

Section /o "Business Package (10 Accounts)" SEC_BUSINESS
  SetOutPath "$INSTDIR\packages\BUSINESS"
  File /r "..\..\packages\BUSINESS\*.*"
SectionEnd

; Descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC_CORE} "Core LIVEKIT application files (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC_DESKTOP} "Create a desktop shortcut"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC_STARTMENU} "Create Start Menu shortcuts"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC_BASIC} "Basic package with 3 streaming accounts"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC_PRO} "Pro package with 5 streaming accounts"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC_BUSINESS} "Business package with 10 streaming accounts"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller
Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LIVEKIT"
  DeleteRegKey HKLM "SOFTWARE\LIVEKIT"
  
  ; Remove files and directories
  Delete "$INSTDIR\*.*"
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\LIVEKIT Professional.lnk"
  Delete "$SMPROGRAMS\LIVEKIT Professional\*.*"
  RMDir "$SMPROGRAMS\LIVEKIT Professional"
SectionEnd

; Functions
Function .onInit
  ; Check for admin rights
  UserInfo::GetAccountType
  Pop $0
  ${If} $0 != "admin"
    MessageBox MB_ICONSTOP "Administrator rights required!"
    SetErrorLevel 740 ; ERROR_ELEVATION_REQUIRED
    Quit
  ${EndIf}
  
  ; Check for previous installation
  ReadRegStr $0 HKLM "SOFTWARE\LIVEKIT" "Install_Dir"
  ${If} $0 != ""
    MessageBox MB_YESNO|MB_ICONQUESTION "LIVEKIT is already installed. Uninstall the existing version?" IDYES uninst
    Abort
    uninst:
      ExecWait '"$0\uninstall.exe" /S'
  ${EndIf}
FunctionEnd
