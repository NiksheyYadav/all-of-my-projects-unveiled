@echo off
REM Cleanup Script - Remove Downloaded Models

echo Removing Hugging Face model cache...

set cache_path=%USERPROFILE%\.cache\huggingface

if exist "%cache_path%" (
    echo Found cache, removing...
    rmdir /s /q "%cache_path%"
    echo Done! Removed Hugging Face cache
) else (
    echo No cache found at %cache_path%
)

REM Remove offload folder
if exist ".\offload" (
    rmdir /s /q ".\offload"
    echo Removed offload folder
)

echo.
echo Cleanup complete! ~15-20GB freed.
pause
