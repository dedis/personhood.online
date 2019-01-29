apply-patches: npm-install
	patch -p0 < nodeify_temporary_patch.patch

npm-install:
	rm -rf node_modules/nativescript-nodeify
	npm i

android-dev: apply-patches
	tns prepare android

android-release: apply-patches
	@if [ ! "$$PERSONHOOD_ANDROID_PASS" ]; then echo "Please set PERSONHOOD_ANDROID_PASS"; exit 1; fi
	@if ! grep -q "Testing: false" app/lib/Defaults.ts; then echo "\nPUT TESTING TO FALSE IN Defaults.ts !!\n"; exit 1; fi
	@tns build android --key-store-path dedis-development.jks --key-store-password $$PERSONHOOD_ANDROID_PASS \
	    --key-store-alias personhood --key-store-alias-password $$PERSONHOOD_ANDROID_PASS --release
	@echo "Build successful - apk is at platforms/android/app/build/outputs/apk/release/app-release.ap"

release-key:
	if [ -e dedis-development.jks ]; then echo "Please remove dedis-development.jks first"; exit 1; fi
	keytool -genkey -v -storetype pkcs12 -keystore dedis-development.jks -keyalg RSA -keysize 4096 -validity 10000 -alias personhood

ios-dev: apply-patches
	tns prepare ios

# To be able to use ios-release you need to first run a manual
# build once, which will use Xcode to download the signing profile.
ios-release: apply-patches
	tns prepare ios --release
	rm -rf platforms/ios/build
	xcodebuild -workspace platforms/ios/personhoodonline.xcworkspace -scheme personhoodonline -destination generic/platform=iOS archive -archivePath `pwd`/platforms/ios/build/personhood.xcarchive
	xcodebuild -exportArchive -archivePath `pwd`/platforms/ios/build/personhood.xcarchive -exportOptionsPlist app/App_Resources/iOS/ExportOptions.plist -exportPath `pwd`/platforms/ios/build
	ls -l `pwd`/platforms/ios/build/personhoodonline.ipa

xcode-dev: ios-dev
	open platforms/ios/personhoodonline.xcworkspace/

