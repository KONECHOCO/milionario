import { readFile, writeFile } from 'node:fs/promises'

const path = 'node_modules/capacitor-unity-ads/ios/Sources/UnityadsPlugin/Unityads.swift'
let source = await readFile(path, 'utf8')
source = source.replace('private var rewardedVideoLoaded = false', 'var rewardedVideoLoaded = false')
source = source.replace('private var interstitialLoaded = false', 'var interstitialLoaded = false')
source = source.replace('private var isInitialized = false', 'var isInitialized = false')
source = source.replaceAll('if state == .completed {', 'if state == .showCompletionStateCompleted {')
source = source.replace('} errorHandler: { [weak self] error in', '} errorHandler: { [weak self] (error: Error) in')
source = source.replace('UnityAds.initialize(gameId, testMode: testMode) { [weak self] in\n            print("[UnityAds] Initialized successfully")\n            self?.isInitialized = true\n            callback(true, nil)\n        } errorHandler: { [weak self] (error: Error) in\n            print("[UnityAds] Initialization failed: \\(error.localizedDescription)")\n            callback(false, error.localizedDescription)\n        }', 'UnityAds.initialize(gameId, testMode: testMode, initializationDelegate: InitializationDelegate(callback: callback, parent: self))')
source = source.replace('UnityAds.show(UIApplication.shared.windows.first?.rootViewController, placementId: placementId, showDelegate: RewardedVideoShowDelegate(callback: callback, parent: self))', 'guard let viewController = UIApplication.shared.windows.first?.rootViewController else { callback(false, nil, "No root view controller") ; return }\n        UnityAds.show(viewController, placementId: placementId, showDelegate: RewardedVideoShowDelegate(callback: callback, parent: self))')
source = source.replace('UnityAds.show(UIApplication.shared.windows.first?.rootViewController, placementId: placementId, showDelegate: InterstitialShowDelegate(callback: callback, parent: self))', 'guard let viewController = UIApplication.shared.windows.first?.rootViewController else { callback(false, "No root view controller") ; return }\n        UnityAds.show(viewController, placementId: placementId, showDelegate: InterstitialShowDelegate(callback: callback, parent: self))')
source = source.replace('return UnityAds.getVersion() ?? "unknown"', 'return UnityAds.getVersion()')
source = source.replace('// MARK: - Load Delegates', '// MARK: - Initialization Delegate\n\nclass InitializationDelegate: NSObject, UnityAdsInitializationDelegate {\n    private let callback: Unityads.InitializationCallback\n    private weak var parent: Unityads?\n\n    init(callback: @escaping Unityads.InitializationCallback, parent: Unityads) {\n        self.callback = callback\n        self.parent = parent\n    }\n\n    func initializationComplete() {\n        print("[UnityAds] Initialized successfully")\n        parent?.isInitialized = true\n        callback(true, nil)\n    }\n\n    func initializationFailed(_ error: UnityAdsInitializationError, withMessage message: String) {\n        print("[UnityAds] Initialization failed: \\(message)")\n        callback(false, message)\n    }\n}\n\n// MARK: - Load Delegates')
source = source.replaceAll('func unityAdsShowComplete(_ placementId: String, withFinishState state:', 'func unityAdsShowComplete(_ placementId: String, withFinish state:')
source = source.replaceAll('func unityAdsAdFailedToLoad(_ placementId: String, withError error:', 'func unityAdsAdFailed(toLoad placementId: String, withError error:')
// The Unity SDK does not retain its delegates: keep them alive in the plugin, otherwise
// initialize/load/show callbacks can be lost and the JS promises never settle.
source = source.replace('var rewardedVideoLoaded = false', 'var rewardedVideoLoaded = false\n    var retainedDelegates: [String: NSObject] = [:]\n\n    static func topViewController() -> UIViewController? {\n        let keyWindow = UIApplication.shared.windows.first { $0.isKeyWindow } ?? UIApplication.shared.windows.first\n        var top = keyWindow?.rootViewController\n        while let presented = top?.presentedViewController { top = presented }\n        return top\n    }')
source = source.replace('UnityAds.initialize(gameId, testMode: testMode, initializationDelegate: InitializationDelegate(callback: callback, parent: self))', 'let delegate = InitializationDelegate(callback: callback, parent: self)\n        retainedDelegates["init"] = delegate\n        UnityAds.initialize(gameId, testMode: testMode, initializationDelegate: delegate)')
source = source.replace('UnityAds.load(placementId, loadDelegate: RewardedVideoLoadDelegate(callback: callback, parent: self))', 'let delegate = RewardedVideoLoadDelegate(callback: callback, parent: self)\n        retainedDelegates["rewardedLoad"] = delegate\n        UnityAds.load(placementId, loadDelegate: delegate)')
source = source.replace('UnityAds.load(placementId, loadDelegate: InterstitialLoadDelegate(callback: callback, parent: self))', 'let delegate = InterstitialLoadDelegate(callback: callback, parent: self)\n        retainedDelegates["interstitialLoad"] = delegate\n        UnityAds.load(placementId, loadDelegate: delegate)')
source = source.replace('UnityAds.show(viewController, placementId: placementId, showDelegate: RewardedVideoShowDelegate(callback: callback, parent: self))', 'let delegate = RewardedVideoShowDelegate(callback: callback, parent: self)\n        retainedDelegates["rewardedShow"] = delegate\n        UnityAds.show(viewController, placementId: placementId, showDelegate: delegate)')
source = source.replace('UnityAds.show(viewController, placementId: placementId, showDelegate: InterstitialShowDelegate(callback: callback, parent: self))', 'let delegate = InterstitialShowDelegate(callback: callback, parent: self)\n        retainedDelegates["interstitialShow"] = delegate\n        UnityAds.show(viewController, placementId: placementId, showDelegate: delegate)')
source = source.replaceAll('guard let viewController = UIApplication.shared.windows.first?.rootViewController else {', 'guard let viewController = Unityads.topViewController() else {')
// Unity calls delegates on a background thread; UI presentation must happen on main.
source = source.replace('    func showRewardedVideo(callback: @escaping RewardedVideoCallback) {\n', '    func showRewardedVideo(callback: @escaping RewardedVideoCallback) {\n        if !Thread.isMainThread { DispatchQueue.main.async { self.showRewardedVideo(callback: callback) }; return }\n')
source = source.replace('    func showInterstitial(callback: @escaping InterstitialCallback) {\n', '    func showInterstitial(callback: @escaping InterstitialCallback) {\n        if !Thread.isMainThread { DispatchQueue.main.async { self.showInterstitial(callback: callback) }; return }\n')
if (!source.includes('retainedDelegates["rewardedShow"]')) throw new Error('Unity Ads patch did not apply: plugin source changed')
await writeFile(path, source)
console.log('Patched capacitor-unity-ads for current Swift SDK naming and access control.')

// App Tracking Transparency: ask from the main thread (Capacitor runs plugin methods on a
// background queue), which is where iOS reliably presents the system prompt.
const attPath = 'node_modules/capacitor-plugin-app-tracking-transparency/ios/Sources/AppTrackingTransparencyPlugin/AppTrackingTransparencyPlugin.swift'
let att = await readFile(attPath, 'utf8')
if (!att.includes('DispatchQueue.main.async { [weak self] in self?.requestPermission(call) }')) {
  att = att.replace(
    '    @objc func requestPermission(_ call: CAPPluginCall) {\n',
    '    @objc func requestPermission(_ call: CAPPluginCall) {\n        if !Thread.isMainThread { DispatchQueue.main.async { [weak self] in self?.requestPermission(call) }; return }\n',
  )
  if (!att.includes('Thread.isMainThread')) throw new Error('ATT patch did not apply: plugin source changed')
  await writeFile(attPath, att)
  console.log('Patched App Tracking Transparency plugin to request on the main thread.')
}

// The plugin pins Unity Ads SDK 4.9.x (early 2024): bidding ad units (BP_*) need a current SDK.
const podspecPath = 'node_modules/capacitor-unity-ads/CapacitorUnityAds.podspec'
let podspec = await readFile(podspecPath, 'utf8')
podspec = podspec.replace("s.dependency 'UnityAds', '~> 4.9.2'", "s.dependency 'UnityAds', '~> 4.19'")
if (!podspec.includes("'~> 4.19'")) throw new Error('Unity Ads podspec patch did not apply')
await writeFile(podspecPath, podspec)
console.log('Bumped Unity Ads iOS SDK to 4.19.x.')
