@echo off
echo Starting Book Publication Workflow Tests
echo =======================================

:: Set Python executable (adjust path if needed)
set PYTHON=python

:: Run environment test
echo.
echo [1/2] Testing Python environment...
%PYTHON% test_env.py > test_output.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Environment test failed. Check test_output.txt for details.
    exit /b %ERRORLEVEL%
)
echo ✅ Environment test passed.

:: Run workflow test
echo.
echo [2/2] Running workflow test...
%PYTHON% test_workflow.py >> test_output.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Workflow test failed. Check test_output.txt for details.
    exit /b %ERRORLEVEL%
)

echo.
echo =======================================
echo ✅ All tests completed successfully!
echo =======================================

type test_output.txt

:: Keep the window open
pause
