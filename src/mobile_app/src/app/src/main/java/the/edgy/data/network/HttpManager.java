package the.edgy.data.network;

import org.json.JSONObject;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

import javax.net.ssl.HttpsURLConnection;

public class HttpManager {

    private String baseUrl;
    private String lastResponse;


    //  constructor for HttpManager class
    //
    public HttpManager(String baseUrl) {
        this.baseUrl = baseUrl;
    }


    // GET request to path with JSON payload
    //
    public String serverGet(String path, JSONObject payload) {
        return serverRequest("GET", path, payload);
    }


    // POST request to path with JSON payload
    //
    public String serverPost(String path, JSONObject payload) {
        return serverRequest("POST", path, payload);
    }


    // creates a thread to send http request
    // string from response stored as class variable returned
    //
    private String serverRequest(String method, String path, JSONObject payload) {
        Thread thread = new Thread(new HttpRestRunnable(method, path, payload));
        thread.start();
        try {
            thread.join();
        }
        catch (InterruptedException e) {
            System.out.println(e);
        }
        return lastResponse;
    }


    // class Runnable to send http request using Thread
    // (in compliance with android)
    //
    private class HttpRestRunnable implements Runnable {

        private String method;
        private String path;
        private JSONObject payload;

        // constructor
        private HttpRestRunnable(String method, String path, JSONObject payload) {
            this.method = method;
            this.path = baseUrl + "/" + path;
            this.payload = payload;
        }

        @Override
        public void run() {
            try {
                URL url = new URL(path);
                HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
                connection.setDoOutput(true);
                connection.setRequestMethod(method);
                connection.setRequestProperty("Content-Type", "application/json");

                // encode json to UTF-8 and send request to server
                byte[] utfOut = payload.toString().getBytes("UTF-8");
                OutputStream out = connection.getOutputStream();
                out.write(utfOut);
                out.flush();
                out.close();

                // read response from server
                byte[] utfIn = new byte[1024];
                InputStream in = connection.getInputStream();
                in.read(utfIn);

                // decode UTF-8 response to String
                String response = new String(utfIn, StandardCharsets.US_ASCII);
                lastResponse = response.split("\0")[0];
            }
            catch (IOException e) {
                System.out.println(e);
            }

        }
    }
}
