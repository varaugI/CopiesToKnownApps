@echo off
@REM YouTube Maven Wrapper Script
setlocal

if defined JAVA_HOME goto findMaven
if exist "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot" set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"

:findMaven
if exist "%USERPROFILE%\.maven\apache-maven-3.9.6\bin\mvn.cmd" (
    "%USERPROFILE%\.maven\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    mvn %*
)
