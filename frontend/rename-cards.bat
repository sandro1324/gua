@echo off
setlocal enabledelayedexpansion

:: 设置基础路径
set "BASE_PATH=assets\tarot\cards"

:: 大阿卡纳牌重命名
echo 开始重命名大阿卡纳牌...
for /l %%i in (0,1,21) do (
    set "NUM=00%%i"
    set "NUM=!NUM:~-2!"
    for %%f in ("%BASE_PATH%\major\%%i-*.jpg") do (
        set "OLD_NAME=%%~nxf"
        set "NEW_NAME=!NUM!-The %%i.jpg"
        ren "%%f" "!NEW_NAME!"
    )
)

:: 权杖牌重命名
echo 开始重命名权杖牌...
for /l %%i in (1,1,14) do (
    set "NUM=00%%i"
    set "NUM=!NUM:~-2!"
    for %%f in ("%BASE_PATH%\wands\%%i-*.jpg") do (
        set "OLD_NAME=%%~nxf"
        set "NEW_NAME=!NUM!-%%i of Wands.jpg"
        ren "%%f" "!NEW_NAME!"
    )
)

:: 圣杯牌重命名
echo 开始重命名圣杯牌...
for /l %%i in (1,1,14) do (
    set "NUM=00%%i"
    set "NUM=!NUM:~-2!"
    for %%f in ("%BASE_PATH%\cups\%%i-*.jpg") do (
        set "OLD_NAME=%%~nxf"
        set "NEW_NAME=!NUM!-%%i of Cups.jpg"
        ren "%%f" "!NEW_NAME!"
    )
)

:: 宝剑牌重命名
echo 开始重命名宝剑牌...
for /l %%i in (1,1,14) do (
    set "NUM=00%%i"
    set "NUM=!NUM:~-2!"
    for %%f in ("%BASE_PATH%\swords\%%i-*.jpg") do (
        set "OLD_NAME=%%~nxf"
        set "NEW_NAME=!NUM!-%%i of Swords.jpg"
        ren "%%f" "!NEW_NAME!"
    )
)

:: 星币牌重命名
echo 开始重命名星币牌...
for /l %%i in (1,1,14) do (
    set "NUM=00%%i"
    set "NUM=!NUM:~-2!"
    for %%f in ("%BASE_PATH%\pentacles\%%i-*.jpg") do (
        set "OLD_NAME=%%~nxf"
        set "NEW_NAME=!NUM!-%%i of Pentacles.jpg"
        ren "%%f" "!NEW_NAME!"
    )
)

echo 重命名完成！
pause 