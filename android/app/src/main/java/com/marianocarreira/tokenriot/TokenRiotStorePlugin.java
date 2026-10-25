package com.marianocarreira.tokenriot;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Private on-device SQLite storage; no network or external file permission. */
@CapacitorPlugin(name = "TokenRiotStore")
public class TokenRiotStorePlugin extends Plugin {
    private StoreHelper helper;
    @Override public void load() { helper = new StoreHelper(getContext()); }
    @PluginMethod public void get(PluginCall call) {
        String key = call.getString("key");
        if (key == null || key.length() > 150) { call.reject("Invalid storage key"); return; }
        try (Cursor rows = helper.getReadableDatabase().query("game_data", new String[]{"value"}, "key = ?", new String[]{key}, null, null, null)) {
            JSObject result = new JSObject();
            result.put("value", rows.moveToFirst() ? rows.getString(0) : org.json.JSONObject.NULL);
            call.resolve(result);
        } catch (Exception e) { call.reject("Could not read SQLite data", e); }
    }
    @PluginMethod public void set(PluginCall call) {
        String key = call.getString("key"), value = call.getString("value");
        if (key == null || key.length() > 150 || value == null || value.length() > 5000000) { call.reject("Invalid storage value"); return; }
        try {
            ContentValues row = new ContentValues(); row.put("key", key); row.put("value", value);
            if (helper.getWritableDatabase().insertWithOnConflict("game_data", null, row, SQLiteDatabase.CONFLICT_REPLACE) < 0) throw new IllegalStateException("SQLite write failed");
            call.resolve();
        } catch (Exception e) { call.reject("Could not save SQLite data", e); }
    }
    @Override protected void handleOnDestroy() { if (helper != null) helper.close(); }
    private static class StoreHelper extends SQLiteOpenHelper {
        StoreHelper(Context context) { super(context, "token-riot.db", null, 1); setWriteAheadLoggingEnabled(true); }
        @Override public void onCreate(SQLiteDatabase db) { db.execSQL("CREATE TABLE game_data (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)"); }
        @Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) { }
    }
}
