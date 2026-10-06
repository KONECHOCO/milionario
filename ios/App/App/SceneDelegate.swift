import UIKit
import Capacitor
import AppTrackingTransparency

/// UIScene life cycle (required by recent iOS releases). The window and the Capacitor
/// bridge come from Main.storyboard, declared in Info.plist's scene manifest.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard scene is UIWindowScene else { return }
        if let url = connectionOptions.urlContexts.first?.url {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
        }
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        requestTrackingAuthorizationIfNeeded()
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }

    /// Shows the App Tracking Transparency prompt once the scene is in the foreground
    /// (iOS discards requests made before that). The web layer waits for the decision
    /// before initializing Unity Ads.
    private func requestTrackingAuthorizationIfNeeded() {
        guard #available(iOS 14, *), ATTrackingManager.trackingAuthorizationStatus == .notDetermined else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { [weak self] in
            guard self?.window?.windowScene?.activationState == .foregroundActive,
                  ATTrackingManager.trackingAuthorizationStatus == .notDetermined else { return }
            ATTrackingManager.requestTrackingAuthorization { _ in }
        }
    }
}
