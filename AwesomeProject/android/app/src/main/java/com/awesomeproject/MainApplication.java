package com.awesomeproject;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import org.pgsqlite.SQLitePluginPackage;
public class MainApplication extends Application implements ReactApplication {
  MQTTService mqttservice;
  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new SQLitePluginPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    
    mqttService = new MQTTService(this);
    mqttService.setCallback(new MqttCallbackExtended(){
      @Override
      public void connectComplete(boolean reconnect, String serverURI){

      }
      @Override
      public void connectionLost(Throwable cause){
        
      }
      @Override
      public void messageArrived(String topic, MqttMessage message) throws Exception{
        String data_to_microbit = message. toString();
        port. write( data_to_microbit. getBytes() ,1000);
      }
      @Override
      public void deliveryComplete(IMqttDeliveryToken token){

      }
    });
  }
  private void sendDataMQTT(String Data){
    MqttMessage msg = new MqttMessage();
    msg.setId(1234);
    msg.setQos(0);
    msg.setRetained(true);
    byte[] b = data.getBytes(Charset.forName("UTF-8"));
    msg.setPayload(b);
    Log.d("ABC","Publish:" + msg );
    try{
      mqttService.mqttAndroidClient.publish("[You subscriptiontopic]", msg);

    } catch (MqttException e){
      
    }
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.awesomeproject.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
