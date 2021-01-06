/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
          pullToRefreshEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          source={{uri: BASE_URL}}
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
            setGoBackable(url !== BASE_URL);
            console.log('onMessage', event.nativeEvent.data);
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
            const {url} = nav;
            console.log('nav updated', nav);
          }}
        />
        {webview && (
          <View style={styles.bottomMenu}>
            <Text style={styles.bottomMenuButton} onPress={webview.goBack}>
              <Icon name="ios-arrow-back" size={30} color="#ffffff" />
            </Text>
            <Text style={styles.bottomMenuButton} onPress={webview.goForward}>
              <Icon name="arrow-forward" size={30} color="#ffffff" />
            </Text>
            <Text style={styles.bottomMenuButton} onPress={webview.reload}>
              <Icon name="refresh" size={30} color="#ffffff" />
            </Text>
            <Text
              style={styles.bottomMenuButton}
              onPress={() => {
                webview.injectJavaScript(`
                  window.location.pathname= '/';
                  true;
                `);
              }}>
              <Icon name="home" size={30} color="#ffffff" />
            </Text>
          </View>
        )}
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
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomMenuButton: {
    padding: 16,
  },
});

export default App;
