import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * server
 */
public class server {

    public static void main(String[] args) throws IOException {
        //listens to the port specified 8080
        HttpServer server = HttpServer.create(new java.net.InetSocketAddress(8080), 0);
        server.createContext("/", new MyHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port 8080");
    }

    static class MyHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException{
            // Define the ChatGPT API endpoint
            String apiUrl = "https://api.chatgpt.com/definitions";

            // Create a URL object
            URL url = new URL(apiUrl);

            // Create an HttpURLConnection object
            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            // Set the request method to GET
            con.setRequestMethod("GET");

            // Get the response code
            int responseCode = con.getResponseCode();

            // If the response code is 200 (OK), read the response body
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Create a BufferedReader to read the response from the API
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();

                // Read the response line by line and append it to the StringBuffer
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }

                // Close the BufferedReader
                in.close();

                // Send the response back to the client
                exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.toString().getBytes());
                os.close();
            } else {
                // If the response code is not 200, send an error response back to the client
                String errorMsg = "Error fetching word and definition";
                exchange.sendResponseHeaders(HttpURLConnection.HTTP_INTERNAL_ERROR, errorMsg.length());
                OutputStream os = exchange.getResponseBody();
                os.write(errorMsg.getBytes());
                os.close();
            }
        }
    }
}
