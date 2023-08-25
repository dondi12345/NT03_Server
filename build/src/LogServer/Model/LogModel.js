"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModel = exports.LogType = exports.PlatformCode = void 0;
var PlatformCode;
(function (PlatformCode) {
    PlatformCode[PlatformCode["GameCoreScarlett"] = -1] = "GameCoreScarlett";
    //
    // Summary:
    //     In the Unity editor on macOS.
    PlatformCode[PlatformCode["OSXEditor"] = 0] = "OSXEditor";
    //
    // Summary:
    //     In the player on macOS.
    PlatformCode[PlatformCode["OSXPlayer"] = 1] = "OSXPlayer";
    //
    // Summary:
    //     In the player on Windows.
    PlatformCode[PlatformCode["WindowsPlayer"] = 2] = "WindowsPlayer";
    //
    // Summary:
    //     In the web player on macOS.
    PlatformCode[PlatformCode["OSXWebPlayer"] = 3] = "OSXWebPlayer";
    //
    // Summary:
    //     In the Dashboard widget on macOS.
    PlatformCode[PlatformCode["OSXDashboardPlayer"] = 4] = "OSXDashboardPlayer";
    //
    // Summary:
    //     In the web player on Windows.
    PlatformCode[PlatformCode["WindowsWebPlayer"] = 5] = "WindowsWebPlayer";
    //
    // Summary:
    //     In the Unity editor on Windows.
    PlatformCode[PlatformCode["WindowsEditor"] = 7] = "WindowsEditor";
    //
    // Summary:
    //     In the player on the iPhone.
    PlatformCode[PlatformCode["IPhonePlayer"] = 8] = "IPhonePlayer";
    PlatformCode[PlatformCode["PS3"] = 9] = "PS3";
    PlatformCode[PlatformCode["XBOX360"] = 10] = "XBOX360";
    //
    // Summary:
    //     In the player on Android devices.
    PlatformCode[PlatformCode["Android"] = 11] = "Android";
    PlatformCode[PlatformCode["NaCl"] = 12] = "NaCl";
    //
    // Summary:
    //     In the player on Linux.
    PlatformCode[PlatformCode["LinuxPlayer"] = 13] = "LinuxPlayer";
    PlatformCode[PlatformCode["FlashPlayer"] = 15] = "FlashPlayer";
    //
    // Summary:
    //     In the Unity editor on Linux.
    PlatformCode[PlatformCode["LinuxEditor"] = 16] = "LinuxEditor";
    //
    // Summary:
    //     In the player on WebGL
    PlatformCode[PlatformCode["WebGLPlayer"] = 17] = "WebGLPlayer";
    PlatformCode[PlatformCode["MetroPlayerX86"] = 18] = "MetroPlayerX86";
    //
    // Summary:
    //     In the player on Windows Store Apps when CPU architecture is X86.
    PlatformCode[PlatformCode["WSAPlayerX86"] = 18] = "WSAPlayerX86";
    PlatformCode[PlatformCode["MetroPlayerX64"] = 19] = "MetroPlayerX64";
    //
    // Summary:
    //     In the player on Windows Store Apps when CPU architecture is X64.
    PlatformCode[PlatformCode["WSAPlayerX64"] = 19] = "WSAPlayerX64";
    PlatformCode[PlatformCode["MetroPlayerARM"] = 20] = "MetroPlayerARM";
    //
    // Summary:
    //     In the player on Windows Store Apps when CPU architecture is ARM.
    PlatformCode[PlatformCode["WSAPlayerARM"] = 20] = "WSAPlayerARM";
    PlatformCode[PlatformCode["WP8Player"] = 21] = "WP8Player";
    PlatformCode[PlatformCode["BB10Player"] = 22] = "BB10Player";
    PlatformCode[PlatformCode["BlackBerryPlayer"] = 22] = "BlackBerryPlayer";
    PlatformCode[PlatformCode["TizenPlayer"] = 23] = "TizenPlayer";
    PlatformCode[PlatformCode["PSP2"] = 24] = "PSP2";
    //
    // Summary:
    //     In the player on the Playstation 4.
    PlatformCode[PlatformCode["PS4"] = 25] = "PS4";
    PlatformCode[PlatformCode["PSM"] = 26] = "PSM";
    //
    // Summary:
    //     In the player on Xbox One.
    PlatformCode[PlatformCode["XboxOne"] = 27] = "XboxOne";
    PlatformCode[PlatformCode["SamsungTVPlayer"] = 28] = "SamsungTVPlayer";
    PlatformCode[PlatformCode["WiiU"] = 30] = "WiiU";
    //
    // Summary:
    //     In the player on the Apple's tvOS.
    PlatformCode[PlatformCode["tvOS"] = 31] = "tvOS";
    //
    // Summary:
    //     In the player on Nintendo Switch.
    PlatformCode[PlatformCode["Switch"] = 32] = "Switch";
    PlatformCode[PlatformCode["Lumin"] = 33] = "Lumin";
    //
    // Summary:
    //     In the player on Stadia.
    PlatformCode[PlatformCode["Stadia"] = 34] = "Stadia";
    //
    // Summary:
    //     In the player on CloudRendering.
    PlatformCode[PlatformCode["CloudRendering"] = 35] = "CloudRendering";
    PlatformCode[PlatformCode["GameCoreXboxSeries"] = 36] = "GameCoreXboxSeries";
    PlatformCode[PlatformCode["GameCoreXboxOne"] = 37] = "GameCoreXboxOne";
    //
    // Summary:
    //     In the player on the Playstation 5.
    PlatformCode[PlatformCode["PS5"] = 38] = "PS5";
    PlatformCode[PlatformCode["EmbeddedLinuxArm64"] = 39] = "EmbeddedLinuxArm64";
    PlatformCode[PlatformCode["EmbeddedLinuxArm32"] = 40] = "EmbeddedLinuxArm32";
    PlatformCode[PlatformCode["EmbeddedLinuxX64"] = 41] = "EmbeddedLinuxX64";
    PlatformCode[PlatformCode["EmbeddedLinuxX86"] = 42] = "EmbeddedLinuxX86";
    //
    // Summary:
    //     In the server on Linux.
    PlatformCode[PlatformCode["LinuxServer"] = 43] = "LinuxServer";
    //
    // Summary:
    //     In the server on Windows.
    PlatformCode[PlatformCode["WindowsServer"] = 44] = "WindowsServer";
    //
    // Summary:
    //     In the server on macOS.
    PlatformCode[PlatformCode["OSXServer"] = 45] = "OSXServer";
})(PlatformCode = exports.PlatformCode || (exports.PlatformCode = {}));
var LogType;
(function (LogType) {
    LogType[LogType["Unknow"] = 0] = "Unknow";
    LogType[LogType["Normal"] = 1] = "Normal";
    LogType[LogType["Warning"] = 2] = "Warning";
    LogType[LogType["Error"] = 3] = "Error";
})(LogType = exports.LogType || (exports.LogType = {}));
class LogModel {
}
exports.LogModel = LogModel;
