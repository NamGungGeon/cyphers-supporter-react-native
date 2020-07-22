/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  View,
} from 'react-native';
import Splash from './component/Splash/Splash';
import {WebView} from 'react-native-webview';

const App: () => React$Node = () => {
  const BASE_URL = 'https://cpsp.kr/';
  const [webview, setWebview] = useState();
  const [goBackable, setGoBackable] = useState(false);
  useEffect(() => {
    console.log('goBackable is updated', goBackable);

    const onRequestClose = () => {
      Alert.alert('앱 종료', '사이퍼즈 서포터 Lite를 종료하시겠습니까?', [
        {
          text: '아니오',
          onPress: () => null,
        },
        {text: '예', onPress: () => BackHandler.exitApp()},
      ]);
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('goBackable', goBackable);
        if (goBackable) webview.goBack();
        else onRequestClose();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [goBackable]);
  useEffect(() => {
    if (webview && webview.clearCache) webview.clearCache();
  }, [webview]);
  return (
    <>
      <StatusBar backgroundColor={'#212229'} style={styles.appbar} />
      <SafeAreaView style={styles.safearea}>
        <WebView
          startInLoadingState={true}
          renderLoading={() => <Splash />}
          mixedContentMode={'compatibility'}
          originWhitelist={['https://*', 'http://*']}
          overScrollMode={'never'}
          injectedJavaScript={`
            (function() {
              function wrap(fn) {
                return function wrapper() {
                  var res = fn.apply(this, arguments);
                  window.ReactNativeWebView.postMessage(window.location.href);
                  return res;
                }
              }
              history.pushState = wrap(history.pushState);
              history.replaceState = wrap(history.replaceState);
              window.addEventListener('popstate', function() {
                window.ReactNativeWebView.postMessage(window.location.href);
              });
            })();
            true;
          `}
          onMessage={(event) => {
            const url = event.nativeEvent.data;
            if (url.includes(BASE_URL)) setGoBackable(url !== BASE_URL);
            console.log(event.nativeEvent.data);
          }}
          ref={(ref) => setWebview(ref)}
          onNavigationStateChange={(nav) => {
            console.log('onNavigationStateChange is called');
            // newNavState looks something like this:
            // {
            //   url?: string;
            //   title?: string;
            //   loading?: boolean;
            //   canGoBack?: boolean;
            //   canGoForward?: boolean;
            // }
            const {url, canGoBack} = nav;
            console.log('nav updated', nav);
            // detected external link
            if (!url.includes(BASE_URL)) {
              //open url with default browser
              Linking.openURL(url).catch((err) =>
                console.error("Couldn't load page", err),
              );
              webview.goBack();
            } else {
              setGoBackable(canGoBack);
            }
          }}
          allowsBackForwardNavigationGestures={true}
          source={{uri: BASE_URL}}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: '#212229',
  },
  safearea: {
    flex: 1,
    backgroundColor: '#212229',
  },
});

export default App;
