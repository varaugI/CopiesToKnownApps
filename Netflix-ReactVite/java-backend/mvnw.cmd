@echo off
@REM StreamFlix Maven Wrapper Script
setlocal

if defined JAVA_HOME goto findMaven
if exist "C:\Program Files\Android\Android Studio\jbr" set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"

:findMaven
if exist "%USERPROFILE%\.maven\apache-maven-3.9.6\bin\mvn.cmd" (
    "%USERPROFILE%\.maven\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    mvn %*
)
