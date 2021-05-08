package com.awesomeproject;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {
    MQTTService mqttService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      // SplashScreen.show(...) has to be called after super.onCreate(...)
      // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
      SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, false);

      mqttService = new MQTTService( this);
      mqttService.setCallback(new MqttCallbackExtended() {
          @Override
          public void connectComplete(boolean reconnect, String serverURI) { }

          @Override
          public void connectionLost(Throwable cause) { }

          @Override
          public void messageArrived(String topic, MqttMessage message) throws Exception {
              String data_to_microbit = message. toString();
              port.write(data_to_microbit.getBytes(),1000);
              // Debug
              Log.d(topic, message.toString());
          }

          @Override
          public void deliveryComplete(IMqttDeliveryToken token) { }
      });
    }

    private void sendDataMQTT(String data){
        MqttMessage msg = new MqttMessage();
        msg.setId(1234);
        msg.setQos(0);
        msg.setRetained(true);

        byte[] b = data.getBytes(Charset.forName("UTF−8"));
        msg.setPayload(b);

        Log.d("MQTT", "Publish:"+ msg);
        try {
            mqttService.mqttAndroidClient.publish("https://io.adafruit.com/Group12/feeds/test-moisture", msg);
        } catch (MqttException e){
            Log.d("MQTT", "sendDataMQTT: cannot send message");
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
