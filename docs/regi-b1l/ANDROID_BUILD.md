# Android Build

The directory `mobile/regi-b1l` contains a Capacitor 7 wrapper prepared for Android. Its current configuration loads the secure production PWA URL, so an internet connection is required for the first load; the PWA service worker then supplies the previously cached shell.

## Prepare

```bash
cd mobile/regi-b1l
npm install
npm run android:add
npm run android:sync
npm run android:open
```

Build and sign from Android Studio using a private release keystore. Do not commit keystores, passwords or Play service account credentials.

## Before Play publication

1. Replace remote-server loading with a pinned, tested web bundle if strict offline startup is required.
2. Generate adaptive launcher and notification icons in Android Studio.
3. Test back navigation, deep links, camera/photo permissions, offline restart and data export on physical devices.
4. Complete the privacy policy, Data Safety form, content rating and account deletion flow.
5. Use internal and closed testing tracks before production.

The repository is prepared for the native build; it does not claim that an APK/AAB has been signed or published.
