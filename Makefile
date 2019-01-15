apply-patches: npm-install
	patch -p0 < nodeify_temporary_patch.patch

npm-install:
	rm -rf node_modules/nativescript-nodeify
	npm i

release-android: apply-patches
	if [ ! "$$PERSONHOOD_ANDROID_PASS" ]; then echo "Please set PERSONHOOD_ANDROID_PASS"; exit 1; fi
	tns build android --key-store-path dedis-development.jks --key-store-password $$PERSONHOOD_ANDROID_PASS \
	    --key-store-alias personhood --key-store-alias-password $$PERSONHOOD_ANDROID_PASS --release
	echo "Build successful - apk is at platforms/android/app/build/outputs/apk/release/app-release.ap"

release-key:
	if [ -e dedis-development.jks ]; then echo "Please remove dedis-development.jks first"; exit 1; fi
	keytool -genkey -v -storetype pkcs12 -keystore dedis-development.jks -keyalg RSA -keysize 4096 -validity 10000 -alias personhood

ios: apply-patches
	tns prepare ios

xcode: ios
	open platforms/ios/personhoodonline.xcworkspace/
