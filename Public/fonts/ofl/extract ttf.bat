@echo off
setlocal enabledelayedexpansion

:: Set the source directory (where /ofl is located)
set "SOURCE=E:\New folder (2)\Github Pull\Current WorkPlace\Current Git Pull\ELathala\Public\fonts\ofl"

:: Set the destination directory (where you want all .ttf files moved)
set "DEST=E:\New folder (2)\Github Pull\Current WorkPlace\Current Git Pull\ELathala\Public\fonts\all-ttf"

:: Create destination folder if it doesn't exist
if not exist "%DEST%" mkdir "%DEST%"

:: Loop through all .ttf files in subdirectories and move them
for /R "%SOURCE%" %%F in (*.ttf) do (
    echo Moving: %%F
    move "%%F" "%DEST%"
)

echo.
echo Done! All .ttf files moved to: %DEST%
pause
