@echo off
echo ===================================
echo      八字分析系统启动脚本
echo ===================================
echo.

:: 设置错误处理
setlocal enabledelayedexpansion

:: 设置路径
set SYSTEM_DIR=%~dp0
set FRONTEND_DIR=%SYSTEM_DIR%frontend
set BACKEND_DIR=%SYSTEM_DIR%backend

:: 检查lunar-javascript库是否存在
if not exist "%FRONTEND_DIR%\lunar-javascript\lunar.js" (
    echo [警告] 前端lunar-javascript库不存在，尝试复制备用版本...
    if exist "%SYSTEM_DIR%\lunar-javascript\lunar.js" (
        mkdir "%FRONTEND_DIR%\lunar-javascript" 2>nul
        copy "%SYSTEM_DIR%\lunar-javascript\lunar.js" "%FRONTEND_DIR%\lunar-javascript\" >nul
        echo [成功] 已复制lunar-javascript库到前端目录
    ) else (
        echo [错误] 找不到lunar-javascript库，系统可能无法正常工作
        echo        请确保lunar-javascript库已正确安装
    )
)

:: 检查Python环境
echo [信息] 检查Python环境...
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未安装Python或Python未加入PATH环境变量
    echo        请安装Python 3.8或更高版本，并将其添加到PATH环境变量
    echo        系统将以降级模式启动（仅前端，部分功能可能不可用）
    goto start_frontend_only
)

:: 安装后端依赖
echo [信息] 检查并安装后端依赖...
cd "%BACKEND_DIR%"
pip install -r requirements.txt -q
if %errorlevel% neq 0 (
    echo [警告] 安装依赖失败，尝试启动备用模式...
    goto start_frontend_only
)

:: 启动后端服务
echo [信息] 启动后端服务...
start /B cmd /c "cd %BACKEND_DIR% && python server.py > backend_log.txt 2>&1"
if %errorlevel% neq 0 (
    echo [警告] 启动后端服务失败，尝试启动备用模式...
    goto start_frontend_only
)

:: 等待后端服务启动
echo [信息] 等待后端服务启动...
ping 127.0.0.1 -n 3 > nul

:: 启动前端服务并打开浏览器
:start_frontend
echo [信息] 启动前端服务并打开浏览器...
cd "%SYSTEM_DIR%"
start http://localhost:8080/frontend/用户信息表单.html
start /B cmd /c "cd %SYSTEM_DIR% && python -m http.server 8080 > frontend_log.txt 2>&1"

goto end

:start_frontend_only
echo [信息] 以降级模式启动（仅前端，部分功能可能不可用）...
cd "%SYSTEM_DIR%"
start http://localhost:8080/frontend/用户信息表单.html
start /B cmd /c "cd %SYSTEM_DIR% && python -m http.server 8080 > frontend_log.txt 2>&1"

:end
echo.
echo [成功] 八字分析系统已启动！
echo        如需关闭系统，请关闭此窗口或按Ctrl+C
echo.
echo ===================================
echo      系统日志信息
echo ===================================
echo 请保持此窗口开启状态，您将在此处看到系统的运行日志
echo.
echo 按任意键查看日志，或关闭此窗口以退出系统...

pause > nul

:: 显示日志
echo.
echo ===================================
echo      前端日志:
echo ===================================
if exist "%SYSTEM_DIR%\frontend_log.txt" (
    type "%SYSTEM_DIR%\frontend_log.txt"
) else (
    echo 无法找到前端日志文件
)

echo.
echo ===================================
echo      后端日志:
echo ===================================
if exist "%BACKEND_DIR%\backend_log.txt" (
    type "%BACKEND_DIR%\backend_log.txt"
) else (
    echo 无法找到后端日志文件
)

echo.
echo 按任意键退出...
pause > nul 