package com.marianocarreira.tokenriot;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
    private void enterImmersiveMode() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());
    }
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TokenRiotStorePlugin.class);
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        View root = getWindow().getDecorView();
        root.post(this::enterImmersiveMode);
        ViewCompat.setOnApplyWindowInsetsListener(root, (view, insets) -> {
            // Re-hide system chrome when the terminal keyboard closes.
            if (!insets.isVisible(WindowInsetsCompat.Type.ime()) &&
                (insets.isVisible(WindowInsetsCompat.Type.statusBars()) || insets.isVisible(WindowInsetsCompat.Type.navigationBars()))) {
                view.post(this::enterImmersiveMode);
            }
            return insets;
        });
    }
    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) getWindow().getDecorView().post(this::enterImmersiveMode);
    }
    @Override public void onResume() {
        super.onResume();
        getWindow().getDecorView().post(this::enterImmersiveMode);
    }
}
